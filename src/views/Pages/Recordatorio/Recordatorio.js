import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import { useEffect, useState } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import CardRecordatorio from "./CardRecordatorio";

export default function Recordatorio() {
  const [show, setShow] = useState(false);
  const [bots, setBots] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [recordatorio, setRecordatorio] = useState({
    id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
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

  const handClose = () => {
    setShow(!show);
  };

  const ListarBots = async () => {
    const url = `bots/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await BmHttp().get(url);
    if (status === 200) {
      setBots(data.data);
    }
  };

  const ListarRecordatiorios = async () => {
    const { data, status } = await BmHttp().get(
      "recordatorio/" + GetTokenDecoded().cuenta_id
    );
    if (status !== 200) return console.error("Error al listar recordatorios");
    setRecordatorios(data.data);
  };

  const ReagendarRecordatorio = async () => {
    const { status } = await BmHttp().put("recordatorio_reagendar", {
      id: recordatorio.id,
      fecha: recordatorio.fecha,
      hora: recordatorio.hora,
      estado: recordatorio.estado,
    });
    if (status !== 200) {
      Swal.fire({
        icon: "error",
        title: "Error al reagendar recordatorio",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Recordatorio reagendado con exito",
        showConfirmButton: false,
        timer: 1500,
      });
      handClose();
      await ListarRecordatiorios();
    }
  };

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
      await ListarRecordatiorios();
    }
  };

  const handleOnchange = (e) => {
    setRecordatorio({
      ...recordatorio,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await ListarRecordatiorios();
        await ListarBots();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      <Container fluid>
        <div className="d-flex justify-content-start mb-3">
          <button
            className="button-bm active"
            onClick={() => setShow(true)}
          >
            CREAR RECORDATORIO
          </button>
        </div>

        <div className="row d-flex justify-content-between">
          <button
            className="button-bm active ml-2"
            style={{ 'width': '50px'}}
            onClick={() => setShow(true)}
          >
            <span class="material-symbols-outlined">arrow_back_ios</span>
          </button>

          <button
            className="button-bm active ml-2"
            style={{ 'width': '50px'}}
            onClick={() => setShow(true)}
          >
            <span class="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        </div>

        <Row className="mt-2">
          {recordatorios.map((recordatorio, index) => (
            <CardRecordatorio
              key={index}
              recordatorio={recordatorio}
              index={index + 1}
            />
          ))}
        </Row>

        <Modal show={show} onHide={handClose}>
          <Modal.Header>
            {recordatorio.id === 0 ? (
              <Modal.Title>CREAR RECORDATORIO</Modal.Title>
            ) : (
              <Modal.Title>ACTUALIZAR RECORDATORIO</Modal.Title>
            )}
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Contacto</label>
              <input
                type="text"
                name="contacto_id"
                value={recordatorio.contacto_id}
                onChange={handleOnchange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Conexion</label>
              <select
                className="form-control"
                id="bot_id"
                name="bot_id"
                value={recordatorio.bot_id}
                onChange={handleOnchange}
              >
                <option value="">Seleccione una conexion</option>
                {bots.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nombre_bot}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-row d-flex">
              <div className="form-group w-50 mx-1">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={recordatorio.fecha}
                  onChange={handleOnchange}
                  className="form-control"
                />
              </div>
              <div className="form-group w-50 mx-1">
                <label>Hora</label>
                <input
                  type="time"
                  name="hora"
                  value={recordatorio.hora}
                  onChange={handleOnchange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Nota</label>
              <textarea
                name="nota"
                value={recordatorio.nota}
                onChange={handleOnchange}
                className="form-control"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select
                name="tipo"
                value={recordatorio.tipo}
                onChange={handleOnchange}
                className="form-control"
              >
                <option value="">Seleccionar</option>
                <option value="Nueva Cita">Nueva cita</option>
                <option value="Reagendada">Reagendada</option>
                <option value="Llamar">Llamar</option>
                <option value="Enviar Correo">Enviar correo</option>
                <option value="Enviar WhatsApp">Enviar WhatsApp</option>
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                defaultValue={colorPrimario}
                name="color"
                value={recordatorio.color}
                onChange={handleOnchange}
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="button-bm" onClick={handClose}>
              CANCELAR
            </button>
            <button className="button-bm active" onClick={CrearRecordatorio}>
              GUARDAR
            </button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
