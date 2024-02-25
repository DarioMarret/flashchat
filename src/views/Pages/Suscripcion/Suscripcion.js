import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
  Container,
} from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
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
      <Container fluid className='w-100 h-100'>
        <h2 className='mb-0 text-center font-bold' 
          style={{ letterSpacing: '2px', color: '#6c6c6e' }}>Elige tu plan ideal..!
        </h2>

        <div className='w-100 h-100 content-custom'>
          <div className='d-flex flex-column flex-lg-row py-2 gap-3 justify-content-center'>
            <div className='box-plan d-flex flex-column w-100 gap-2'>
              <div className='box-plan-title text-center box-plan-basic'>Plan Básico</div>

              <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                  <sup>$</sup>
                    50
                  <sub>/mes</sub>
                </h2>

                <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                  <p className='m-0'>5 Agentes</p>
                  <p className='m-0'>1 Canal</p>
                </div>
              </div>

              <div className='box-plan-button w-100 mb-3'>
                <button className='w-100 box-plan-button-suscribir'>Suscribir</button>
              </div>

              <div className='box-plan-descripcion'>
                <ul>
                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    1 GB Almacenamiento multimedia
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Conversaciones ilimitadas
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Soporte 24/7
                  </li>
                </ul>
              </div>
            </div>

            <div className='box-plan box-plan-active d-flex flex-column w-100 gap-2 shadow'>
              <div className='box-plan-title text-center box-plan-plus'>Plan Plus</div>

              <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                  <sup>$</sup>
                    100
                  <sub>/mes</sub>
                </h2>

                <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                  <p className='m-0'>10 Agentes</p>
                  <p className='m-0'>4 Canales</p>
                </div>
              </div>

              <div className='box-plan-button w-100 mb-3'>
                <button className='w-100 box-plan-button-suscribir button-plus'>Suscribir</button>
              </div>

              <div className='box-plan-descripcion'>
                <ul>
                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    1 GB Almacenamiento multimedia
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Conversaciones ilimitadas
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Soporte 24/7
                  </li>
                </ul>
              </div>
            </div>

            <div className='box-plan d-flex flex-column w-100 gap-2'>
              <div className='box-plan-title text-center box-plan-gold'>Plan Gold</div>
              <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                  <sup>$</sup>
                    70
                  <sub>/mes</sub>
                </h2>

                <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                  <div className='d-flex gap-2 align-items-center justify-content-center'>
                    <button className="button-operation">-</button>
                    <p className='m-0'>6 Agentes</p>
                    <button className="button-operation">+</button>
                  </div>

                  <div className='d-flex gap-2 align-items-center justify-content-center'>
                    <button className="button-operation">-</button>
                    <p className='m-0'>4 Canales</p>
                    <button className="button-operation">+</button>
                  </div>
                </div>
              </div>

              <div className='box-plan-button w-100 mb-3'>
                <button className='w-100 box-plan-button-suscribir'>Suscribir</button>
              </div>

              <div className='box-plan-descripcion'>
                <ul>
                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    1 GB Almacenamiento multimedia
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Conversaciones ilimitadas
                  </li>

                  <li class="d-flex align-items-center gap-1">
                    <span class="material-symbols-outlined text-success" 
                    style={{fontSize: '20px'}}>done</span>
                    Soporte 24/7
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
