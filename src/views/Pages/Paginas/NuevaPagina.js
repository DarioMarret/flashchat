import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import {
    Card,
    Col,
    Container
} from 'reactstrap';
import Swal from 'sweetalert2';
import { ControllerEditarPagina, ControllerEliminarPagina, ControllerListarPaginas, ControllerVincularPagina } from './Services.pagina';
export default function NuevaPagina() {
    const [paginas, setPaginas] = useState([]);
    const [show, setShow] = useState(false);
    const [nuevaPagina, setNuevaPagina] = useState({
        id: 0,
        cuenta_id: 0,
        nombre: '',
        url: '',
    })

    const ListarPaginas = async () => {
        const { data, status } = await ControllerListarPaginas();
        if(status === 200){
            setPaginas(data.data)
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarPaginas();
        })()
    }, [])

    // Guardar nueva pagina
    const GuardarPagina = async () => {
        if(nuevaPagina.nombre === '' || nuevaPagina.url === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios!',
            })
            return;
        }
        if(nuevaPagina.id){
            const { status } = await ControllerEditarPagina(nuevaPagina);
            if(status === 200){
                await ListarPaginas();
                setShow(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: 'Pagina guardada correctamente!',
                })
                return;
            }
        }
        const { status } = await ControllerVincularPagina(nuevaPagina);
        if(status === 200){
            await ListarPaginas();
            setShow(false);
            Swal.fire({
                icon: 'success',
                title: 'Guardado',
                text: 'Pagina guardada correctamente!',
            })
        }
    }
    // open edit modal
    const EditarPagina = (pagina) => {
        setNuevaPagina(pagina)
        setShow(true)
    }

    // eliminar pagina
    const EliminarPagina = async (id) => {
        Swal.fire({
            title: 'Estas seguro?',
            text: "No podras revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async(result) => {
            if (result.isConfirmed) {
                const { status } = await ControllerEliminarPagina(id);
                if(status === 200){
                    await ListarPaginas();
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'Pagina eliminada correctamente!',
                    })
                }
            }
        })
    }

  return (
    <Container fluid>
        <h3>Nueva Pagina</h3>
        <button className="btn button-bm mb-2" onClick={() => setShow(true)}>Nueva Pagina</button>
        <Card className="card-plain shadow">
            {
                paginas.map((pagina, index) => (
                    <Col className='d-flex justify-content-start align-items-center border-bottom w-100' key={index}>
                        <div style={{ padding: '10px' }}  className='d-flex justify-content-start align-items-center w-100'>
                            <p>{pagina.nombre}</p>
                        </div>
                        <div style={{ padding: '10px' }} className='d-flex justify-content-end align-items-center '>
                            <button className="btn button-bm"
                                onClick={() => EditarPagina(pagina)}
                            >Editar</button>
                            <button className="btn button-bm"
                                onClick={() => EliminarPagina(pagina.id)}
                            >Eliminar</button>
                        </div>
                    </Col>
                ))
            }
        </Card>

        <Modal 
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Nueva Pagina</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" 
                            value={nuevaPagina.nombre}
                            maxLength={16}
                            minLength={3}
                            className="form-control" onChange={(e) => setNuevaPagina({...nuevaPagina, nombre: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>URL</label>
                            <input type="text" 
                            value={nuevaPagina.url}
                            className="form-control" onChange={(e) => setNuevaPagina({...nuevaPagina, url: e.target.value})} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="button-bm" onClick={() => setShow(false)}>Cerrar</button>
                        <button className="button-bm" onClick={GuardarPagina}>Guardar</button>
                    </div>
                </div>
        </Modal>
    </Container>
  )
}
