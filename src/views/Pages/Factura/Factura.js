import { Container, Tab, Tabs } from "react-bootstrap";
import Historital from "./Components/Historital";

export default function Factura() {
  return (
    <>
      <Container fluid>
        <Tabs 
          defaultActiveKey="Historial" 
          id="uncontrolled-tab-example"
          className='justify-content-center'
          >
          <Tab eventKey="Historial" title="Historial">
            <Historital/>
          </Tab>
          <Tab eventKey="Facturas" title="Facturas">
            <h2>Facturas</h2>
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}
