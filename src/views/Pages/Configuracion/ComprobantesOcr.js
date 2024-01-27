
import axios from 'axios';
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import { useEffect, useState } from "react";
import {
    Button,
    Container,
    Form,
    Modal,
} from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';

function ComprobantesOcr(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);
    const [ocrs, setOcrs] = useState({})

    const [ocr, setOcr] = useState({
        id: 0,
        cuenta_id: GetTokenDecoded().cuenta_id,
        key: '{}',
    });

    const ListarOcrs = async () => {
        let url = host + 'comprobantes/'+GetTokenDecoded().cuenta_id
        const { data, status } = await axios.get(url)
        console.log(data)
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
    
    return (
        <>
            <Container fluid >
                <h1>Key ocr</h1>
                {
                    ocrs.key_ocr !== undefined ? 
                    <button 
                        className='btn btn-dark active mr-2 w-25'
                        onClick={handleClose}>
                        Actualizar key
                    </button>:
                    <button 
                        className='btn btn-dark active mr-2 w-25'
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
                        <div className="form-group d-flex justify-content-start border-0 rounded w-100">
                            <textarea 
                                className="form-control border-0"
                                type="text"
                                cols={50}
                                rows={50}
                                style={{height: '100px'}}
                                name="key"
                                value={`curl --location ${host}comprobantes_scaner?cuenta_id=${ocr.cuenta_id}' \
                                --header 'Content-Type: application/json' \
                                --data '{
                                    "url": "https://xfiv-content.s3.amazonaws.com/xfiv-content/external-images/share_dir/worldnet/20240123/c028effe-e033-4af9-bb4b-720ba9eaa421.jpeg"
                                }`}
                                disabled
                                />
                            <CopyToClipboard text={`curl --location ${host}comprobantes_scaner?cuenta_id=${ocr.cuenta_id}' \
                                --header 'Content-Type: application/json' \
                                --data '{
                                    "url": "https://xfiv-content.s3.amazonaws.com/xfiv-content/external-images/share_dir/worldnet/20240123/c028effe-e033-4af9-bb4b-720ba9eaa421.jpeg"
                                }`}>
                                {/* icono de copiar */}
                                <button className="btn active ml-2 border-0">
                                    <i className="fas fa-copy text-dark"></i>
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                }
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header >
                            <Modal.Title>Ocr</Modal.Title>
                            <button 
                                className='btn btn-dark active mr-2 w-10'
                                onClick={handleClose}>
                                X
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
                            className='btn btn-dark active mr-2 w-100'
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