import { Card } from "react-bootstrap";

export default function CardRecordatorio({ recordatorio, index }) {
  return (
    <Card style={{ width: "18rem", borderTop: "5px solid "+recordatorio.color }} className="mx-1 shadow">
      <Card.Header>
        {recordatorio.tipo ? recordatorio.tipo : "Recordatorios"}
      </Card.Header>
      <Card.Body>
        <Card.Title>{
            recordatorio.title ? recordatorio.title : "Recordatorio "+index    
        }</Card.Title>
        <Card.Text>{
            recordatorio.nota ? recordatorio.nota : "Recordatorio 1"
        }</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{
            "Fecha: "+ recordatorio.fecha + " " + recordatorio.hora
      }</Card.Footer>
    </Card>
  );
}
