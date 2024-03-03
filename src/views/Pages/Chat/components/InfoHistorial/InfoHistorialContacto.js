import axios from 'axios';
import { GetManejoConversacion, GetTokenDecoded, SetManejoConversacionStorange } from 'function/storeUsuario';
import { host } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
    Dropdown, DropdownItem, DropdownMenu, DropdownToggle
} from 'react-bootstrap';

function InfoHistorialContacto(props) {
    const [etiquetas, setEtiquetas] = useState([])
    const [agentes, setAgentes] = useState([]);
    const [verHistorialC, setVerHistorialC] = useState([])
    const [dropdownOpenEtiqueta, setDropdownOpenEtiqueta] = useState(false);
    const toggleEtiqueta = () => setDropdownOpenEtiqueta((prevState) => !prevState);
    const [contactoHistorial, setContactoHistorial] = useState([])
    const [infoContacto, setInfoContacto] = useState(GetManejoConversacion())
    const { historyInfo, ping, verHistorial } = useMensajeria();


    
    const ListarEtiquetas = async () => {
        let url = host + 'etiqueta/' + GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if (status === 200) {
            setEtiquetas(data.data)
        }
    }

    const NombreAgente = (id) => {
        let nombre = agentes.filter((item) => item.id === id)
        if (nombre.length > 0) {
            return nombre[0].nombre
        } else {
            return "Sin agente"
        }
    }

    const HistorialContacto = async () => {
        try {
            const conV = GetManejoConversacion()
            if (conV === null || conV === undefined) {
                return null
            }
            const { data, status } = await axios.post(`${host}conversacion_historial`, {
                cuenta_id: GetTokenDecoded().cuenta_id,
                contacto_id: conV.contacto_id,
                nombreunico: conV.nombreunico,
            })
            
            if (status === 200 && data.data !== null && data.data.length > 0) {
                // console.log(data.data)
                setVerHistorialC(data.data)
                var card = []
                // biscar todas las conversaciones con el contacto_id y el nombreunico de la convresacion activa
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
                setContactoHistorial(card)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const VerHistorialIDConversacion = async (conversacion_id, contacto_id) => {
        var conversacion = []
        verHistorialC.map((item) => {
            if (item.conversacion_id === conversacion_id && item.contacto_id === contacto_id) {
                conversacion.push(item)
            }
        })
        conversacion.sort((a, b) => a.id - b.id)
        verHistorial(conversacion)
    }

    const ListarAgentes = async () => {
        const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
        const { data, status } = await axios.get(url)
        if (status === 200) {
            let ag = []
            data.data.map((agente, index) => {
                ag.push({
                    id: agente.id,
                    cuenta_id: agente.cuenta_id,
                    nombre: agente.nombre,
                })
            })
            setAgentes(ag)
        } else {
            setAgentes([])
        }
    }

    const AgregarEtiqueta = async (etiqueta) => {
        let covActiva = GetManejoConversacion();
        const { data } = await axios.post(`${host}conversacion_etiqueta`, {
            cuenta_id: GetTokenDecoded().cuenta_id,
            conversacion_id: covActiva.conversacion_id,
            contacto_id: covActiva.contacto_id,
            nombreunico: covActiva.nombreunico,
            etiqueta: etiqueta,
        })
        if (data.status === 200) {
            setDropdownOpenEtiqueta(false)
            covActiva.etiquetas_estado = data.data.etiquetas_estado
            SetManejoConversacionStorange(covActiva)
            historyInfo()
        }
    }

    const CompomenteMultimedis = (item) => {
        if (item === null || item === undefined) {
            return null;
        }
        if (item.type === "text") {
            return <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} >{String(item.text)}</span>;
        } else if (item.type === "image") {
            // cuando se haga click en la imagen se debe abrir en un modal
            return (
                <img
                    src={item.url}
                    alt="..."
                    className="mr-3"
                    width={250}
                    onClick={() => {
                        window.open(item.url, "_blank");
                    }}
                />
            );
        } else if (item.type === "video") {
            return (
                <video controls width={250}>
                    <source src={item.url} type="video/mp4" />
                </video>
            )
        } else if (item.type === "contact") {
            return <span className="">{String(item.text)}</span>;
        } else if (item.type === "file") {
            // preview del archivo
            if (item.url.split('.').pop() === 'xlsx' || item.url.split('.').pop() === 'xls') {
                // si es xlsx mostrar el icono de excel y cuando se haga click descargar el archivo
                return (
                    <div className="d-flex gap-2">
                        <span class="material-symbols-outlined">insert_drive_file</span>
                        <a href={item.url} download>
                            {item.url.split('/').pop()}
                        </a>
                    </div>
                )
                // si es .json .exe .docx .doc .pptx .ppt .txt .zip .rar mostrar el icono de archivo y cuando se haga click descargar el archivo
            } else if (item.url.split('.').pop() === 'json' || item.url.split('.').pop() === 'exe' || item.url.split('.').pop() === 'docx' || item.url.split('.').pop() === 'doc' || item.url.split('.').pop() === 'pptx' || item.url.split('.').pop() === 'ppt' || item.url.split('.').pop() === 'txt' || item.url.split('.').pop() === 'zip' || item.url.split('.').pop() === 'rar') {
                return (
                    <div className="d-flex gap-2">
                        <span class="material-symbols-outlined">insert_drive_file</span>
                        <a href={item.url} download>
                            {item.url.split('/').pop()}
                        </a>
                    </div>
                )
            } else {
                return <iframe src={item.url} height="400px"></iframe>;
            }

        } else if (item.type === "audio") {
            return (
                <audio controls>
                    <source src={item.url} type="audio/ogg" />
                </audio>
            );
        } else {
            return null;
        }
    }

    useEffect(() => {
        (async () => {
            await ListarEtiquetas()
            await ListarAgentes()
            await HistorialContacto()
            setInfoContacto(GetManejoConversacion())
        })()
    }, [ping])



    return (
        <div className="chat-list bg-chat rounded-end" style={{ overflow: 'auto' }}>
            <div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
                {/* <div className="box-info-body-close rounded-circle d-flex justify-content-center align-items-center position-absolute">
                    <span class="material-symbols-outlined text-danger cursor-pointer" onClick={() => setInfoContacto('close-box-info')}>close</span>
                </div> */}

                <div className="w-100 d-flex gap-2 pb-3">
                    <div className="rounded-circle overflow-hidden">
                        <img src={infoContacto ? infoContacto.Contactos.avatar : null} className="rounded-circle" width={50} />
                    </div>

                    <div className="d-flex flex-column">
                        <span className="text-span font-bold"
                            style={{ fontSize: '18px' }}>{infoContacto ? infoContacto.Contactos.nombre : null}</span>
                        <span className="text-span">{infoContacto ? infoContacto.Contactos.telefono : null}</span>
                    </div>
                </div>

                <div className="w-100 py-2 d-flex flex-column gap-2 pb-3">
                    <div className="bg-blue p-2 rounded">
                        <span className="text-white font-bold">Información</span>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        <span className="material-symbols-outlined text-span"
                            style={{ fontSize: '20px' }}>smart_toy</span>
                        <span className="font-bold text-span box-info-text" >{infoContacto ? infoContacto.bot : null}</span>
                    </div>

                    <div className="d-flex gap-2 align-items-center">
                        <span className="material-symbols-outlined text-span"
                            style={{ fontSize: '20px' }}>schedule</span>
                        <span className="font-bold text-span box-info-text">{infoContacto ? infoContacto.fecha : null}</span>
                    </div>
                </div>

                <div className="w-100 py-2 d-flex flex-column gap-3">
                    <div className="bg-blue p-2 rounded justify-content-between d-flex">
                        <span className="text-white font-bold">Etiquetas</span>
                        <Dropdown
                            isOpen={dropdownOpenEtiqueta}
                            toggle={setDropdownOpenEtiqueta}
                            direction="up"
                            //className="mt-2"
                            >
                            <DropdownToggle
                                data-toggle="dropdown"
                                tag="span"
                                className="cursor-pointer"
                            >
                                {/* <span class="material-symbols-outlined text-white cursor-pointer">
                                    more
                                </span> */}
                            </DropdownToggle>
                            <DropdownMenu>
                                {etiquetas.map((item, index) => {
                                    return (
                                        <DropdownItem key={index + 1} className="d-flex align-items-center gap-2" onClick={() => AgregarEtiqueta(item)} >
                                            <span style={{ color: item.color }}>{item.etiquetas}</span>
                                        </DropdownItem>
                                    );
                                })}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        {
                            infoContacto && infoContacto.etiquetas_estado ? infoContacto.etiquetas_estado.map((item, index) => {
                                return (
                                    <span key={index + 1} className="chat-tag rounded text-white p-1"
                                        style={{ background: item.color }}
                                    >
                                        {item.etiquetas}
                                    </span>
                                )
                            }) : null
                        }
                    </div>
                </div>

                <div className="w-100 py-2 d-flex flex-column gap-2 pb-3"
                    style={{ maxHeight: '300px' }}>
                    <div className="bg-blue p-2 rounded">
                        <span className="text-white font-bold">Conversaciones anteriores</span>
                    </div>

                    <div className="w-100 d-flex flex-column gap-2" 
                        style={{ 
                            maxHeight: '500px', 
                            minHeight: '500px',
                            overflow: 'auto',
                            scrollbarWidth: 'thin',
                        }}
                    >
                        {
                            contactoHistorial.map((item, index) => {
                                return (
                                    <div className="border w-100 p-2 rounded d-flex flex-column gap-1 cursor-pointer bg-white"
                                        key={index + 1}
                                        onClick={() => VerHistorialIDConversacion(item.conversacion_id, item.contacto_id)}
                                    >
                                        <section className="w-100 d-flex justify-content-between">
                                            <span className="text-span font-bold box-info-text">Conversacion #{item.conversacion_id}</span>
                                            <span className="text-span font-bold box-info-text">Estado: {item.estado}</span>
                                        </section>

                                        <section className="w-100 d-flex justify-content-between">
                                            <span className="text-span font-bold box-info-text">{infoContacto ? infoContacto.Contactos.nombre : null}</span>
                                            <span className="text-span box-info-text">{moment(item.updatedAt).format("YYYY/MM/DD HH:mm")}</span>
                                        </section>
                                        <span className="text-span box-info-text font-bold">Agente: {NombreAgente(item.agente_id)}</span>
                                        <p className="box-info-text m-0 text-span">
                                            <span class="material-symbols-outlined box-info-text">arrow_top_left</span>
                                            {
                                                CompomenteMultimedis(item.mensajes)
                                            }
                                        </p>
                                        <section className="w-100 d-flex justify-content-between">
                                            {/* <span className="text-span font-bold box-info-text">Estados :{item.etiquetas}</span> */}
                                        </section>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoHistorialContacto;