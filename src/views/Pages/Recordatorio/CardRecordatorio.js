import { useState } from "react";
import { Card, Modal } from "react-bootstrap";

export default function CardRecordatorio({ recordatorio, index }) {
  const [showRegendar, setShowRegendar] = useState(false);
  const [showInformation, setShowInformation] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const viewInfoHanlder = (recordatorio) => {
    console.log(recordatorio);
    setShowInformation(true);
  };

  const reagendarHandler = (recordatorio) => {
    setShowRegendar(true);
    console.log(recordatorio);
  };

  const deleteHandler = (id) => {
    console.log(id);
    setShowDelete(true);
  };

  const closeReagendar = () => {
    setShowRegendar(false);
    // Limpiar();
  };

  const closeInformation = () => {
    setShowInformation(false);
  };

  return (
    <>
      <Card
        style={{ width: "18rem", borderTop: "5px solid " + recordatorio.color }}
        className="mx-1 shadow"
      >
        <Card.Header>
          <div className="d-flex justify-content-between">
            <span>
              {recordatorio.tipo ? recordatorio.tipo : "Recordatorios"}
            </span>
            <input type="checkbox" />
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            {recordatorio.title ? recordatorio.title : "Recordatorio " + index}
          </Card.Title>
          <Card.Text>
            {recordatorio.nota ? recordatorio.nota : "Recordatorio 1"}
          </Card.Text>

          <Card.Text className="text-secondary">
            {"Fecha: " + recordatorio.fecha + " " + recordatorio.hora}
          </Card.Text>

          <div className="w-100 d-flex flex-row gap-3 justify-content-center flex-wrap bot-card-buttons">
            <button
              className="bot-card-buttons-btn"
              data-toggle="tooltip"
              data-placement="top"
              title="Ver información"
              onClick={() => viewInfoHanlder(recordatorio)}
            >
              <span className="material-symbols-outlined text-secondary">
                visibility
              </span>
            </button>

            <button
              className="bot-card-buttons-btn"
              data-toggle="tooltip"
              data-placement="top"
              title="Reagendar"
              onClick={() => reagendarHandler(recordatorio)}
            >
              <span className="material-symbols-outlined text-secondary">
                calendar_month
              </span>
            </button>

            <button
              className="bot-card-buttons-btn"
              data-toggle="tooltip"
              data-placement="top"
              title="Eliminar"
              onClick={() => deleteHandler(recordatorio.id)}
            >
              <span className="material-symbols-outlined text-secondary">
                delete
              </span>
            </button>
          </div>
        </Card.Body>
      </Card>

      <Modal
        size="md"
        show={showInformation}
        onHide={closeInformation}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            Información
          </Modal.Title>
          <button
            type="button"
            className="btn-dark mr-2 w-10"
            onClick={closeInformation}
          >
            <i className="fa fa-times"></i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row" style={{ gap: "10px" }}>
              <b className="mr-2">Fecha y hora:</b>
              <span className="ml-2">
                {recordatorio.fecha} {recordatorio.hora}
              </span>
            </div>

            <div className="d-flex flex-row" style={{ gap: "10px" }}>
              <b className="mr-2">Estado:</b>
              <span className="ml-2">{recordatorio.estado}</span>
            </div>

            <div className="d-flex flex-row" style={{ gap: "10px" }}>
              <b className="mr-2">Nota:</b>
              <span className="ml-2">{recordatorio.nota}</span>
            </div>

            {Object.keys(recordatorio.form).length > 0 ? (
              <div className="d-flex flex-row" style={{ gap: "10px" }}>
                {Object.entries(recordatorio.form).map(([key, value]) => (
                  <div key={key} className="d-flex">
                    <b className="mr-2">{key}:</b>
                    <span className="ml-2">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        size="md"
        show={showRegendar}
        onHide={closeReagendar}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">Reagendar</Modal.Title>
          <button
            type="button"
            className="btn-dark mr-2 w-10"
            onClick={closeReagendar}
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
                id="nombre_bot"
                placeholder="Fecha"
                value=""
              />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="tiempo">Hora</label>
              <input
                type="time"
                className="form-control"
                id="nombre_bot"
                placeholder="Hora"
                value=""
              />
            </div>

            <div className="form-group mt-2">
              <label htmlFor="tiempo">Motivo</label>
              <input
                type="text"
                className="form-control"
                id="nombre_bot"
                placeholder="Escriba el motivo"
                value=""
              />
            </div>

            <button type="submit" className="button-bm w-100 mt-3">
              Reagendar
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        size="md"
        show={showDelete}
        onHide={() => setShowDelete(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title>Eliminar recordatorio</Modal.Title>
          <button
            type="button"
            className="btn-dark mr-2 w-10"
            onClick={() => setShowDelete(false)}
          >
            <i className="fa fa-times"></i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <div className="form-group d-flex justify-content-center align-items-center">
            <p>¿Desea eliminar el recordatorio, esta acción no puede deshacerse?</p>
          </div>
          <div className="text-center m-2">
            <div className="d-flex justify-content-center align-items-center">
              <button className="button-bm w-100 mt-3">Eliminar ahora</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
