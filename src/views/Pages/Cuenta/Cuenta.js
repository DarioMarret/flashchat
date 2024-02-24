import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Container,
} from 'react-bootstrap';
// import Swal from 'sweetalert2';

export default function Cuenta() {
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
        <Card>
            <h1>Infomacion de La cuenta</h1>
        </Card>

      </Container>
    </>
  )
}
