import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { host } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
  Container,
} from 'react-bootstrap';
import Swal from 'sweetalert2';
// import Swal from 'sweetalert2';

export default function Suscripciones() {
  const [planes, setPlanes] = useState([])
  const [ListarPlanAsignado, setListarPlanAsignado] = useState(null)
  const [planSeleccionado, setPlanSeleccionado] = useState({
    id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
    plan_id: 0,
    agente_id: GetTokenDecoded().id,
    cantidad_agentes: 0,
    cantidad_bots: 0,
    precio: 0,
  })
  const [planGold, setPlanGold] = useState({
    id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
    plan_id: 0,
    agente_id: GetTokenDecoded().id,
    cantidad_agentes: 0,
    cantidad_bots: 0,
    precio: 0,
  })

  const ListarCuenta = async () => {
    const url = `${host}planes`;
    await axios.get(url)
      .then(response => {
        response.data.data.map((plan, index) => {
          if(plan.id === 4){
            setPlanGold(plan)
          }
        })
        setPlanes(response.data.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const PlanAsignado = async () => {
    const url = `${host}cuenta_plan/${GetTokenDecoded().cuenta_id}`
    const { data } = await axios.get(url)
    setListarPlanAsignado(data.data[0]);
  }

  const SeleccionarPlan = (plan) => {
    // if(plan.id === 4){
    //   plan = planGold
    // }
    let info = {
      ...plan,
      ...planGold,
      plan_id: plan.id,
      cuenta_id: GetTokenDecoded().cuenta_id,
      agente_id: GetTokenDecoded().id
    }
    setPlanSeleccionado(info)
    if(ListarPlanAsignado.plan_id === 1){
      SuscribirPlan(info)
      PlanAsignado()
    }else if(plan.id === 2 || plan.id === 3){
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Al cambiar de plan se perderán los datos de la cuenta",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cambiar'
      }).then((result) => {
        if (result.isConfirmed) {
          SuscribirPlan(info)
          PlanAsignado()
        }
      })
    }else{
      SuscribirPlan(info)
      PlanAsignado()
    }
  }

  const SuscribirPlan = async (info) => {
    const url = `${host}suscribir_plan`
    await axios.post(url, info)
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Felicidades',
        text: 'Plan suscrito con éxito',
      })
      PlanAsignado()
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal!',
      })
    })
  }

  useEffect(() => {
    (async()=>{
      await PlanAsignado()
      await ListarCuenta()
    })()
  }, []);

  return (
    <>
      <Container fluid className='w-100 h-100'>
        <h2 className='mb-0 text-center font-bold' 
          style={{ letterSpacing: '2px', color: '#6c6c6e' }}>Elige tu plan ideal..!
        </h2>

        <div className='w-100 h-100 content-custom'>
          <div className='d-flex flex-column flex-lg-row py-2 gap-3 justify-content-center'>
            {
              planes.map((plan, index) => {
                if(plan.id === 3){
                 return <div className='box-plan box-plan-active d-flex flex-column w-100 gap-2 shadow'>
                  <div className='box-plan-title text-center box-plan-plus'>{plan.plan}</div>
    
                  <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                    <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                      <sup>$</sup>
                        {plan.precio}
                      <sub>/mes</sub>
                    </h2>
    
                    <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                      <p className='m-0'>{plan.cantidad_agentes} Agentes</p>
                      <p className='m-0'>{plan.cantidad_bots} Conexion</p>
                    </div>
                  </div>
    
                  <div className='box-plan-button w-100 mb-3'>
                    <button className='w-100 box-plan-button-suscribir button-plus' onClick={()=>SeleccionarPlan(plan)}>Suscribir</button>
                  </div>
    
                  <div className='box-plan-descripcion'>
                    <ul>
                      {
                        plan.descripcion.map((detall, index) => {
                            return <li class="d-flex align-items-center gap-1">
                              <span class="material-symbols-outlined text-success" 
                              style={{fontSize: '20px'}}>done</span>{detall}
                            </li>
                        })
                      }
                    </ul>
                  </div>
                </div>
                }else if(plan.id === 2){
                  return <div className='box-plan d-flex flex-column w-100 gap-2'>
                    <div className='box-plan-title text-center box-plan-basic'>{plan.plan}</div>

                    <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                      <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                        <sup>$</sup>
                          {plan.precio}
                        <sub>/mes</sub>
                      </h2>

                      <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                        <p className='m-0'>{plan.cantidad_agentes} Agentes</p>
                        <p className='m-0'>{plan.cantidad_bots} Conexiones</p>
                      </div>
                    </div>

                    <div className='box-plan-button w-100 mb-3'>
                      <button className='w-100 box-plan-button-suscribir' onClick={()=>SeleccionarPlan(plan)}>Suscribir</button>
                    </div>

                    <div className='box-plan-descripcion'>
                      <ul>
                      {
                        plan.descripcion.map((detall, index) => {
                            return <li class="d-flex align-items-center gap-1">
                              <span class="material-symbols-outlined text-success" 
                              style={{fontSize: '20px'}}>done</span>{detall}
                            </li>
                        })
                      }
                      </ul>
                    </div>
                  </div>
                }else if (plan.id === 4){
                 return <div className='box-plan d-flex flex-column w-100 gap-2'>
                    <div className='box-plan-title text-center box-plan-gold'>{plan.plan}</div>
                    <div className='box-plan-feature d-flex flex-column justify-content-center my-3'>
                      <h2 className='box-plan-feature-price text-blue font-bold text-center'>
                        <sup>$</sup>
                          {planGold.precio}
                        <sub>/mes</sub>
                      </h2>

                      <div className='text-center d-flex flex-column box-plan-feature-item mt-2'>
                        <div className='d-flex gap-2 align-items-center justify-content-center'>
                          <button className="button-operation"
                            // no puede ser menos a la cantidad inicial
                            onClick={()=>{
                              if(planGold.cantidad_agentes > plan.cantidad_agentes){
                                setPlanGold({...planGold, cantidad_agentes: planGold.cantidad_agentes - 1, precio: planGold.precio - 20})
                              }
                            }}
                          >-</button>
                          <p className='m-0'>{planGold.cantidad_agentes} Agentes</p>
                          <button className="button-operation"
                            onClick={()=>{
                              setPlanGold({...planGold, cantidad_agentes: planGold.cantidad_agentes + 1, precio: planGold.precio + 20})
                            }}
                          >+</button>
                        </div>

                        <div className='d-flex gap-2 align-items-center justify-content-center'>
                          <button className="button-operation"
                            // no puede ser menos a la cantidad inicial
                            onClick={()=>{
                              if(planGold.cantidad_bots > plan.cantidad_bots){
                                setPlanGold({...planGold, cantidad_bots: planGold.cantidad_bots - 1, precio: planGold.precio - 35})
                              }
                            }}
                          >-</button>
                          <p className='m-0'>{planGold.cantidad_bots} Conexiones</p>
                          <button className="button-operation"
                            onClick={()=>{
                              setPlanGold({...planGold, cantidad_bots: planGold.cantidad_bots + 1, precio: planGold.precio + 35})
                            }}
                          >+</button>
                        </div>
                      </div>
                    </div>

                    <div className='box-plan-button w-100 mb-3'>
                      <button className='w-100 box-plan-button-suscribir' onClick={()=>SeleccionarPlan(plan)}>Suscribir</button>
                    </div>

                    <div className='box-plan-descripcion'>
                      <ul>
                      {
                        plan.descripcion.map((detall, index) => {
                            return <li class="d-flex align-items-center gap-1">
                              <span class="material-symbols-outlined text-success" 
                              style={{fontSize: '20px'}}>done</span>{detall}
                            </li>
                        })
                      }
                      </ul>
                    </div>
                  </div>
                }
              })
            }




          </div>
        </div>
      </Container>
    </>
  )
}
