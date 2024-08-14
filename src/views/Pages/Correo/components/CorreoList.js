import { colorPrimario } from 'function/util/global';
import moment from 'moment';
import { ListGroup, Spinner } from 'react-bootstrap';

const CorreoList = ({ correos, loading, onSelectCorreo, onReply }) => {
  const renderCorreo = (correo, nivel = 0) => {
    return (
      <div key={correo.messageId} style={{ paddingLeft: `${nivel * 20}px` }}>
        <ListGroup.Item onClick={() => onSelectCorreo(correo)}>
          <div>
            <div
              className='d-flex justify-content-between'
            >
              <strong>{correo.subject}</strong>
              <span>{moment(correo.date).format("DD/MM/YYYY HH:mm")}</span>
            </div>
            <div>{correo.from[0].address}</div>
            <button onClick={(e) => { e.stopPropagation(); onSelectCorreo({ ...correo, isReply: true }); }} className="btn btn-link p-0">Responder</button>
          </div>
        </ListGroup.Item>
        {correo.replies && correo.replies.length > 0 && (
          <div>
            {correo.replies.map(reply => renderCorreo(reply, nivel + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <ListGroup variant="flush">
      <div className="w-100 d-flex justify-content-center align-items-center mt-1">
        {
          loading ? (
            <div className="w-100 d-flex justify-content-center align-items-center mt-1">
              <Spinner animation="border" 
                style={{
                  color: colorPrimario
                }}
              >
              </Spinner>
            </div>
          ) : null
        }
      </div>
      {correos.map(correo => renderCorreo(correo))}
    </ListGroup>
  );
};

export default CorreoList;
