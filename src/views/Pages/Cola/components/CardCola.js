import { IsKeyObject } from 'function/storeUsuario';
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Row
} from 'reactstrap';
function CardCola(props) {
    const { items } = props;
    if(!IsKeyObject(items, 'conversacion')){
        return null;
    }
    return (
        <>
            <Col>
                <Card className='d-flex justify-content-center align-items-center '>
                    <CardHeader className=''
                        style={{ width: '100%', background: '#007bff', color: 'white'}}
                    >
                        <div className='d-flex justify-content-start align-items-center mb-1'>
                            <img
                                src={items.avatar === "" ? 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200' : items.avatar}
                                alt='Adrian Mosquera'
                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                className='mx-2'
                            />
                            <span
                                style={{
                                    fontSize: '14px',
                                    width: '100%',
                                }}
                            >{items.nombre}</span>
                            <div
                                className='d-flex justify-content-end align-items-center w-100'
                            >
                                {/* cantidad de conevrsaciones */}
                                <span className='mx-2'
                                    style={{
                                        fontSize: '12px',
                                    }}
                                >
                                    <i className="fas fa-comment"></i>
                                    {items.conversacion.length}
                                </span>
                            </div>
                        </div>
                        <div className='d-flex'>
                            {
                                items.conversacion.length > 0 ?
                                <EstadoAgente estado={items.conversacion[0].agente.estado} />
                                : <EstadoAgente estado={items.estado} />

                            }
                        </div>
                        <Row
                            // en md se muestra 3 elementos
                            // en sm se muestra 2 elementos
                            // en xs se muestra 1 elemento
                            className='d-flex justify-content-start md-3 sm-2 xs-1 align-items-center flex-wrap'
                            style={{ marginTop: '10px' }}
                          
                        >
                            {
                                items.equipo.length > 0 ?  items.equipo.map((e, index) => {
                                    return (
                                        <span key={index} className='mx-2 w-25'
                                            style={{
                                                fontSize: '12px',
                                            }}
                                        >
                                            <i className="fas fa-star" style={{color: 'gold'}}></i>
                                            {e.length > 10 ? e.substring(0, 6) + '...' : e}
                                        </span>
                                    )
                                }): null
                            }
                        </Row>
                        <div style={{padding:'10px'}} />
                    </CardHeader>
                    <CardBody
                        style={{ 
                            width: '100%', 
                            overflowY: 'auto',
                            height: '300px',
                            maxHeight: '300px',
                        }}
                    >
                        {
                            items.conversacion && items.conversacion.length > 0 ?
                            items.conversacion.map((c, index) => {
                                    return (
                                        <div key={index} className='d-flex justify-content-center align-items-center w-100 mb-1'
                                            style={{ background: '#f0f0f0', padding: '5px', borderRadius: '5px' }}
                                        >
                                            <div className='d-flex justify-content-start align-items-center w-100'>
                                                <img
                                                    src={c.Contactos.avatar}
                                                    alt='Adrian Mosquera'
                                                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                    className='mx-2'
                                                />
                                                {/* <ComponenteMultimedia item={c.mensajes} /> */}
                                                <small className="text-dark">
                                                    {
                                                    // limitar la cantidad de caracteres a mostrar
                                                    c.mensajes.type === "text"
                                                        ? String(c.mensajes.text).length > 40
                                                        ? String(c.mensajes.text).substring(0, 40) +
                                                            "..."
                                                        : c.mensajes.text
                                                        : // si es imagen o video mostrar el tipo de archivo
                                                        c.mensajes.type === "image" ||
                                                        c.mensajes.type === "video"
                                                        ? c.mensajes.type
                                                        : // si es audio mostrar el nombre del archivo
                                                        c.mensajes.type === "audio"
                                                        ? c.mensajes.type
                                                        : // si es archivo mostrar el nombre del archivo
                                                        c.mensajes.type === "file"
                                                        ? c.mensajes.type
                                                        : null
                                                    }
                                                </small>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className='d-flex justify-content-center align-items-center w-100'>
                                    <span>No hay conversaciones</span>
                                </div>
                        }
                    </CardBody>
                </Card>
            </Col>
        </>
    );
}

function EstadoAgente(props){
    const { estado } = props;
    return (
        <>
            {
                estado === 'online' ?
                <span className='mx-2'
                    style={{
                        fontSize: '12px',
                    }}
                >
                    <i className="fas fa-circle" style={{ color: 'green' }}></i>
                    En linea
                </span>:
                <span className='mx-2'
                    style={{
                        fontSize: '12px',
                    }}
                >
                    <i className="fas fa-circle" style={{ color: 'gray' }}></i>
                    Ausente
                </span>
            }
        </>
    );
}

export default CardCola;