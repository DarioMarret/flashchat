import { Container, Tab, Tabs } from "react-bootstrap";
import Historital from "./Components/Historital";
import ProximaFactura from "./Components/ProximaFactura";

export default function Factura() {
  return (
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
          <ProximaFactura/>
        </Tab>
      </Tabs>
    </Container>
  )
}
