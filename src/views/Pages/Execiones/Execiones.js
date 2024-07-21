import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Card, Container, Input } from "reactstrap";
import Swal from "sweetalert2";

export default function Execiones() {
    const [execiones, setExeciones] = useState([]);
    const [execion, setExecion] = useState({
        count: 0,
        total: 0,
        siguintes:"",
        anterior: "",
    });
    const [show, setShow] = useState(false);
    const [numero, setNumero] = useState({
        cuenta_id: GetTokenDecoded().cuenta_id,
        id: 0,
        numero: '',
        mensaje: ''
    });

    const handleEdit = (item) => {
        console.log(item)
    }

    const handleDelete = (item) => {
        console.log(item)
        setNumero(item);
        Swal.fire({
            title: 'Eliminar',
            text: '¿Estas seguro de eliminar este numero?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: colorPrimario,
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
        }).then((result) => {
            if (result.isConfirmed) {
                EliminarExeciones();
            }
        });
    }

    const HandleSiguiente = async() => {
        try {
            const { data } = await BmHttp().get(execion.siguintes);
            if(data && data.status === 200){
                setExeciones(data.data);
                setExecion({
                    count: data.count,
                    total: data.total,
                    siguintes: data.siguientes,
                    anterior: data.anterior
                });
            }
        } catch (error) {
        }

    }
    const HandleAnterior = async () => {
        try {
            const { data } = await BmHttp().get(execion.anterior);
            if(data && data.status === 200){
                setExeciones(data.data);
                setExecion({
                    count: data.count,
                    total: data.total,
                    siguintes: data.siguientes,
                    anterior: data.anterior
                });
            }
        } catch (error) {
        }
    }

    const hanbleBuscar = (e) => {
        console.log(e.target.value)
    }


    const ListarExeciones = async () => {
        try {
            const { data } = await BmHttp().get(`execion_numero/${GetTokenDecoded().cuenta_id}?skip=0&take=10`);
            console.log(data)
            if(data.status === 200){
                setExeciones(data.data);
                setExecion({
                    count: data.count,
                    total: data.total,
                    siguintes: data.siguientes,
                    anterior: data.anterior
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    const GuardarExeciones = async () => {
        const { data } = await BmHttp().post(`execion_numero`, numero);
        if (data.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Se guardo correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            ListarExeciones();
            setShow(false);
        }
    }
    const ActualizarExeciones = async () => {
        const { data } = await BmHttp().put(`execion_numero/${numero.id}`, numero);
        if (data.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'Se actualizo correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            ListarExeciones();
        }
    }
    const EliminarExeciones = async () => {
        const { data } = await BmHttp().delete(`execion_numero/${numero.id}`, numero);
        if (data.status === 200) {
            ListarExeciones();
        }
    }

    useEffect(() => {
        (async () => {
            await ListarExeciones();
        })();
    }, []);

  return (
    <>
        {/* Aqui registramos no numero que queremos que el bot no responda o te ponemos un mensaje predeterminado */}
        <Container fluid>
        <div className="d-flex flex-column flex-md-row justify-content-between mb-3 align-items-center">
          <button
            className="button-bm active"
            onClick={() => setShow(true)}
          >
            REGISTRAR NUMERO
          </button>
          <div>
            
            <Input placeholder="Buscar contacto"
              onChange={(e) => hanbleBuscar(e)}
            />
          </div>
        </div>
        <span className="ml-3">
            Registra los numeros que no quieres que el bot responda.
        </span>
        <Card style={{ overflow: 'auto' }}>
            <table
                responsive
                className="table-personalisado table-hover"
            >
              <thead>
                <tr>
                  <th>Numero</th>
                  <th>Comentario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {execiones.map((item, index) => (
                  <tr key={index}
                  >
                    <td
                        className="text-center"
                    >{item.numero}</td>
                    <td
                        className="text-center"
                    >{item.nombre}</td>
                    <td
                        className="d-flex justify-content-center"
                    >
                      {/* <button
                        className="button-bm"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="fa fa-edit"></i>
                      </button> */}
                      <button
                        className="button-bm"
                        onClick={() => handleDelete(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* si hay mas de  10 contacto solo mostrar los primero 10 y hay visible la paginacion */}
            <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example text-center">
                <ul className="pagination">
                    <button className="page-link" aria-label="Previous" onClick={() => HandleAnterior()}>
                        <span aria-hidden="true">&laquo;</span>
                    </button>

                    <div className="d-flex justify-content-center">
                        <button className="page-link">
                            {
                                execion.total > 0 ? execion.total : 0
                            }
                        </button>
                    </div>

                    <button className="page-link" aria-label="Next" onClick={() => HandleSiguiente()}>
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </ul>
                </nav>
            </div>
        </Card>
        </Container>
        <Modal
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-lg">REGISTRAR NUMERO</Modal.Title>
            <button
                type="button"
                className="btn-dark mr-2 w-10"
                onClick={() => setShow(false)}
            >
                <i className="fa fa-times"></i>
            </button>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label>Numero</label>
                    <Input placeholder="Numero" 
                        onChange={(e) => setNumero({...numero, numero: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Cometario</label>
                    <textarea
                        className="form-control"
                        placeholder="Comentario"
                        rows="3"
                        onChange={(e) => setNumero({...numero, mensaje: e.target.value})}
                    >
                    </textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="button-bm"
                    onClick={() => setShow(false)}
                >
                    Cerrar
                </button>
                <button
                    className="button-bm"
                    onClick={() => GuardarExeciones()}
                >
                    Guardar
                </button>
            </Modal.Footer>
        </Modal>
    </>
  )
}
