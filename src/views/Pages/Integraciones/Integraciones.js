import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp } from 'function/util/global';
import { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container
} from 'reactstrap';
import ModalMikritik from 'views/Components/Modales/ModalMikritik';


function Integraciones(props) {
    const [bots, setBots] = useState([]);
    const [estados, setEstados] = useState([]);
    const [onHideMidkritik, setonHideMidkritik] = useState(false);
    const [dataIntegracionMikrotik, setdataIntegracionMikrotik] = useState({
        nombreunico: '',
        host: '',
        token: '',
        accion: '',
        estado: '',
    })

    const showMidkritik = () => {
        setonHideMidkritik(!onHideMidkritik);
    }

    
    const ListarBots = async () => {
        const url = `bots/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await BmHttp.get(url);
        if(typeof data === 'string'){
            // convertir a json
            let newBot = JSON.parse(data);
            setBots(newBot.data);
        }else{
            if (data.status === 200) {
              setBots(data.data);
            }
        }
    }

    const ListarEstados = async () => {
        const url = `estados`;
        const { data, status } = await BmHttp.get(url);
        if(typeof data  === 'string'){
            let newEstados = JSON.parse(data);
            console.log(newEstados);
            setEstados(newEstados.data);
            
        }else{
            setEstados(data.data);
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarBots();
            await ListarEstados();
        })()
    }, []);

    return (
        <Container fluid>
            <h1>Integraciones</h1>

            <Card className="card-plain shadow">
                <Col
                    className='d-flex justify-content-start align-items-center'
                >
                    <img src="https://codigomarret.online/upload/img/mikrotik.png" alt="mikrotik"
                        style={{ width: '100px', height: '100px', padding: '10px' }}
                    />
                    <div style={{ padding: '10px' }} >
                        <h3>Mikrotik</h3>
                        <p>Integración con Mikrotik</p>
                    </div>
                    <div
                        style={{ padding: '10px' }}
                        className='d-flex justify-content-end align-items-center w-100'
                    >
                        <button
                            className="btn button-bm"
                            onClick={() => setonHideMidkritik(!onHideMidkritik)}
                        >
                            Configurar
                        </button>
                    </div>
                </Col>
            </Card>
            <Card className="card-plain shadow">
                <Col
                    className='d-flex justify-content-start align-items-center'
                >
                    <img src="https://codigomarret.online/upload/img/facturacion_electronica.jpg" alt="Factura"
                        style={{ width: '100px', height: '100px', padding: '10px' }}
                    />
                    <div style={{ padding: '10px' }} >
                        <h3>Factura</h3>
                        <p>Integración Factura Electronica</p>
                    </div>
                    <div
                        style={{ padding: '10px' }}
                        className='d-flex justify-content-end align-items-center w-100'
                    >
                        <button
                            className="btn btn button-bm disabled"
                        >
                            Beta
                        </button>
                    </div>
                </Col>
            </Card>
            <Card className="card-plain shadow">
                <Col
                    className='d-flex justify-content-start align-items-center'
                >
                    <img src="https://codigomarret.online/upload/img/ordenfacil.jpeg" alt="OrdenFacil"
                        style={{ width: '100px', height: '100px', padding: '10px' }}
                    />
                    <div style={{ padding: '10px' }} >
                        <h3>OrdenFacil</h3>
                        <p>Integración con OrdenFacil</p>
                    </div>
                    <div
                        style={{ padding: '10px' }}
                        className='d-flex justify-content-end align-items-center w-100'
                    >
                        <button
                            className="btn btn button-bm disabled"
                        >
                            Beta
                        </button>
                    </div>
                </Col>
            </Card>
            <Card className="card-plain shadow">
                <Col
                    className='d-flex justify-content-start align-items-center'
                >
                    <img src="https://codigomarret.online/upload/img/contifico.jpg" alt="Contifico"
                        style={{ width: '100px', height: '100px', padding: '10px' }}
                    />
                    <div style={{ padding: '10px' }} >
                        <h3>Contifico</h3>
                        <p>Integración con Contifico</p>
                    </div>
                    <div
                        style={{ padding: '10px' }}
                        className='d-flex justify-content-end align-items-center w-100'
                    >
                        <button
                            className="btn btn button-bm disabled"
                        >
                            Beta
                        </button>
                    </div>
                </Col>
            </Card>
            <ModalMikritik
                showMidkritik={showMidkritik}
                onHideMidkritik={onHideMidkritik}
                bots={bots}
                estados={estados}
            />
        </Container>
    );
}

export default Integraciones;