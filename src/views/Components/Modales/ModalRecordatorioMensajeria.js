import { colorPrimario } from 'function/util/global';
import { Modal } from "react-bootstrap";

export default function ModalRecordatorioMensajeria({
    show,
    handClose,
    recordatorio,
    handleOnchange,
    CrearRecordatorio,
}) {
  return (
    <Modal show={show} onHide={handClose}>
    <Modal.Header>
        <Modal.Title>CREAR RECORDATORIO</Modal.Title>
      <button
        type="button"
        className="btn-dark mr-2 w-10"
        onClick={handClose}
      >
        <i className="fa fa-times"></i>
      </button>
    </Modal.Header>
    <Modal.Body>
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
  )
}
