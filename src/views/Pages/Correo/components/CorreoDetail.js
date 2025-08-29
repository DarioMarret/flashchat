import DOMPurify from 'dompurify';
import { Card } from 'react-bootstrap';

const CorreoDetail = ({ correo, onReply }) => {
  if (!correo) {
    return <div className="p-3">Selecciona un correo para leerlo</div>;
  }

  const renderCorreo = (correo, nivel = 0) => (
    <Card key={correo.messageId} className={`mb-3 ml-${nivel * 3}`}>
      <Card.Header>
        <strong>Asunto:</strong> {correo.subject}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>De:</strong> {correo.from[0].address}<br />
          <strong>Mensaje:</strong> {correo.cuerpo_correo?.body ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(correo.cuerpo_correo.body) }} />
            ) : (
                "No hay contenido"
            )}
            <button onClick={() => onReply(correo)} className="btn btn-link p-0">Responder</button>
        </Card.Text>
        {correo.replies.length > 0 && (
            <div className="mt-4">
            <strong>Respuestas:</strong>
            {correo.replies.map(reply => renderCorreo(reply, nivel + 1))}
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="p-3">
      {renderCorreo(correo)}
    </div>
  );
};

export default CorreoDetail;
