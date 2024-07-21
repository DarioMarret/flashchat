import { colorPrimario, tabconversacion } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useEffect, useState } from 'react';
import {
  Nav,
  Spinner,
  Tab
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TabPanel from './TabPanel';


function TabChat(props) {
    const { onHideMensaje, countC, card_mensajes, loading } = props;
    const { mensaje_card, count, historial, pingMensaje } = useSelector(state => state.mensajeria);
    const [misConversaciones, setMisConversaciones] = useState(localStorage.getItem(tabconversacion) || 'Sin leer');

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
    }, [misConversaciones, mensaje_card])

    return (
        <>
          <Tab.Container id="left-tabs-example" defaultActiveKey={misConversaciones}>
            <Nav variant="tabs" className="flex-row flex-wrap">

              <Nav.Item onClick={() => HanbleTab('Sin leer')}>
                <Nav.Link eventKey="Sin leer" 
                  className="gap-1 d-flex"
                  active={misConversaciones === 'Sin leer'}
                  style={{ 
                    fontSize: '12px',
                    borderRadius: '10px',
                    padding: '0 5px',
                    margin: '0 5px',
                    backgroundColor: misConversaciones === 'Sin leer' ? colorPrimario : '#CDCCCC',
                    color: misConversaciones === 'Sin leer' ? 'white' : 'black'
                  }}>
                  <span className="">Sin leer</span>
                  <span className="">{
                    count.sinLeer
                  }</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item onClick={() => HanbleTab('Mias')}>
                <Nav.Link eventKey="Mias" 
                  active={misConversaciones === 'Mias'}
                  className="gap-1 d-flex "
                  style={{ 
                    fontSize: '12px',
                    borderRadius: '10px',
                    padding: '0 5px',
                    margin: '0 5px',
                    backgroundColor: misConversaciones === 'Mias' ? colorPrimario : '#CDCCCC',
                    color: misConversaciones === 'Mias' ? 'white' : 'black'
                    
                   }}>
                  <span className="">Mias</span>
                  <span className="">{
                    count.misConversaciones
                  }</span>
                </Nav.Link>
              </Nav.Item>

              <Nav.Item onClick={() => HanbleTab('Todas')}>
                <Nav.Link eventKey="Todas" 
                  className="gap-1 d-flex"
                  active={misConversaciones === 'Todas'}
                  style={{ 
                    fontSize: '12px',
                    borderRadius: '10px',
                    padding: '0 5px',
                    margin: '0 5px',
                    backgroundColor: misConversaciones === 'Todas' ? colorPrimario : '#CDCCCC',
                    color: misConversaciones === 'Todas' ? 'white' : 'black',
                  }}
                >
                  Todos <span className="">{
                    count.todas
                  }</span>
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item onClick={() => onHideMensaje(true)}>
                <Nav.Link
                  className="gap-1 d-flex hover-pointer"
                  style={{ 
                    fontSize: '12px',
                    borderRadius: '10px',
                    padding: '0 5px',
                    margin: '0 5px',
                    backgroundColor: 'transparent',
                    color: 'black'
                   }}>
                  {/* icono para envia mensaje */}
                  <span className="material-symbols-outlined">
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