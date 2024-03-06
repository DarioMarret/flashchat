
import { colorPrimario } from "function/util/global";
import {
    Col,
    Modal,
    Row
} from "react-bootstrap";

function ModalMikritik(props) {
    const { showMidkritik, onHideMidkritik, bots, estados } = props;
    return (
        <Modal
            show={onHideMidkritik}
            onHide={showMidkritik}
            size="lg"
            // aria-labelledby="contained-modal-title-vcenter"
            // centered
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
                    />
                </div>
                <div className="form-group">
                    <label>Token</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Token"
                    />
                </div>
                <div className="form-group">
                    <label>Acciones</label>
                </div>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                className="form-control"
                            >
                                <option value="">Seleccione</option>
                                {
                                    estados.map((estado, index) => {
                                        return (
                                            <option key={index} value={estado.estados}>{estado.estados}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Acción</label>
                            <select
                                className="form-control"
                            >
                                <option value="">Seleccione</option>
                                <option value="1">Activar</option>
                                <option value="0">Desactivar</option>
                            </select>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                className="form-control"
                            >
                                <option value="">Seleccione</option>
                                {
                                    estados.map((estado, index) => {
                                        return (
                                            <option key={index} value={estado.estados}>{estado.estados}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Acción</label>
                            <select
                                className="form-control"
                            >
                                <option value="">Seleccione</option>
                                <option value="1">Activar</option>
                                <option value="0">Desactivar</option>
                            </select>
                        </div>
                    </Col>
                </Row>                
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn button-bm w-100"
                    onClick={showMidkritik}
                >
                    Guardar
                </button>
            </Modal.Footer>
            
        </Modal>
    );
}

export default ModalMikritik;