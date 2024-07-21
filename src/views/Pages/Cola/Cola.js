import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp, colorPrimario } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container,
    Row
} from 'reactstrap';
import socket from 'views/SocketIO';
import CardCola from './components/CardCola';

function Cola(props) {
    const [agentes, setAgentes] = useState([]);
    const [agenteConConversacion, setAgenteConConversacion] = useState([]);
    const [TotalConevrsacion, setTotalConevrsacion] = useState([]);
    const [cuenta_id, setCuenta_id] = useState(GetTokenDecoded().cuenta_id);

    const ListarAgentes = async () => {
        const { data } = await BmHttp().get(`agentes/${GetTokenDecoded().cuenta_id}`);
        if(data.status === 200){
            await ListarEquipos(data.data);
        }
    }
    useEffect(() => {
        (async()=>{
            setCuenta_id(GetTokenDecoded().cuenta_id);
            await ListarAgentes();
        })()
    }, [])

    const ListarEquipos = async (agent) => {
        try {
            const { data } = await BmHttp().get(`equipo/${GetTokenDecoded().cuenta_id}`);
            if (data.status === 200) {
                const updatedAgents = agent.map((item) => {
                    const equipos = data.data.filter((equipo) => 
                        equipo.agenteId.some((agente) => agente.id === item.id)
                    ).map((equipo) => equipo.equipos);
                    return { ...item, equipo: equipos };
                });
    
                setAgentes(updatedAgents);
                socket.emit("listar_conversacion_cola", {
                    cuenta_id: GetTokenDecoded().cuenta_id,
                    agente_id: GetTokenDecoded().id,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        if (socket) {
            const handleResponseConversacion = (data) => {
                if (data && data.length > 0) {
                    setTotalConevrsacion(data);
                    const agentesConConversacion = agentes.map((agente) => {
                        const conversacion = data.filter((conversacion) => conversacion.agente_id === agente.id);
                        return { ...agente, conversacion };
                    });
                    setAgenteConConversacion(agentesConConversacion);
                    if (agentesConConversacion.length > 0) {
                        setAgentes(agentesConConversacion);
                    } else {
                        console.log('No hay agentes');
                    }
                }
            };
    
            socket.on(`response_conversacion_${cuenta_id}_${GetTokenDecoded().id}`, handleResponseConversacion);
    
            return () => {
                socket.off(`response_conversacion_${cuenta_id}_${GetTokenDecoded().id}`, handleResponseConversacion);
            };
        }
    }, [socket, agentes]);

    useEffect(() => {
        if (socket) {
            const handleNuevoMensaje = () => {
                socket.emit("listar_conversacion_cola", {
                    cuenta_id: GetTokenDecoded().cuenta_id,
                    agente_id: GetTokenDecoded().id,
                });
            };
    
            socket.on(`mensaje_${cuenta_id}`, handleNuevoMensaje);
    
            return () => {
                socket.off(`mensaje_${cuenta_id}`, handleNuevoMensaje);
            };
        }
    }, [socket, agentes]);
    
    return (
        <Container fluid>
            <Row
                className='d-flex justify-content-center align-items-center'
                style={{ marginTop: '20px' }}
                lg={4}
                md={4}
                sm={1}
                xs={1}
            >
                <Col>
                    <Card className='shadow d-flex justify-content-start align-items-center'>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div 
                                className='d-flex justify-content-center align-items-center text-center'
                                style={{ width: '25%', height: '100px', background: colorPrimario, color: 'white',
                                    borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'
                                }}
                            >
                                <i className="fas fa-globe"
                                    style={{ fontSize: '30px', color: 'white',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                ></i>
                            </div>
                            <div 
                                className='text-center d-flex justify-content-center align-items-center'
                                style={{ width: '75%', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <span>{TotalConevrsacion && TotalConevrsacion.length}</span>
                                <span>General</span>
                            </div>
                        </div>
                    </Card>
                </Col>
                
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div 
                                className='d-flex justify-content-center align-items-center text-center'
                                style={{ width: '25%', height: '100px', background: colorPrimario, color: 'white',
                                    borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'
                                }}
                            >
                                <i className="fas fa-network-wired"
                                    style={{ fontSize: '30px', color: 'white',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                ></i>
                            </div>
                            <div 
                                className='text-center d-flex justify-content-center align-items-center'
                                style={{ width: '75%', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <span>{
                                    TotalConevrsacion && TotalConevrsacion.length > 0 ?
                                        TotalConevrsacion.filter(conversacion => conversacion.equipo_id !== null).length
                                        : 0
                                    }</span>
                                <span>Equipo</span>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                            <div 
                                className='d-flex justify-content-center align-items-center text-center'
                                style={{ width: '25%', height: '100px', background: colorPrimario, color: 'white',
                                    borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'
                                }}
                            >
                                {/* icono mias */}
                                <i className="fas fa-user"
                                    style={{ fontSize: '30px', color: 'white',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                ></i>
                            </div>
                            <div 
                                className='text-center d-flex justify-content-center align-items-center'
                                style={{ width: '75%', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <span>{agentes.length}</span>
                                <span>Agentes</span>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                    <div className='d-flex justify-content-between align-items-center w-100'>
                            <div 
                                className='d-flex justify-content-center align-items-center text-center'
                                style={{ width: '25%', height: '100px', background: colorPrimario, color: 'white',
                                    borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px'
                                }}
                            >
                                {/* icono en bot */}
                                <i className="fas fa-robot"
                                    style={{ fontSize: '30px', color: 'white',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}
                                ></i>
                            </div>
                            <div 
                                className='text-center d-flex justify-content-center align-items-center'
                                style={{ width: '75%', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <span>{
                                    TotalConevrsacion && TotalConevrsacion.length > 0 ?
                                        TotalConevrsacion.filter(conversacion => conversacion.agente_id === null || conversacion.agente_id === 0).length
                                        : 0
                                    }</span>
                                <span>ChatBot</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Card 
                style={{
                    border: 'none',
                }}
            >
                <Row
                    className='d-flex justify-content-start align-items-center flex-wrap'
                    style={{ marginTop: '20px' }}
                    lg={4}
                    md={2}
                    sm={1}
                    xs={1}
                >
                    {
                        agenteConConversacion.length > 0 &&
                            agentes.map((agent, index) => (
                                <CardCola key={index} items={agent} />
                            ))
                    }
                </Row>
            </Card>
        </Container>
    );
}

export default Cola;