import { colorPrimario, tabconversacion } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useEffect, useState } from 'react';
import {
  Nav,
  Spinner,
  Tab
} from 'react-bootstrap';
import TabPanel from './TabPanel';


function TabChat(props) {
    const { countC, card_mensajes, loading } = props;
    const [misConversaciones, setMisConversaciones] = useState('Sin leer');

    const { historyInfo, ping } = useMensajeria();

    const HanbleTab = (item) => {
        localStorage.setItem(tabconversacion, item)
        setMisConversaciones(item)
    }

    useEffect(() => {
        let tab = localStorage.getItem(tabconversacion)
        if(tab){
            setMisConversaciones(tab)
        }
    }, [misConversaciones])

    return (
        <>
          <Tab.Container id="left-tabs-example" defaultActiveKey="Sin leer">
            <Nav variant="tabs" className="flex-row flex-wrap">

              <Nav.Item onClick={() => HanbleTab('Sin leer')}>
                <Nav.Link eventKey="Sin leer" 
                  className="gap-1 d-flex"
                  style={{ fontSize: '13px' }}>
                  <span className="">Sin leer</span>
                  <span className="text-warning">{countC.sinLeer}</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item onClick={() => HanbleTab('Mias')}>
                <Nav.Link eventKey="Mias" 
                  className="gap-1 d-flex"
                  style={{ fontSize: '13px' }}>
                  <span className="">Mias</span>
                  <span className="text-warning">{countC.misConversaciones}</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item onClick={() => HanbleTab('Todas')}>
                <Nav.Link eventKey="Todas" 
                  className="gap-1 d-flex"
                  style={{ fontSize: '13px' }}>
                  Todos <span className="text-warning">{countC.todas}</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item onClick={() => console.log('Enviar mensaje')}>
                <Nav.Link
                  className="gap-1 d-flex hover-pointer"
                  style={{ fontSize: '13px' }}>
                  {/* icono para envia mensaje */}
                  <span class="material-symbols-outlined">
                    sms
                  </span>
                </Nav.Link>
              </Nav.Item>

            </Nav>

            {
              loading ? (
                <div className="w-100 d-flex justify-content-center align-items-center mt-1">
                  <Spinner animation="border" 
                    style={{
                      color: colorPrimario
                    }}
                  >
                  </Spinner>
                </div>
              ) : null
            }

            <TabPanel
                card_mensajes={card_mensajes}
                misConversaciones={misConversaciones}
            />
          </Tab.Container>
        </>
    );
}

export default TabChat;