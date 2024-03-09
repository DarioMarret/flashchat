import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp, colorPrimario } from 'function/util/global';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { v4 } from 'uuid';
import socket from 'views/SocketIO';
// codigo de numero de telefono de Ecuador, Colombia, Peru, Venezuela, Chile, Argentina, Mexico, Estados Unidos
const codigos = [
    { pais: "Ecuador", codigo: "593", bandera: "🇪🇨" },
    { pais: "Colombia", codigo: "57", bandera: "🇨🇴" },
    { pais: "Perú", codigo: "51", bandera: "🇵🇪" },
    { pais: "Venezuela", codigo: "58", bandera: "🇻🇪" },
    { pais: "Chile", codigo: "56", bandera: "🇨🇱" },
    { pais: "Argentina", codigo: "54", bandera: "🇦🇷" },
    { pais: "México", codigo: "52", bandera: "🇲🇽" },
    { pais: "Estados Unidos", codigo: "1", bandera: "🇺🇸" },
];
function ModalMensaje(props) {
    const { showMensaje, onHideMensaje } = props;
    const [mensaje, setMensaje] = useState({
        nombreunico: "",
        numero: "",
        codigo: "",
        mensajes:{
            id: v4(),
            type: "text",
            text: "",
            date: new Date(),
            parems: null
        }
    })

    const [bots, setBots] = useState([])
    const ListarBot = async() => {
        const url = `bots/${GetTokenDecoded().cuenta_id}`
        const { data } = await BmHttp.get(url)
        console.log(typeof data)
        if (data.status === 200) {
            setBots(data.data)
        }else{
            setBots([])
        }
    }

    const handleNumero = (e) => {
        setMensaje({
            ...mensaje,
            [e.target.name]: e.target.value
        })    
    }

    const ennviarMensaje = async() => {
        let codigo = mensaje.codigo === "" ? "593" : mensaje.codigo
        let info = {
            numero: codigo + mensaje.numero.replace(/\s/g, ""),
            mensajes: mensaje.mensajes,
            nombreunico: mensaje.nombreunico,
            cuenta_id: GetTokenDecoded().cuenta_id
        }
        socket.emit("enviar_mensaje_externo", info)
        Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "El mensaje fue enviado con exito",
            confirmButtonColor: colorPrimario
        })
        onHideMensaje(!showMensaje)
    }

    useEffect(() => {
        (async()=>{
            await ListarBot()
        })()
    }, [])
    return (
        <Modal
            show={showMensaje}
            // onHide={onHideMensaje(!showMensaje)}
            size="md"
        >
            <Modal.Header>
                <div className="d-flex justify-content-between w-100">
                    <Modal.Title>Envia mensaje a contacto externo</Modal.Title>
                    <button
                        type="button"
                        className="btn ml-auto"
                        onClick={()=>onHideMensaje(!showMensaje)}
                    >
                        <i
                            className="fa fa-times"
                            style={{
                                fontSize: "1.1em",
                                backgroundColor: "transparent",
                                color: colorPrimario,
                            }}
                        ></i>
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Conexion</label>
                    <select
                        className="form-control"
                        name="nombreunico"
                        // value={mensaje.nombreunico}
                        onChange={handleNumero}
                    >
                        <option value="">Seleccione</option>
                        {
                            bots.map((bot, index) => {
                                return (
                                    <option key={index} value={bot.nombreunico}>{bot.nombre_bot}</option>
                                )
                            })
                        }
                    </select>
                </div>
                {/* ingrese numero de contacto  */}
                <div className="form-group">
                    <label>Numero de contacto</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <select
                                className="form-control"
                                name="codigo"
                                // value={mensaje.codigo}
                                onChange={handleNumero}
                            >
                                {
                                    codigos.map((codigo, index) => {
                                        return (
                                            <option key={index} value={codigo.codigo}>{codigo.bandera}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="9 985 123 456"
                            name="numero"
                            // value={mensaje.numero}
                            onChange={handleNumero}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Mensaje</label>
                    <textarea
                        className="form-control h-50"
                        placeholder="Escriba su mensaje"
                        // value={mensaje.mensajes.text}
                        cols={30}
                        rows={10}
                        onChange={(e) => setMensaje({...mensaje, mensajes: {...mensaje.mensajes, text: e.target.value}})
                        }
                    />
                </div>
                <div className="form-group">
                    <button
                        className="btn button-bm w-100 mt-3"
                        onClick={ennviarMensaje}
                    >
                        Enviar
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalMensaje;