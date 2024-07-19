import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import { Container, Modal, Row } from "react-bootstrap";
import Draggable from "react-draggable";
import Swal from "sweetalert2";
import CardRecordatorio from "./CardRecordatorio";

export default function Recordatorio() {
  const [show, setShow] = useState(false);
  const [showRegendar, setShowRegendar] = useState(false);
  const [bots, setBots] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [recordatorio, setRecordatorio] = useState({
    id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
    contacto_id: 0,
    agente_id: GetTokenDecoded().agente_id,
    bot_id: 0,
    fecha: "",
    mes: 0,
    hora: "",
    nota: "",
    tipo: "",
    color: "",
    form: {},
  });
  let [fecha, setFecha] = useState(moment().format("YYYY-MM-DD"));
  const [openCheck, setOpenCheck] = useState(false);
  const [infoRecordatorio, setInfoRecordatorio] = useState({
    info: [],
    id: 0,
    fecha: "",
    hora: "",
    motivo: "",
    bot_id: 0,
    cuenta_id: GetTokenDecoded().cuenta_id,
    agente_id: GetTokenDecoded().agente_id,
  });
  const [positions, setPositions] = useState({});


  // Cargar posiciones desde localStorage cuando el componente se monte
  useEffect(() => {
    const savedPositions = localStorage.getItem('recordatorioPositions');
    if (savedPositions) {
      setPositions(JSON.parse(savedPositions));
    }
  }, []);

   // Guardar la posición en localStorage cuando cambie
  const handleDragStop = (index, e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPositions((prevPositions) => {
      const updatedPositions = { ...prevPositions, [index]: newPosition };
      localStorage.setItem('recordatorioPositions', JSON.stringify(updatedPositions));
      return updatedPositions;
    });
  }; 

  const reagendarHandler = () => {
    setShowRegendar(!showRegendar);
    if(openCheck){
      let info = recordatorios.filter((recordatorio) => recordatorio.openCheck === true);
      setInfoRecordatorio({
        ...infoRecordatorio,
        info: info,
        fecha: recordatorios[0].fecha,
      });
      console.log(infoRecordatorio);
    }
  };

  const handleOpenCheck = () => {
    setOpenCheck(!openCheck);
    let rec = recordatorios.map((recordatorio) => {
        recordatorio['openCheck'] = !openCheck;
        return recordatorio;
    });
    setInfoRecordatorio({
        ...infoRecordatorio,
        info: rec,
        fecha: recordatorios[0].fecha,
    });
    if(openCheck === false){
        setInfoRecordatorio({
            info: [],
        });
    }
  }

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

  const ListarRecordatiorios = async (fecha) => {
    const { data, status } = await BmHttp().get(`recordatorio/${GetTokenDecoded().cuenta_id}?fecha=${fecha}`);
    if (status !== 200) return console.error("Error al listar recordatorios");
    setFecha(fecha);
    setRecordatorios(data.data.map((recordatorio) => {
        recordatorio['openCheck'] = openCheck;
      return recordatorio;
    }));
  };

  const EliminarRecordatorio = async (id) => {
    let info = recordatorios.filter((recordatorio) => recordatorio.openCheck === true);
    const { status } = await BmHttp().post("recordatorio/" + id, {
      info: info,
    })
    if (status !== 200) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar recordatorio",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Recordatorio eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
      ListarRecordatiorios(fecha);
    }
  }

  const ReagendarRecordatorio = async () => {
    let info = recordatorios.filter((recordatorio) => recordatorio.openCheck === true);
    let re = {
      info: info,
      id: parseInt(infoRecordatorio.id),
      fecha: infoRecordatorio.fecha,
      hora: infoRecordatorio.hora,
      motivo: infoRecordatorio.motivo,
      cuenta_id: GetTokenDecoded().cuenta_id,
      agente_id: GetTokenDecoded().agente_id,
      bot_id: infoRecordatorio.bot_id,
      estado: "Reagendado",
    }
    const { status } = await BmHttp().put("recordatorio_reagendar", re);
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
      setShowRegendar(false);
      setShow(false);
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
      await ListarRecordatiorios(fecha);
      handClose();
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
        await ListarRecordatiorios(moment().format("YYYY-MM-DD"));
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
            onClick={() => 
              ListarRecordatiorios(moment(fecha).subtract(1, 'days').format("YYYY-MM-DD"))
            }
          >
            <span class="material-symbols-outlined">arrow_back_ios</span>
          </button>

            {/* en la mita que se vea la fecha, para listar todo */}
            <div className="d-flex justify-content-center w-50 text-center">
              <h5>{
                fecha !== "" ? (
                  fecha
                ) : ("")
                }</h5>
              <a href="#;" className="text-primary mx-2"
                onClick={() => 
                  setFecha("")+
                  ListarRecordatiorios("")
                }
              >
                Listar todo
              </a>
            </div>

          <button
            className="button-bm active ml-2"
            style={{ 'width': '50px'}}
            onClick={() => 
              ListarRecordatiorios(moment(fecha).add(1, 'days').format("YYYY-MM-DD"))
            }
          >
            <span class="material-symbols-outlined">arrow_forward_ios</span>
          </button>
        </div>

        {
          recordatorios.length !== 0 ? (
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <label>
                  Seleccionar todo
              </label>
              <input type="checkbox" 
                  className="mx-2"
                  onClick={handleOpenCheck}
              />
              {
                openCheck ? (
                <div className="d-flex">
                  <a href="#;" className="text-danger mx-2"
                    onClick={() => EliminarRecordatorio(0)}
                  >
                    Eliminar
                  </a>
                  <a href="#;" className="text-primary mx-2"
                    onClick={() => reagendarHandler()}
                  >
                    Reagendar
                  </a>
                </div>
                ) : ("")
              }
            </div>

          </div>) : ("")
        }

            <Row className="mt-2">
                {recordatorios.map((recordatorio, index) => (
                  <Draggable
                    key={index}
                    position={positions[index] || { x: 0, y: 0 }}
                    onStop={(e, data) => handleDragStop(index, e, data)}
                  >
                    <div className="draggable-recordatorio" 
                      style={{ width: "18rem" }}
                    >
                      <CardRecordatorio
                        key={index}
                        recordatorios={recordatorios}
                        setRecordatorios={setRecordatorios}
                        recordatorio={recordatorio}
                        index={index + 1}
                        EliminarRecordatorio={EliminarRecordatorio}
                        ReagendarRecordatorio={ReagendarRecordatorio}
                        handleOpenCheck={handleOpenCheck}
                        openCheck={openCheck}
                        setInfoRecordatorio={setInfoRecordatorio}
                        infoRecordatorio={infoRecordatorio}
                      />
                    </div>
                  </Draggable>
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
                  // de intevalo de tiempo cada 30 minutos
                  step="1800"
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

        {/* All reagendar */}
        <Modal
        size="md"
        show={showRegendar}
        onHide={reagendarHandler}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">Reagendar</Modal.Title>
          <button
            type="button"
            className="btn-dark mr-2 w-10"
            onClick={reagendarHandler}
          >
            <i className="fa fa-times"></i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <form className="w-100">
            <div className="form-group">
              <label htmlFor="tiempo">Fecha</label>
              <input
                type="date"
                className="form-control"
                placeholder="Fecha"
                value={infoRecordatorio.fecha}
                onChange={(e) => setInfoRecordatorio({ ...infoRecordatorio, fecha: moment(e.target.value).format("YYYY-MM-DD") })}
              />
            </div>

            {/* Si hay un checkout activo entoces no se actualizar la hora solo la fecha y el motivo */}

            <div className="form-group mt-2">
              <label htmlFor="tiempo">Motivo</label>
              <input
                type="text"
                className="form-control"
                id="nombre_bot"
                placeholder="Escriba el motivo"
                value={infoRecordatorio.motivo}
                onChange={(e) => setInfoRecordatorio({ ...infoRecordatorio, motivo: e.target.value })}
              />
            </div>

            <button type="submit" className="button-bm w-100 mt-3"
              onClick={() => ReagendarRecordatorio()}
            >
              Reagendar
            </button>
          </form>
        </Modal.Body>
      </Modal>
      </Container>
    </>
  );
}
