import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
  Button,
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
        <h1 className='p-2'>Infomación de la cuenta</h1>

        <Card className='mb-4'>
          <Card.Body>
            <div className='d-flex flex-column'>
              <h5 className='text-blue'><b>Datos de la cuenta</b></h5>

              <div className='d-flex flex-row gap-2 align-items-center mt-2'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">storefront</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Empresa</span>
                    <span className='text-span font-bold'>Flaschat</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">vpn_key</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Token</span>
                    <span className='text-span font-bold'>clru028bv0000nt3d3x77e6d5</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">info</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Estado</span>
                    <span className='text-span font-bold'>Activo</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">calendar_month</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Fecha de creación</span>
                    <span className='text-span font-bold'>2024-02-24</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className='mb-4'>
          <Card.Body>
            <div className='d-flex flex-column'>
              <h5 className='text-blue'><b>Datos del Administrador</b></h5>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">manage_accounts</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Perfil</span>
                    <span className='text-span font-bold'>Administrador</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-2'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">alternate_email</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Correo</span>
                    <span className='text-span font-bold'>super@flashchat.chat</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">smartphone</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Contacto</span>
                    <span className='text-span font-bold'>No tiene</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">smart_toy</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Bots creados</span>
                    <span className='text-span font-bold'>3</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className='mb-4'>
          <Card.Body>
            <div className='d-flex flex-column'>
              <h5 className='text-blue'><b>Datos del Plan</b></h5>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">favorite</span>
                </div>

                <div className='w-100 d-flex flex-row gap-2 align-items-center justify-content-between'>
                  <div className='gap-2 h-100 border-start d-flex flex-row'>
                    <div className='mr-2 d-flex flex-column' 
                    style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                      <span className='text-span'>Plan</span>
                      <span className='text-span font-bold'>Free</span>
                    </div>
                  </div>

                  <div
                  style={{ marginLeft: '40px' }}>
                    <button className='btn btn-outline-success'>
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">timer</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Demostración</span>
                    <span className='text-danger font-bold'>3 días restantes</span>
                  </div>
                </div>
              </div>
              
              <div className='d-flex flex-row gap-2 align-items-center mt-2'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">attach_money</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Precio</span>
                    <span className='text-span font-bold'>0</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">smart_toy</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Capacidad de Bots</span>
                    <span className='text-span font-bold'>4 máximo</span>
                  </div>
                </div>
              </div>

              <div className='d-flex flex-row gap-2 align-items-center mt-3'>
                <div className='h-100'>
                  <span class="material-symbols-outlined text-span">support_agent</span>
                </div>

                <div className='gap-0 h-100 border-start'>
                  <div className='mr-2 d-flex flex-column' 
                  style={{ paddingLeft: '15px', lineHeight: '20px' }}>
                    <span className='text-span'>Capacidad de Agentes</span>
                    <span className='text-span font-bold'>10 máximo</span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
