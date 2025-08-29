import { BmHttp } from 'function/util/global';
import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

const EmailForm = ({ show, handleClose, initialData, ListarCorreos }) => {
  console.log(initialData);
  const [subject, setSubject] = useState(initialData.subject);
  const [to, setTo] = useState(initialData.to || '');
  const [body, setBody] = useState('');
  const [html, setHtml] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments([...attachments, ...e.target.files]);
  };


  if(initialData && initialData.show){
    setTo(initialData.to);
    setSubject(initialData.subject);
  }

  const handleOnChange = (value) => {
    setTo(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('to', to);
    formData.append('body', body);
    formData.append('from', initialData.from);
    formData.append('html', html);
    if (initialData.inReplyTo) {
      formData.append('inReplyTo', initialData.inReplyTo);
    }
    formData.append('replyTo', initialData.replyTo);
    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    try {
       const {data} = await BmHttp().post('correos', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        });
        if(data.status === 200) {
          handleClose();
          ListarCorreos();
          Swal.fire({
            icon: 'success',
            title: 'Correo enviado',
            text: 'El correo ha sido enviado correctamente',
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
        }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Modal show={show} >
      <Modal.Header>
        <Modal.Title>{initialData.isReply ? 'Responder a correo' : 'Envia nuevo correo'}</Modal.Title>
            <button type="button" className="button-bm ml-auto" onClick={handleClose}>
                <i className="fa fa-times"></i>
            </button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTo">
            <Form.Label>To:</Form.Label>
            <div className="form-group">
              {/* hacer un input y que los resultado de la busqueta salgo como un select que se va a mandar a buscar a una api rest */}
              {/* <CorreoSelect
                  value={to}
                  onChange={handleOnChange}
              /> */}
            </div>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBody">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter email body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAttachments">
            <Form.Label>Attachments</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>
            <button className="button-bm mt-3 w-100" type="submit">
                {initialData.isReply ? 'Responder' : 'Enviar'}
            </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmailForm;
