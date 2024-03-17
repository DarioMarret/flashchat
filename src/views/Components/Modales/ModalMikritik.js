
import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import { useState } from "react";
import {
    Col,
    Modal,
    Row
} from "react-bootstrap";

function ModalMikritik(props) {
    const { showMidkritik, onHideMidkritik, bots } = props;
    const [infoMidkritik, setInfoMidkritik] = useState({
        id: "",
        conexion: "",
        host: "",
        cuenta_id: GetTokenDecoded().cuenta_id,
        nombreunico: "",
        token: "",
        dp: "",
        variable: "",
        acciones: "CrearTicketMikrotik"
    })

    const Limpiar = () => {
        setInfoMidkritik({
            conexion: "",
            host: "",
            cuenta_id: GetTokenDecoded().cuenta_id,
            nombreunico: "",
            token: "",
            dp: "",
            variable: "",
            acciones: "CrearTicketMikrotik"
        })
    }

    const handleChange = (e) => {
        setInfoMidkritik({
            ...infoMidkritik,
            [e.target.name]: e.target.value
        })
        if(e.target.name === "conexion" && e.target.value !== ""){
            ListarInfoMikritik(e.target.value)
        }
    }

    const GuardarMidkritik = async() => {
        try {
            const { data, status } = await BmHttp.post("crearte_mikrotik", infoMidkritik)
            if(data.status === 200){
                showMidkritik()
                Limpiar()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const ListarInfoMikritik = async (nombreunico) => {
        try {
            const { data, status } = await BmHttp.get("obtener_mikrotik/"+nombreunico)
            if(data.status === 200){
                setInfoMidkritik({
                    id: data.data.id,
                    conexion: data.data.conexion,
                    host: data.data.host,
                    cuenta_id: data.data.cuenta_id,
                    nombreunico: data.data.nombreunico,
                    token: data.data.token,
                    dp: data.data.dp,
                    variable: data.data.variable,
                    acciones: data.data.acciones
                })
            }else{
                Limpiar()
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Modal
            show={onHideMidkritik}
            onHide={showMidkritik}
            size="lg"
        >
            <Modal.Header>
            <div className="d-flex justify-content-between w-100">
              <Modal.Title>Configuración Mikritik</Modal.Title>
              <button
                type="button"
                className="btn ml-auto"
                onClick={showMidkritik}
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
                        name="conexion"
                        onChange={(e)=>handleChange(e)}
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
                <div className="form-group">
                    <label>Host</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Host"
                        name="host"
                        onChange={(e)=>handleChange(e)}
                        value={infoMidkritik.host}
                    />
                </div>
                <div className="form-group">
                    <label>Token</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Token"
                        name="token"
                        onChange={(e)=>handleChange(e)}
                        value={infoMidkritik.token}
                    />
                </div>
                <div className="form-group">
                    <label>Acciones</label>
                </div>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label>ID Departamento mikroti</label>
                            <input
                                type="number"
                                className="form-control"
                                name="dp"
                                placeholder="ID Departamento"
                                onChange={(e)=>handleChange(e)}
                                value={infoMidkritik.dp}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Nombre de variable en el flujo del bot</label>
                            <input
                                type="text"
                                className="form-control"
                                name="variable"
                                placeholder="ClienteCedula"
                                onChange={(e)=>handleChange(e)}
                                value={infoMidkritik.variable}
                            />
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn button-bm w-100"
                    onClick={()=>GuardarMidkritik()}
                >
                    Guardar
                </button>
            </Modal.Footer>
            
        </Modal>
    );
}

export default ModalMikritik;