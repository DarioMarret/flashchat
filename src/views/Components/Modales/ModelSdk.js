/* eslint-disable jsx-a11y/iframe-has-title */
import { host_sdk, host_widget } from 'function/util/global';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const ModelSdk = ({ show, handleClose, sdk, setSdk, setRuta, ruta, id, handleCambiosdk, AcualizarSdk }) => {
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleShow = () => setShowModal(true)

    useEffect(() => {
        if(sdk !== null){
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
            }, 800)
        }
    }, [sdk])



    if(show && sdk !== null && id){
        setRuta(host_widget + window.btoa(JSON.stringify(sdk)))
    }else{
        return null
    }


  return (
    <Modal 
        size='xl'
        show={show} 
        onHide={handleClose}
    >
          <Modal.Header>
              <Modal.Title>WebChat</Modal.Title>
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handleClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
      <Modal.Body>
        {/* hcaer 2s diviciones una de 25% y la otra del 75% */}
        <div className="row">
          <div className="col-4 border rounded">
            <div id="configuracion">
                <div className="form-group">
                    <label>Background Color</label>
                    <input
                        type="color"
                        className="form-control"
                        id="backgroundColor"
                        name='backgroundColor'
                        placeholder="Background Color"
                        value={sdk.backgroundColor}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                {/* <div className="form-group">
                    <label>Font Color</label>
                    <select
                        className='form-control'
                        id="fontColor"
                        name='fontColor'
                        value={sdk.fontColor}
                        onChange={(e) => handleCambiosdk(e)}
                    >
                        <option value="white">White</option>
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="yellow">Yellow</option>
                    </select>
                </div> */}
                {/* <div className="form-group">
                    <label>Font Family</label>
                    <select
                        className='form-control'
                        id="fontFamily"
                        name='fontFamily'
                        value={sdk.fontFamily}
                        onChange={(e) => handleCambiosdk(e)}
                    >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div> */}
                <div className="form-group">
                    <label>Font Size</label>
                    <select className='form-control' id="fontSize"
                        name='fontSize'
                        value={sdk.fontSize}
                        onChange={(e) => handleCambiosdk(e)}
                    >
                        <option value="10px">10px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                        <option value="16px">16px</option>
                        <option value="18px">18px</option>
                        <option value="20px">20px</option>
                    </select>
                </div>
                {/* <div className="form-group">
                    <label>Position</label>
                    <select
                        className='form-control'
                        id="position"
                        name='position'
                        value={sdk.position}
                        onChange={(e) => handleCambiosdk(e)}
                    >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div> */}
                <div className="form-group">
                    <label>Titulo agente</label>
                    <input
                        type="text"
                        className="form-control"
                        id="titulo_agente"
                        placeholder="Titulo agente"
                        name='titulo_agente'
                        value={sdk.titulo_agente}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Subtitulo agente</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subtitulo_agente"
                        placeholder="Subtitulo agente"
                        name='subtitulo_agente'
                        value={sdk.subtitulo_agente}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Nombre agente</label>
                    <input
                        type="text"
                        className="form-control"
                        id="agente"
                        placeholder="Nombre agente"
                        name='agente'
                        value={sdk.agente}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Texto Bubble</label>
                    <input
                        type="text"
                        className="form-control"
                        id="texto_bubble"
                        placeholder="Texto Bubble"
                        name='texto_bubble'
                        value={sdk.texto_bubble}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Icon</label>
                    <input
                    type="file"
                    className="form-control"
                    id="icon"
                    placeholder="Icon"
                    name='icon'
                    // value={sdk.icon}
                    onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Icon Burl</label>
                    <input
                    type="file"
                    className="form-control"
                    id="iconBurl"
                    placeholder="Icon Burl"
                    name='iconBurl'
                    // value={sdk.iconBurl}
                    onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Avatar Agente</label>
                    <input
                    type="file"
                    className="form-control"
                    id="avatar_agente"
                    placeholder="Icon Burl"
                    name='avatar_agente'
                    // value={sdk.avatar_agente}
                    onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="form-group">
                    <label>Formulario registro</label>
                    <input
                        type="checkbox"
                        id="formulario"
                        className='switch'
                        name='formulario'
                        checked={sdk.formulario}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                {/* builderBubble */}
                <div className="form-group">
                    <label>Builder Bubble</label>
                    <input
                        type="checkbox"
                        id="builderBubble"
                        className='switch'
                        name='builderBubble'
                        checked={sdk.builderBubble}
                        onChange={(e) => handleCambiosdk(e)}
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <button
                        className="button-bm mr-2 w-50 mt-3"
                        onClick={() => { AcualizarSdk(id) }
                    }
                    >
                        Guardar cambios
                    </button>
                    <button
                        className="button-bm mr-2 w-50 mt-3"
                        onClick={() => { 
                            handleShow()
                        }
                    }
                    >
                        Generar script
                    </button>
                </div>
            </div>
          </div>

          <div className="col-8  border rounded">
            {
                loading ? <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> : 
                <div id="webchat" 
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <iframe
                        src={ruta}
                        width="100%"
                        height="100%"
                    >
                    </iframe>
                </div>
            }
          </div>
        </div>
      </Modal.Body>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
            <Modal.Title>Nuevo scrio webchat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Copia el siguiente script i pegalo en el html de tu pagina en la seccion de script del body</p>
            <div
                style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '5px',
                    overflow: 'auto',
                    height: '300px',
                }}
            >
                <pre>
                    {`
                    <script>
                        (function() {
                        window.SDKlm = {
                            config: {
                                publicId: "${sdk.publicId}",
                                cuenta_id: "${sdk.cuenta_id}",
                                nombreunico: "${sdk.nombreunico}",
                                channel_id: "${sdk.channel_id}",
                                session_id: "${sdk.session_id}",
                                backgroundColor: "${sdk.backgroundColor}",
                                fontColor: "${sdk.fontColor}",
                                fontFamily: "${sdk.fontFamily}",
                                fontSize: "${sdk.fontSize}",
                                position: "${sdk.position}",
                                titulo_agente: "${sdk.titulo_agente}",
                                subtitulo_agente: "${sdk.subtitulo_agente}",
                                agente: "${sdk.agente}",
                                texto_bubble: "${sdk.texto_bubble}",
                                icon: "${sdk.icon}",
                                iconBurl: "${sdk.iconBurl}",
                                avatar_agente: "${sdk.avatar_agente}",
                                formulario: ${sdk.formulario},
                                builderBubble: ${sdk.builderBubble}
                            }
                        };
                        var s = document.createElement("script");
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = "${host_sdk}";
                        var x = document.getElementsByTagName('script')[0];
                        x.parentNode.insertBefore(s, x);
                        })();
                    </script>
                    `}
                </pre>
            </div>

        </Modal.Body>
        <Modal.Footer
            style={{
                display: 'flex',
                justifyContent: 'end'
            }}
        >
            <button className="btn btn-primary"
                onClick={() => setShowModal(false)}
            >Cerrar</button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default ModelSdk;
