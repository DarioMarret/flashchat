/* eslint-disable jsx-a11y/iframe-has-title */
import { GetManejoConversacion, GetTokenDecoded, SetManejoConversacionStorange } from 'function/storeUsuario';
import { BmHttp } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle
} from 'react-bootstrap';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import ComponenteMultimedia from 'views/Components/ComponenteMultimedia';
import ModalRecordatorioMensajeria from 'views/Components/Modales/ModalRecordatorioMensajeria';
import socket from 'views/SocketIO';

function InfoHistorialContacto(props) {
    const dispatch = useDispatch();
    const { agenteArray } = useSelector(state => state.agentes)
    const [etiquetas, setEtiquetas] = useState([])
    const [agentes, setAgentes] = useState([]);
    const [activarNota, setActivarNota] = useState(false)
    const [verHistorialC, setVerHistorialC] = useState([])
    const [nota, setNota] = useState('')
    const [dropdownOpenEtiqueta, setDropdownOpenEtiqueta] = useState(false);
    const toggleEtiqueta = () => setDropdownOpenEtiqueta((prevState) => !prevState);
    const [contactoHistorial, setContactoHistorial] = useState([])
    const [infoContacto, setInfoContacto] = useState(GetManejoConversacion())
    const { historyInfo, ping, verHistorial } = useMensajeria();
    const [isVisible, setIsVisible] = useState(true); // Estado de visibilidad
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [paginacion , setPaginacion] = useState({
        init: 0,
        end: 5
    })
    const handleInputClick = (e) => {
      console.log('click')
      // Evitar el cierre del dropdown
      e.stopPropagation();
    };

    const OpenSelectEtiqueta = (e) => {
      e.preventDefault()
      setDropdownOpenEtiqueta(!dropdownOpenEtiqueta)
    }

    const [etiqueta, setEtiqueta] = useState({
      id: 0,
      etiqueta: '',
      color: '#'+Math.floor(Math.random()*16777215).toString(16),
      cuenta_id: GetTokenDecoded().cuenta_id
    });
    const [recordatorio, setRecordatorio] = useState({
      id: 0,
      cuenta_id: 0,
      contacto_id: 0,
      agente_id: 0,
      bot_id: 0,
      fecha: "",
      mes: 0,
      hora: "",
      nota: "",
      tipo: "",
      color: "",
      form: {},
    });
    const [show, setShow] = useState(false);
    
    const ListarEtiquetas = async () => {
        const { data, status } = await BmHttp().get(`etiqueta/${GetTokenDecoded().cuenta_id}`)
        if (status === 200) {
            setEtiquetas(data.data)
        }
    }

    const handleInputChange = (e) => {
      if(e.target.value == ''){
        setEtiqueta({
          ...etiqueta,
          etiqueta: '',
        });
        return
      }
      if(e.target.value.length > 20){
        Swal.fire({
          icon: 'warning',
          title: 'La etiqueta no puede tener mas de 20 caracteres',
          showConfirmButton: false,
          timer: 1500
        })
        return
      }
      // todo en mayuscula
      e.target.value = e.target.value.toUpperCase()
      setEtiqueta({
        ...etiqueta,
        etiqueta: e.target.value,
      });
    };

    const NombreAgente = (id) => {
        let nombre = agentes.filter((item) => item.id === id)
        if (nombre.length > 0) {
            return nombre[0].nombre
        } else {
            return "Sin agente"
        }
    }

    const CrearRecordatorio = async () => {
      const { status } = await BmHttp().post("recordatorio", recordatorio);
      if (status !== 200) {
        Swal.fire({
          icon: "error",
          title: "Error al crear recordatorio",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Recordatorio creado con exito",
          showConfirmButton: false,
          timer: 1500,
        });
        handClose();
      }
    };

    const HistorialContacto = async () => {
        try {
            const conV = GetManejoConversacion()
            if (conV === null || conV === undefined) {
              setContactoHistorial([])
              return null
            }
            const { data, status } = await BmHttp().post(`conversacion_historial?init=${paginacion.init}&end=${paginacion.end}`, {
                cuenta_id: GetTokenDecoded().cuenta_id,
                contacto_id: conV.contacto_id,
                nombreunico: conV.nombreunico,
            })
            
            if (status === 200 && data.data !== null && data.data.length > 0) {
                // console.log(data.data)
                setVerHistorialC(data.data)
                var card = []
                // buscar todas las conversaciones con el contacto_id y el nombreunico de la convresacion activa
                data.data.map((item) => {
                    if (conV.contacto_id === item.contacto_id && conV.nombreunico === item.nombreunico) {
                        // que no se repita conversacione_id
                        card.push(item)
                    }
                })
                // sacar el ultimo mensaje de cada conversacion
                card = card.filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.conversacion_id === item.conversacion_id
                    )))
                setContactoHistorial([...card, ...contactoHistorial])
            }

        } catch (error) {
            console.log(error)
        }
    }

    const VerHistorialIDConversacion = async (conversacion_id, contacto_id, nombreunico) => {
      const { data, status } = await BmHttp().post(`conversacion_historial?init=0&end=0`, {
        cuenta_id: GetTokenDecoded().cuenta_id,
        contacto_id: contacto_id,
        conversacion_id: conversacion_id,
        nombreunico: nombreunico,
      })
      if (status === 200) {
        // verHistorial(data.data)
        dispatch({type: 'SET_HISTORIAL', payload: data.data})
      }
    }

    const ListarAgentes = async () => {
      let ag = []
      agenteArray.map((agente, index) => {
        ag.push({
          id: agente.id,
          cuenta_id: agente.cuenta_id,
          nombre: agente.nombre,
        })
      })
      setAgentes(ag)
    }

    const AgregarEtiqueta = async (etiqueta) => {
        let covActiva = GetManejoConversacion();
        const { data } = await BmHttp().post(`conversacion_etiqueta`, {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: covActiva.conversacion_id,
            contacto_id: covActiva.contacto_id,
            nombreunico: covActiva.nombreunico,
            etiqueta: etiqueta,
            accion: 'agregar'
        })
        if (data.status === 200) {
            setDropdownOpenEtiqueta(false)
            covActiva.etiquetas_estado = data.data.etiquetas_estado
            SetManejoConversacionStorange(covActiva)
            historyInfo()
            socket.emit("listar_conversacion", {
              cuenta_id: GetTokenDecoded().cuenta_id,
              equipo_id: null,
              agente_id: GetTokenDecoded().id,
              estado: null,
            })
        }
    }

    const RemoverEtiquetas = async (item, etiqueta) => {
        let covActiva = GetManejoConversacion();
        const { data } = await BmHttp().post(`conversacion_etiqueta`, {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: covActiva.conversacion_id,
            contacto_id: covActiva.contacto_id,
            nombreunico: covActiva.nombreunico,
            etiqueta: etiqueta,
            accion: 'remover'
        })
        if (data.status === 200) {
            covActiva.etiquetas_estado = data.data.etiquetas_estado
            SetManejoConversacionStorange(covActiva)
            historyInfo()
            socket.emit("listar_conversacion", {
              cuenta_id: GetTokenDecoded().cuenta_id,
              agente_id: GetTokenDecoded().id,
            })
        }
    }

    const handClose = () => {
      setShow(!show);
    };
    
    const OpenRecordatorio = () => {
      setShow(true);
      setRecordatorio({
        ...recordatorio,
        bot_id: GetTokenDecoded().botId.filter((item) => item.name === GetManejoConversacion().bot)[0].id,
        contacto_id: GetManejoConversacion().Contactos.id,
        cuenta_id: GetTokenDecoded().cuenta_id
      });
    }

    const CrearNuevaEtiquet = async () => {
      let url = 'etiqueta'
      // evitar que la etiqueta sea crer con un color blanco
      if(etiqueta.color === '#ffffff'){
        // le asignamos un color aleatorio
        etiqueta.color = '#'+Math.floor(Math.random()*16777215).toString(16)
      }
      // minimo 6 caracteres
      if(etiqueta.etiqueta.length < 6){
        Swal.fire({
          icon: 'warning',
          title: 'La etiqueta debe tener minimo 6 caracteres',
          showConfirmButton: false,
          timer: 1500
        })
        return
      }
      const { status } = await BmHttp().post(url, etiqueta)
      if(status === 200){
          Swal.fire({
              icon: 'success',
              title: 'Etiqueta creada',
              showConfirmButton: false,
              timer: 1500
          }).then(() => {
              ListarEtiquetas()
              // limpiar el input
              setEtiqueta({
                id: 0,
                etiqueta: '',
                color: '#'+Math.floor(Math.random()*16777215).toString(16),
                cuenta_id: GetTokenDecoded().cuenta_id
              })
          })
      }

    }
    const handleOnchange = (e) => {
      setRecordatorio({
        ...recordatorio,
        [e.target.name]: e.target.value,
      });
    };

    const HandleActivarNota = () => {
        setActivarNota(!activarNota)
    }

    const HandleGuardarNota = () => {
        let covActiva = GetManejoConversacion()
        socket.emit('guardar_nota', {
            cuenta_id: GetTokenDecoded().cuenta_id,
            contacto_id: covActiva.contacto_id,
            conversacion_id: covActiva.conversacion_id,
            nombreunico: covActiva.nombreunico,
            nota: nota,
        })
        // actualizar la nota en el localstorage
        covActiva.nota = nota
        SetManejoConversacionStorange(covActiva)
        historyInfo()
        setNota('')
        setActivarNota(false)
    }

    useEffect(() => {
        (async () => {
            setInfoContacto(GetManejoConversacion())
            ListarAgentes()
            await ListarEtiquetas()
            await HistorialContacto()
        })()
    }, [ping])

    // Cargar la posición desde localStorage cuando el componente se monte
    useEffect(() => {
        const savedPosition = localStorage.getItem('buttonPosition');
        if (savedPosition) {
        setPosition(JSON.parse(savedPosition));
        }
      // validar si hay una conversacion activa
      if (GetManejoConversacion() === null) {
        setIsVisible(false)
      }else{
        setIsVisible(true)
      }

    }, []);
    // Guardar la posición en localStorage cuando cambie
    const handleDragStop = (e, data) => {
      const newPosition = { x: data.x, y: data.y };
      setPosition(newPosition);
      localStorage.setItem('buttonPosition', JSON.stringify(newPosition));
    };



    return (
        <>
        <Draggable
            axis='y'
            position={position} 
            onStop={handleDragStop}
        >
            <button 
                className='button-bm'
                style={{ position: 'absolute', top: '50px', right: '0', zIndex: '1000',
                  background: '#BFBFC1', border: 'none',
                  height: '40px', width: '50px',
                }}
                onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? 
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                      arrow_back_ios
                  </span> :
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                      arrow_forward_ios
                  </span>
                }
            </button>
        </Draggable>
        {isVisible && (
          <div className={`chat-list chat-list-transition bg-chat rounded-end ${isVisible ? '' : 'hidden'}`} style={{ overflow: 'auto' }}>
            <div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
              <div className="w-100 d-flex gap-2 pb-3">
                <div className="rounded-circle overflow-hidden">
                  <img src={infoContacto ? infoContacto.Contactos.avatar : null} className="rounded-circle" width={50} />
                </div>
  
                <div className="d-flex flex-column">
                  <span className="text-span font-bold" style={{ fontSize: '18px' }}>
                    {infoContacto ? infoContacto.Contactos.nombre : null}
                  </span>
                  <span className="text-span">{infoContacto ? infoContacto.Contactos.telefono : null}</span>
                </div>
              </div>
  
              <div className="w-100 py-2 d-flex flex-column gap-2 pb-3">
                <div className="bg-blue p-2 rounded">
                  <span className="text-white font-bold">Información</span>
                </div>
  
                <div className="d-flex gap-2 align-items-center">
                  <span className="material-symbols-outlined text-span" style={{ fontSize: '20px' }}>
                    smart_toy
                  </span>
                  <span className="font-bold text-span box-info-text">
                    {infoContacto ? infoContacto.bot : null}
                  </span>
                </div>
  
                <div className="d-flex gap-2 align-items-center">
                  <span className="material-symbols-outlined text-span" style={{ fontSize: '20px' }}>
                    schedule
                  </span>
                  <span className="font-bold text-span box-info-text">
                    {infoContacto ? infoContacto.fecha : null}
                  </span>
                </div>
                {/* anadir recordatorio */}
                <div className="d-flex gap-2 align-items-center" style={{cursor: 'pointer'}} onClick={() => {
                  OpenRecordatorio()
                }}>
                  <span className="material-symbols-outlined text-span" style={{ fontSize: '20px' }}>
                    alarm
                  </span>
                  <span className="font-bold text-span box-info-text cursor-pointer" >
                    Crear recordatorio
                  </span>
                </div>
              </div>
  
              <div className="w-100 py-2 d-flex flex-column gap-3">
                <div className="bg-blue p-2 rounded justify-content-between d-flex">
                  <span className="text-white font-bold">Etiquetas</span>
                  <Dropdown 
                    isOpen={dropdownOpenEtiqueta} 
                    toggle={(e)=>OpenSelectEtiqueta(e)} 
                    direction="up" 
                    onKeyDown={(e)=>{
                      console.log('onKeyDown: ', e.key)
                      if (e.key === ' ' || e.keyCode === 32) {
                        e.stopPropagation(); // Evita que el dropdown se abra al presionar espacio
                        e.preventDefault();  // Previene el comportamiento predeterminado
                      }
                    }}>
                    <DropdownToggle
                      data-toggle="dropdown"
                      tag="span"
                      className="cursor-pointer"
                      style={{ padding: '0px 5px 0px 5px', margin: '0px' }}
                    />
                    <DropdownMenu>
                      {etiquetas.map((item, index) => (
                        <DropdownItem key={index + 1} className="d-flex align-items-center gap-2" onClick={() => AgregarEtiqueta(item)}>
                          <span style={{ color: item.color }}>{item.etiquetas}</span>
                          
                        </DropdownItem>
                      ))}
                      {/* 
                        Lo opcion de crear nuevas etiquetas desde un imput
                       */}
                      <DropdownItem
                        className="d-flex align-items-center gap-2"
                      //  cuando se aga click se tiene que mantener el input abierto
                      >
                        {/* que pueda escojet el color de la etiqueta */}
                        <input
                            type="text"
                            className="form-control text-black"
                            style={{ 
                              width: '100%',
                              fontSize: '14px',
                              // quitar el borde del input y el focus
                              border: 'none',
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                            placeholder="Nueva etiqueta"
                            value={etiqueta.etiqueta}
                            onChange={handleInputChange}
                            onClick={handleInputClick}
                            onKeyDown={(e)=>{
                              console.log('onKeyDown: ', e.target.value)
                              if (e.key === '' || e.keyCode === 32) {
                                e.stopPropagation(); // Evita que el dropdown se abra al presionar espacio
                              }
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' || e.keyCode === 13) {
                                // Aquí puedes manejar la creación de la nueva etiqueta
                                CrearNuevaEtiquet();
                              }
                            }}
                          />
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
  
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  {infoContacto && infoContacto.etiquetas_estado
                    ? infoContacto.etiquetas_estado.map((item, index) => (
                        <span 
                            key={index + 1} 
                            className="chat-tag rounded text-white p-1" 
                            style={{ background: item.color }}>
                          <i className="fas fa-times-circle"
                            onClick={() => RemoverEtiquetas(infoContacto, item)}
                            style={{ cursor: 'pointer' }}
                          ></i>
                          {item.etiquetas}
                        </span>
                      ))
                    : null}
                </div>
              </div>
  
              <div className="w-100 py-2 d-flex flex-column gap-3">
                <div className="bg-blue p-2 rounded justify-content-between d-flex">
                  <span className="text-white font-bold">Notas</span>
                  <span className="material-symbols-outlined text-white cursor-pointer" onClick={(e) => HandleActivarNota()}>
                    more
                  </span>
                </div>
                {activarNota ? (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Agregar nota"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.keyCode === 13) {
                        HandleGuardarNota();
                      }
                    }}
                  />
                ) : null}
  
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  {infoContacto && infoContacto.nota ? (
                    <span className="chat-tag rounded text-black p-1">{infoContacto.nota}</span>
                  ) : null}
                </div>
              </div>
  
              <div className="w-100 py-2 d-flex flex-column gap-2 pb-3" style={{ maxHeight: '300px' }}>
                <div className="bg-blue p-2 rounded">
                  <span className="text-white font-bold">Conversaciones anteriores</span>
                </div>
  
                <div
                  className="w-100 d-flex flex-column gap-2"
                  style={{
                    maxHeight: '500px',
                    minHeight: '500px',
                    overflow: 'auto',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {contactoHistorial.map((item, index) => (
                    <div
                      className="border w-100 p-2 rounded d-flex flex-column gap-1 cursor-pointer bg-white"
                      key={index + 1}
                      onClick={() => VerHistorialIDConversacion(item.conversacion_id, item.contacto_id)}
                    >
                      <section className="w-100 d-flex justify-content-between">
                        <span className="text-span font-bold box-info-text">Conversacion #{item.conversacion_id}</span>
                        <span className="text-span font-bold box-info-text">Estado: {item.estado}</span>
                      </section>
  
                      <section className="w-100 d-flex justify-content-between">
                        <span className="text-span font-bold box-info-text">{infoContacto ? infoContacto.Contactos.nombre : null}</span>
                        <span className="text-span box-info-text">{moment(item.updatedAt).format('YYYY/MM/DD HH:mm')}</span>
                      </section>
                      <span className="text-span box-info-text font-bold">Agente: {NombreAgente(item.agente_id)}</span>
                      <p className="box-info-text m-0 text-span">
                        <span className="material-symbols-outlined box-info-text">arrow_top_left</span>
                        <ComponenteMultimedia item={item.mensajes} />
                      </p>
                    </div>
                    
                  ))}
                    {/* una opcion para ver cargar mas conversaciones */}
                    {
                      contactoHistorial.length === 0 ? (
                        <div className="w-100 d-flex justify-content-center">
                          <span className="text-span font-bold box-info-text">No hay conversaciones anteriores</span>
                        </div>
                      ) : 
                      <div className="w-100 d-flex justify-content-center">
                        <button className="button-bm ml-2"
                          onClick={() => 
                            setPaginacion({init: paginacion.init + 5, end: paginacion.end + 5})+
                            HistorialContacto()
                          }> 
                            <i className="fas fa-plus"></i> Cargar más conversaciones
                        </button>
                      </div>
                    }

                </div>
              </div>
            </div>
          </div>
        )}
        <ModalRecordatorioMensajeria
          show={show}
          handClose={handClose}
          recordatorio={recordatorio}
          handleOnchange={handleOnchange}
          CrearRecordatorio={CrearRecordatorio}
        />
      </>
    );
}

export default InfoHistorialContacto;