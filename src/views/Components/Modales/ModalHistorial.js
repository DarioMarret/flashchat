import moment from 'moment';
import { Modal } from 'react-bootstrap';
import ComponenteMultimedia from '../ComponenteMultimedia';


function ModalHistorial(props) {
    const { conversacion } = props;
    return (
        <Modal
            show={props.showHistorial}
            onHide={props.onHideHistorial}
            size="lg"
        >
        <Modal.Header closeButton>
            <Modal.Title>Conversación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="p-4 h-100 pt-2 pb-0"
                style={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                    backgroundColor: "#f2f2f2",
                    borderRadius: "10px",
                }}
            >
                <div className="row chat-body">
                <div className="col-12">
                    {conversacion.map((item, index) => {
                    if (item.tipo === "ingoing") {
                        return (
                        <div key={index + 1} className="w-100 my-3">
                            <div className="w-50">
                            <section
                                className="w-fit d-flex flex-column px-3 py-2 rounded 
                                chat-item-detail chat-receiver"
                            >
                                <ComponenteMultimedia item={item.mensajes} />
                                <small>
                                {moment(item.createdAt) >=
                                moment().subtract(1, "days")
                                    ? moment(item.createdAt).format("hh:mm a")
                                    : moment(item.createdAt).format(
                                        "DD/MM/YYYY hh:mm a"
                                    )}
                                </small>
                            </section>
                            </div>
                        </div>
                        );
                    } else {
                        return (
                        <div
                            key={index + 1}
                            className="w-100 my-3  d-flex justify-content-end"
                        >
                            <div className="w-50 d-flex justify-content-end">
                            <section
                                className="border w-fit d-flex flex-column px-3 py-2 rounded 
                                chat-item-detail chat-sender"
                            >
                                {/* {CompomenteMultimedis(item.mensajes)} */}
                                < ComponenteMultimedia item={item.mensajes} />
                                <small>
                                {moment(item.createdAt) >=
                                moment().subtract(1, "days")
                                    ? moment(item.createdAt).format("hh:mm a")
                                    : moment(item.createdAt).format(
                                        "DD/MM/YYYY hh:mm a"
                                    )}
                                </small>
                            </section>
                            </div>
                        </div>
                        );
                    }
                    })}
                </div>
                </div>
            </div>
        </Modal.Body>
        </Modal>
    );
}

export default ModalHistorial;