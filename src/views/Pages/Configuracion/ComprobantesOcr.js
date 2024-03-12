
import axios from 'axios';
import { GetTokenDecoded, SubirMedia } from 'function/storeUsuario';
import { host } from "function/util/global";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
} from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function ComprobantesOcr(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setUrl('')
        setResponse('')
        setShow2(!show2)
    }

    const [url, setUrl] = useState('')
    const [response, setResponse] = useState('')


    const [ocrs, setOcrs] = useState({})
    const [inputOpen, setInputOpen] = useState({
        cuentaOpen: false,
        beneficiarioOpen: false,
        tipoBancoOpen: false,
        tipoComprobanteOpen: false,
    })
    const [inputValues, setInputValues] = useState({
        cuenta: '',
        beneficiario: '',
        tipoBanco: '',
        tipoComprobante: '',
    })
   
    const [ocr, setOcr] = useState({
        id: 0,
        cuenta_id: GetTokenDecoded().cuenta_id,
        key: '{}',
        cuentas: [],
        nombreBeneficiarios: [],
        endidaRecaud: [],
        tipoCompr: [],
        valorCompr: 0
    });

    const ListarOcrs = async () => {
        let url = host + 'comprobantes/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        if(status === 200 && data !== null){
            setOcrs(data)
        }
    }

    const handleOcrs = (e) => {
        setOcr({
            ...ocr,
            [e.target.name]: e.target.value,
        });
    }

    const RegistrarOcr = async (e) => {
        e.preventDefault()
        try {
            let url = host + 'comprobantes'
            let i = ocr.key
            if (i.startsWith('"') && i.endsWith('"')) {
                i = i.slice(1, -1);
                i = i.replace(/\\/g, "");
            }
            if(!JSON.parse(i)){
                alert('Debe ingresar un json valido')
            }else{
                let keys = {
                    key: JSON.parse(i),
                    cuenta_id: GetTokenDecoded().cuenta_id
                }
                console.log(keys)
                const { data, status } = await axios.post(url, keys)
                if(status === 200){
                    ListarOcrs()
                    setShow(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        (async()=>{
            await ListarOcrs()
        })()
    }, [])


    const ActualicarValidacion = async (typo, valor) => {
        let info = {
            ...ocrs,
        }
        if(typo === 'cuentas'){
            info.cuentas.push(valor)
            info.cuentas.sort()
        }else if(typo === 'nombreBeneficiarios'){
            info.nombreBeneficiarios.push(valor)
            info.nombreBeneficiarios.sort()
        }else if(typo === 'endidaRecaud'){
            info.endidaRecaud.push(valor)
            info.endidaRecaud.sort()
        }else if(typo === 'tipoCompr'){
            info.tipoCompr.push(valor)
            info.tipoCompr.sort()
        }
        const { data, status } = await axios.put(host + 'comprobantes_validacion', info)
        if(status === 200){
            setOcrs(data)
        }
    }

    const QuitarElementoValicacion = async (typo, valor) => {
        let info = {
            ...ocrs,
        }
        if(typo === 'cuentas'){
            info.cuentas = info.cuentas.filter(item => item !== valor)
        }else if(typo === 'nombreBeneficiarios'){
            info.nombreBeneficiarios = info.nombreBeneficiarios.filter(item => item !== valor)
        }else if(typo === 'endidaRecaud'){
            info.endidaRecaud = info.endidaRecaud.filter(item => item !== valor)
        }else if(typo === 'tipoCompr'){
            info.tipoCompr = info.tipoCompr.filter(item => item !== valor)
        }
        const { data, status } = await axios.put(host + 'comprobantes_validacion', info)
        if(status === 200){
            setOcrs(data)
        }
    }

    const SubirImagen = async (e) => {
        const url = await SubirMedia(e);
        if (url !== null) {
          setUrl(url);
          return url;
        } else {
          return null;
        }
    }
    const ValidarComprobante = async () => {
        let urlHtt = `${host}comprobantes_scaner/${ocr.cuenta_id}`
        const { data, status } = await axios.post(urlHtt, {url})
        if(status === 200){
            setResponse(data)
            setUrl('')
        }
    }


    
    return (
        <>
            <Container fluid >
                <h1>Key ocr</h1>
                {
                    ocrs.key_ocr !== undefined ? 
                    <button 
                        className='button-bm mr-2 w-25'
                        onClick={handleClose}>
                        Actualizar key
                    </button>:
                    <button 
                        className='button-bm mr-2 w-25'
                    onClick={handleClose}>
                        Agregar key
                    </button>
                }
                <br />
                {
                    <div >
                        <pre>{
                            JSON.stringify(ocrs.key_ocr, null, 2)
                            }</pre>
                        <label>Url</label>
                        <div className="form-group d-flex justify-content-start border border-0 rounded w-50">
                            <input 
                                className="form-control border-0 "
                                type="text"
                                name="key"
                                value={`${host}comprobantes_scaner?cuenta_id=${ocr.cuenta_id}`}
                                disabled
                                />
                            <CopyToClipboard text={`${host}comprobantes_scaner/${ocr.cuenta_id}`}>
                                {/* icono de copiar */}
                                <button className="btn active ml-2 border-0">
                                    <i className="fas fa-copy text-dark"></i>
                                </button>
                                
                            </CopyToClipboard>
                        </div>
                        {/* ejemplo de como se realiza la peticion */}
                        <label>Enviar peticion</label>
                        <div className="form-group d-flex justify-content-start border-0 rounded w-50">
                            <button
                                className="btn button-bm w-100"
                                onClick={handleClose2}
                            >
                                <b>
                                    Peticion de prueba
                                </b>
                            </button>
                            <Modal 
                                show={show2} 
                                onHide={handleClose2}
                                size="lg"    
                            >
                                <Modal.Header >
                                        <Modal.Title>Http</Modal.Title>
                                        <button
                                            type="button"
                                            className='btn btn mr-2 w-10'
                                            onClick={handleClose2}>
                                            <i className="fa fa-times"></i>
                                        </button>
                                </Modal.Header>
                                <Modal.Body>
                                    <input 
                                        className="form-control border-0"
                                        type="text"
                                        name="url"
                                        value={`POST:  ${host}comprobantes_scaner?cuenta_id=${ocr.cuenta_id}`}
                                    />
                                    <input
                                        className="form-control border-0"
                                        type="text"
                                        style={{height: '50px'}}
                                        name="body"
                                        value={`Body: {'url':'${url}'}`}
                                    />
                                    <br/>
                                    <textarea
                                        className="form-control border-0"
                                        type="text"
                                        style={{height: '150px'}}
                                        name="key"
                                        value={`Response: ${JSON.stringify(response, null, 2)}`}
                                        disabled
                                    />


                                    <Form onSubmit={RegistrarOcr}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Suba un Comprobante de pago</Form.Label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                name="url"
                                                id="avatar"
                                                accept="image/png, image/jpeg"
                                                onChange={(e) => SubirImagen(e.target.files[0])}
                                            />
                                            <br />
                                        </Form.Group>
                                        <Button
                                            className='button-bm mr-2 w-100'
                                            type="submit"
                                            disabled={url === ''}
                                            onClick={ValidarComprobante}
                                            >
                                            Enviar
                                        </Button>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                            {/* <textarea 
                                className="form-control border-0"
                                type="text"
                                cols={50}
                                rows={50}
                                style={{height: '50px'}}
                                name="key"
                                value={"curl --location --request POST 'https://codigomarret.online/comprobantes_scaner?cuenta_id=1' "+
                                "--header 'Content-Type: application/json' "+
                                "--data-raw '{\"url\": \"https://codigomarret.online/upload/img/rodas.jpeg\"}'"}
                                disabled
                                />
                            <CopyToClipboard text={`curl --location ${host}comprobantes_scaner?cuenta_id=${ocr.cuenta_id}' \
                                --header 'Content-Type: application/json' \
                                --data '{
                                    "url": "https://codigomarret.online/upload/img/rodas.jpeg"
                                }`}>
                                <button className="btn active ml-2 border-0">
                                    <i className="fas fa-copy text-dark"></i>
                                </button>
                            </CopyToClipboard> */}
                        </div>
                    </div>
                }
                <div className='mt-2'>
                    <Row
                        className="d-flex justify-content-start">
                            <Col
                                md={3}
                                xl={3}
                                sm={3}
                                lg={3}
                            >
                                <Card>
                                    <Card.Header
                                        style={{ backgroundColor: '#3F98F8'}}
                                    >
                                        <Card.Title className='d-flex justify-content-between text-white'>
                                            Formatos de Cuentas
                                            <button
                                                type="button"
                                                className='btn mr-2 w-10'
                                                onClick={() => setInputOpen({...inputOpen, cuentaOpen: !inputOpen.cuentaOpen})}>
                                                <i className="fa fa-pencil text-white"></i>
                                            </button>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                    <Card.Text>
                                            {
                                                inputOpen.cuentaOpen ?
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <input
                                                        type="text"
                                                        className="form-control w-75"
                                                        onChange={(e) => setInputValues({...inputValues, cuenta: e.target.value})}
                                                    />
                                                    <button
                                                        className='btn button-bm w-20'
                                                        onClick={() => ActualicarValidacion('cuentas', inputValues.cuenta)}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                </div>
                                                : null
                                            }
                                        </Card.Text>
                                        <div
                                            style={{
                                                height: '350px', 
                                                overflow: 'auto',
                                                scrollbarWidth: 'none',
                                                display: 'flex', 
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {
                                                ocrs && ocrs.cuentas ? ocrs.cuentas.map((item, index) => {
                                                    return (
                                                        <div key={index} className='d-flex justify-content-between align-items-center'>
                                                            <span >{item}</span>
                                                            <button
                                                                className='btn'
                                                                onClick={() => QuitarElementoValicacion('cuentas', item)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                                : null
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col
                                md={3}
                                xl={3}
                                sm={3}
                                lg={3}
                            >
                                <Card>
                                    <Card.Header 
                                        style={{ backgroundColor: '#3F98F8'}}
                                    >
                                        <Card.Title className='d-flex justify-content-between text-white'>
                                            Formatos de Beneficiarios
                                            <button
                                                type="button"
                                                className='btn mr-2 w-10'
                                                onClick={() => setInputOpen({...inputOpen, beneficiarioOpen: !inputOpen.beneficiarioOpen})}>
                                                <i className="fa fa-pencil text-white"></i>
                                            </button>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                    <Card.Text>
                                            {
                                                inputOpen.beneficiarioOpen ?
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <input
                                                        type="text"
                                                        className="form-control w-75"
                                                        onChange={(e) => setInputValues({...inputValues, beneficiario: e.target.value})}
                                                    />
                                                    <button
                                                        className='btn button-bm w-20'
                                                        onClick={() => ActualicarValidacion('nombreBeneficiarios', inputValues.beneficiario)}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                </div>
                                                : null
                                            }
                                        </Card.Text>
                                        <div
                                            style={{
                                                height: '350px', 
                                                overflow: 'auto',
                                                scrollbarWidth: 'none',
                                                display: 'flex', 
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {
                                                ocrs && ocrs.nombreBeneficiarios ? ocrs.nombreBeneficiarios.map((item, index) => {
                                                    return (
                                                        <div key={index} className='d-flex justify-content-between align-items-center'>
                                                            <span >{item}</span>
                                                            <button
                                                                className='btn'
                                                                onClick={() => QuitarElementoValicacion('nombreBeneficiarios', item)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                                : null
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col
                                md={3}
                                xl={3}
                                sm={3}
                                lg={3}
                            >
                                <Card>
                                    <Card.Header
                                        style={{ backgroundColor: '#3F98F8'}}
                                    >
                                        <Card.Title className='d-flex justify-content-between text-white'>
                                            Tipos de Bancos
                                            <button
                                                type="button"
                                                className='btn mr-2 w-10'
                                                onClick={() => setInputOpen({...inputOpen, tipoBancoOpen: !inputOpen.tipoBancoOpen})}>
                                                <i className="fa fa-pencil text-white"></i>
                                            </button>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                    <Card.Text>
                                            {
                                                inputOpen.tipoBancoOpen ?
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <input
                                                        type="text"
                                                        className="form-control w-75"
                                                        onChange={(e) => setInputValues({...inputValues, tipoBanco: e.target.value})}
                                                    />
                                                    <button
                                                        className='btn button-bm w-20'
                                                        onClick={() => ActualicarValidacion('endidaRecaud', inputValues.tipoBanco)}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                </div>
                                                : null
                                            }
                                        </Card.Text>
                                        <div
                                            style={{
                                                height: '350px', 
                                                overflow: 'auto',
                                                scrollbarWidth: 'none',
                                                display: 'flex', 
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {
                                                ocrs && ocrs.endidaRecaud ? ocrs.endidaRecaud.map((item, index) => {
                                                    return (
                                                        <div key={index} className='d-flex justify-content-between align-items-center'>
                                                            <span >{item}</span>
                                                            <button
                                                                className='btn'
                                                                onClick={() => QuitarElementoValicacion('endidaRecaud', item)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                                : null

                                            }
                                        </div>
                                    </Card.Body>

                                </Card>
                            </Col>
                            <Col
                                md={3}
                                xl={3}
                                sm={3}
                                lg={3}
                            >
                                <Card>
                                    <Card.Header
                                        style={{ backgroundColor: '#3F98F8'}}
                                    >
                                        <Card.Title className='d-flex justify-content-between text-white'>
                                            Tipos de Comprobantes
                                            <button
                                                type="button"
                                                className='btn mr-2 w-10'
                                                onClick={() => setInputOpen({...inputOpen, tipoComprobanteOpen: !inputOpen.tipoComprobanteOpen})}>
                                                <i className="fa fa-pencil text-white"></i>
                                            </button>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            {
                                                inputOpen.tipoComprobanteOpen ?
                                                <div className='d-flex justify-content-between align-items-center w-100'>
                                                    <input
                                                        type="text"
                                                        className="form-control w-75"
                                                        onChange={(e) => setInputValues({...inputValues, tipoComprobante: e.target.value})}
                                                    />
                                                    <button
                                                        className='btn button-bm w-20'
                                                        onClick={() => ActualicarValidacion('tipoCompr', inputValues.tipoComprobante)}
                                                    >
                                                        <i className="fa fa-check"></i>
                                                    </button>
                                                </div>
                                                : null
                                            }
                                        </Card.Text>
                                        <div
                                            style={{
                                                height: '350px', 
                                                overflow: 'auto',
                                                scrollbarWidth: 'none',
                                                display: 'flex', 
                                                flexDirection: 'column'
                                            }}
                                        >
                                            {
                                                ocrs && ocrs.tipoCompr ? ocrs.tipoCompr.map((item, index) => {
                                                    return (
                                                        <div key={index} className='d-flex justify-content-between align-items-center'>
                                                            <span >{item}</span>
                                                            <button
                                                                className='btn'
                                                                onClick={() => QuitarElementoValicacion('tipoCompr', item)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                                : null
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                    </Row>
                </div>


                <Modal show={show} onHide={handleClose}>
                    <Modal.Header >
                            <Modal.Title>Ocr</Modal.Title>
                            <button 
                            type="button"
                                className='btn btn mr-2 w-10'
                                onClick={handleClose}>
                                <i className="fa fa-times"></i>
                            </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={RegistrarOcr}>
                            <Form.Group className="mb-3">
                                <Form.Label>Key vision</Form.Label>
                                <textarea 
                                    className="form-control h-100"
                                    rows="3"
                                    cols={50}
                                    name="key"
                                    value={ocr.key}
                                    onChange={handleOcrs}></textarea>
                                <br />
                            </Form.Group>
                            <Button 
                            className='button-bm mr-2 w-100'
                            type="submit">
                                Guardar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                



            </Container>
        </>
    );
}

export default ComprobantesOcr;