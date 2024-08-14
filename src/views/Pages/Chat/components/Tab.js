import { ServicesListarEtiquetas } from 'function/services/Etiquestas.services';
import { colorPrimario, tabconversacion } from 'function/util/global';
import useMensajeria from 'hook/useMensajeria';
import { useEffect, useState } from 'react';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
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
    const [etiquetaSelect, setEtiquetaSelect] = useState('');
    const [etiquetas, setEtiquetas] = useState([]);
    const [dropdownOpenEtiqueta, setDropdownOpenEtiqueta] = useState(false);

    const { historyInfo, ping } = useMensajeria();

    const HanbleTab = (item) => {
      localStorage.setItem(tabconversacion, item)
      setMisConversaciones(item)
    }
    const handleSelectEtiqueta = (key) => {
      localStorage.setItem(etiquetas, key)
      setEtiquetaSelect(key)
    }
    // listar Etiquestas
    const ListarEtiquetas = async () => {
      const data = await ServicesListarEtiquetas()
      setEtiquetas(data)
    }

    const OpenSelectEtiqueta = (e) => {
      e.preventDefault()
      setDropdownOpenEtiqueta(!dropdownOpenEtiqueta)
    }

    useEffect(() => {
        let tab = localStorage.getItem(tabconversacion)
        if(tab){
            setMisConversaciones(tab)
            ListarEtiquetas()
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

              {/* un filtro para las etiquetas */}
              {
                misConversaciones === 'Mias' || misConversaciones === 'Etiquetas' ? (
                  <Nav.Item onClick={() => HanbleTab('Etiquetas')}>
                    <Nav.Link eventKey="Etiquetas"
                      className="gap-1 d-flex"
                      style={{ 
                        borderRadius: '10px',
                        padding: '0px',
                        margin: '0px',
                        backgroundColor: 'transparent',
                        // color: 'black'
                      }}
                    >
                      <Dropdown
                        isOpen={dropdownOpenEtiqueta} 
                        toggle={(e)=>OpenSelectEtiqueta(e)} 
                        direction="up"
                        // el scroll de la lista de etiquetas
                        style={{
                        }}
                      >
                        <DropdownToggle
                        style={{ 
                          padding: '0px 2px 0px 0px',
                          margin: '0px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'black'
                        }}
                        >
                      <span class="material-symbols-outlined" 
                        title='Filtro'
                        aria-label='filter_list'
                        style={{
                          fontSize: '19px',
                          color: 'black',
                          padding: '0px 0px 0px 0px',
                          margin: '0px',
                        }}
                      >
                      filter_list
                      </span>
                        </DropdownToggle>
                        <DropdownMenu
                          style={{
                            maxHeight: '400px', // Define la altura máxima del menú desplegable
                            overflowY: 'auto',  // Habilita el scroll vertical si el contenido es mayor a 200px
                          }}
                        >
                          {
                            etiquetas.map((item, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() => handleSelectEtiqueta(item.etiquetas)}
                              >
                                <p 
                                  className="m-0"
                                  style={{
                                    fontSize: '12px',
                                    color: item.color,
                                  }}
                                >{
                                  item.etiquetas
                                }</p>
                              </DropdownItem>
                            ))
                          }
                        </DropdownMenu>
                      </Dropdown>
                    </Nav.Link>



                  </Nav.Item>
                ) : null
              }
              
              <Nav.Item onClick={() => onHideMensaje(true)}>
                <Nav.Link
                  className="gap-1 d-flex hover-pointer"
                  style={{ 
                    fontSize: '10px',
                    borderRadius: '10px',
                    padding: '0 5px',
                    margin: '0 5px',
                    backgroundColor: 'transparent',
                    color: 'black'
                   }}>
                  {/* icono para envia mensaje */}
                  <span className="material-symbols-outlined"
                    title='Enviar mensaje'
                  >
                    sms
                  </span>
                </Nav.Link>
              </Nav.Item>
              {/* cuando se aga click en el icono se tiene que desplegar la lista de etiquetas */}
              
                   

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
              etiquetaSelect={etiquetaSelect}
            />
          </Tab.Container>
        </>
    );
}

export default TabChat;