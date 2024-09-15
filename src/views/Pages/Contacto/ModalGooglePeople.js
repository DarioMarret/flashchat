
import axios from 'axios';
import { GetTokenDecoded } from 'function/storeUsuario';
import { colorPrimario } from 'function/util/global';
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

function ModalGooglePeople(props) {
    const { show, onHide } = props;
    const clientId = "273479276179-0oes8c6m25b455k827nj7ebm0uhd2g6n.apps.googleusercontent.com"
    const redirect_uri = "https://api.flashchat.chat/backflash/people/callback"
    // Función para manejar la carga de archivos
    let newContact = {
        names: [{ givenName: "Juan LocalHost" }],
        phoneNumbers: [{ value: "1234567890" }],
    };

    const RedirectManual = async() => {
        const cuenta_id = GetTokenDecoded().cuenta_id;
        const response = await axios.post('https://api.flashchat.chat/backflash/set-session', { cuenta_id });
        console.log(response.data);
        const redirectUri = redirect_uri
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/contacts&access_type=offline&prompt=consent`;
        window.location.href = googleAuthUrl;

        // const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/contacts&access_type=offline&prompt=consent`;
        // window.location.href = googleAuthUrl;
    }

    useEffect(() => {
        // validar la query success que se recibe en la url
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        if(success) {
            console.log("success", success);
            if(window.localStorage.getItem("googlePeople") === null) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se ha autenticado correctamente',
                    icon: 'success',
                    confirmButtonColor: colorPrimario,
                    confirmButtonText: 'Aceptar'
                });
            }
            window.localStorage.setItem("googlePeople", success);
        }
    }, []);

    return (
        <Modal
            show={show}
            size="lg"
        >
            <Modal.Header>
                <div
                    style={{
                        fontSize: "1rem",
                        color: "#6c757d",
                    }}
                    >
                    <Modal.Title>Google People Api</Modal.Title>
                   <p>
                        Ahora puedes sincronizar tus contactos de Google People con el sistema.
                        Esto te permitirá tener una lista de contactos actualizada y poder
                        enviar mensajes a través de la plataforma.
                        reduccionendo las posibilidades de que tus mensajes sean marcados como spam o el bloqueo temporal de tu cuenta Whatsapp qr.
                   </p> 
                   <e>
                        Para continuar, por favor inicia sesión con tu cuenta de Google.
                   </e>
                </div>
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
                    <div className="">
                        <button className="button-bm w-100"
                            onClick={() => RedirectManual()}> 
                            Iniciar sesión con Google
                        </button>
                    </div>
                </div>
                <div className='d-flex justify-content-end'>
                    <button
                        className="mx-2 button-bm"
                        onClick={onHide}
                    >
                        Cancelar
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalGooglePeople;
