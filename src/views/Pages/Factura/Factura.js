import { Container, Tab, Tabs } from "react-bootstrap";

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
            <h2>Historial</h2>
          </Tab>
          <Tab eventKey="Facturas" title="Facturas">
            <h2>Facturas</h2>
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}
