/* eslint-disable jsx-a11y/iframe-has-title */
import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp, colorPrimario } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import { Card, Col, Input, Row, Spinner } from "reactstrap";

export default function Galeria() {

    const [galeria, setGaleria] = useState([]);
    const [galeriaFiltrada, setGaleriaFiltrada] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState("");

    const ListarMultimedias = async () => {
        try {
            setLoading(true);
            const { data } = await BmHttp().get('multimedia?cuenta_id=' + GetTokenDecoded().cuenta.id);
            console.log(data);
            setGaleria(data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fecha !== "") {
            setGaleriaFiltrada(galeria.filter(item => moment(item.fecha).format("YYYY-MM-DD") === fecha));
        } else {
            setGaleriaFiltrada(galeria);
        }
    }, [fecha, galeria]);

    const formatSize = (size) => {
        if (size >= 1e9) {
            return (size / 1e9).toFixed(2) + " GB";
        } else if (size >= 1e6) {
            return (size / 1e6).toFixed(2) + " MB";
        } else if (size >= 1e3) {
            return (size / 1e3).toFixed(2) + " KB";
        } else {
            return size + " B";
        }
    };
    useEffect(() => {
        (async () => {
            await ListarMultimedias();
        })();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Galería de Multimedia</h1>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Row>
                    <div className="d-flex align-items-center">
                        <label className="mr-2 font-weight-bold mx-2">Total de archivos: {galeria.length}</label>
                        <label className="mr-2 font-weight-bold mx-2">Total de archivos filtrados: {galeriaFiltrada.length}</label>
                        <label className="mr-2 font-weight-bold mx-2">Tamaño Total: 
                            Tamaño Total: {formatSize(galeria.reduce((acc, item) => acc + item.size, 0))}

                        </label>
                    </div>
                </Row>
                <div className="d-flex align-items-center">
                    <label className="mr-2 font-weight-bold mx-2">Buscar por fecha:</label>
                    <div className="d-flex">
                        <Input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="mr-2"
                        />
                        <button 
                            style={{ height: '38px',
                                padding: '0 10px',
                                fontSize: '14px',
                                borderRadius: '5px',
                                border: 'none',
                                color: 'white',
                                backgroundColor: colorPrimario,
                                cursor: 'pointer',
                                marginLeft: '10px'
                             }}
                        onClick={() => setFecha("")}>Limpiar</button>
                    </div>
                </div>
            </div>
            {loading ? <div className="text-center"><Spinner color="primary" /></div> :
                <Row>
                    {galeriaFiltrada.length > 0 ? galeriaFiltrada.map((item, index) => (
                        <Col
                            key={index}
                            xs="12"
                            sm="12"
                            md="6"
                            lg="4"
                            xl="3"
                            className="mb-3"
                        >
                            <Card className="shadow-sm">
                                {item.type.startsWith("image/") && (
                                    <img src={item.url} alt={item.nombre} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                )}
                                {item.type === "audio/ogg" && (
                                    <audio controls className="w-100">
                                        <source src={item.url} type="audio/ogg" />
                                    </audio>
                                )}
                                {item.type === "video/mp4" && (
                                    <video width="100%" height="200" controls>
                                        <source src={item.url} type="video/mp4" />
                                    </video>
                                )}
                                {item.type === "application/pdf" && (
                                    <embed src={item.url} width="100%" height="200px" />
                                )}
                                {item.type.startsWith("application/") && !item.type.includes("pdf") && (
                                    <iframe src={item.url} width="100%" height="200px">
                                        
                                    </iframe>
                                )}
                                <div className="card-body text-center">
                                    <p className="mb-1" style={{ fontSize: '14px' }}>
                                        Tamaño: {item.size > 1000000 ? (item.size / 1000000).toFixed(2) + " MB" : (item.size / 1000).toFixed(2) + " KB"}
                                    </p>
                                    <p className="mb-1" style={{ fontSize: '14px' }}>
                                        Fecha: {moment(item.fecha).format("YYYY-MM-DD HH:mm:ss")}
                                    </p>
                                    <div className="d-flex justify-content-center">
                                        <i className="fa fa-trash text-danger mx-2" style={{ cursor: 'pointer' }}></i>
                                        <i className="fa fa-download text-primary mx-2" style={{ cursor: 'pointer' }}></i>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )) : <p className="text-center w-100">No se encontraron archivos para la fecha seleccionada.</p>}
                </Row>
            }
        </div>
    );
}
