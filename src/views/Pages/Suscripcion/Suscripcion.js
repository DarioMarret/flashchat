import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
  // Card,
  Container,
} from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import Swal from 'sweetalert2';

export default function Suscripciones() {
  const [cuenta, setCuenta] = useState(null);
  const [planes, setPlanes] = useState([])
  const [historial, setHistorial] = useState([])
  const [facturas, setFacturas] = useState([])

  const ListarCuenta = async () => {
    const token = GetTokenDecoded();
    if (token === null) {
      return;
    }
    const id = token.id;
    const url = host + "api/suscripcion/cuenta/" + id;
    await axios.get(url)
      .then(response => {
        setCuenta(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    console.log('useEffect')
  }, []);

  return (
    <>
      <Container fluid>
        <Tabs 
          defaultActiveKey="Planes" 
          id="uncontrolled-tab-example"
          className='justify-content-center'
          >
          <Tab eventKey="Cuenta" title="Mi Cuenta">
            <h2>Mi cuenta</h2>
          </Tab>        
          <Tab eventKey="Planes" title="Planes">
            <h2>Mi cuenta</h2>
          </Tab>
          <Tab eventKey="Historial" title="Historial">
            <h2>Mi cuenta</h2>
          </Tab>
          <Tab eventKey="Facturas" title="Facturas">
            <h2>Mi cuenta</h2>
          </Tab>
        </Tabs>

      </Container>
    </>
  )
}
