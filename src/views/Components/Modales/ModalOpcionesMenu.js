import { useState } from 'react';
import { Accordion, Modal } from 'react-bootstrap';

function ModalOpcionesMenu({ show, handleClose, menus, handleAssign, selectedMenus, setSelectedMenus }) {
    const [activeKey, setActiveKey] = useState(null);

    const handleSelectMenu = (menu) => {
        const idMenu = menu.id;
        const isSelected = selectedMenus.includes(idMenu);
        const subMenuIds = menu.views ? menu.views.map(view => view.id) : [];
        
        setSelectedMenus((prevSelected) => {
            if (isSelected) {
                return prevSelected.filter(id => id !== idMenu && !subMenuIds.includes(id));
            } else {
                return [...prevSelected, idMenu, ...subMenuIds];
            }
        });
    };

    const handleSelectSubMenu = (subMenuId) => {
        setSelectedMenus((prevSelected) => 
            prevSelected.includes(subMenuId)
                ? prevSelected.filter(id => id !== subMenuId)
                : [...prevSelected, subMenuId]
        );
    };

    const handleAccordionClick = (index, hasSubMenu) => {
        if (hasSubMenu) {
            setActiveKey(activeKey === index.toString() ? null : index.toString());
        }
    };

    const buildSelectedStructure = () => {
        return menus
            .filter(menu => selectedMenus.includes(menu.id))  // Solo los menús seleccionados
            .map(menu => ({
                ...menu,
                views: menu.views ? menu.views.filter(view => selectedMenus.includes(view.id)) : []
            }));
    };

    const assignMenus = () => {
        const selectedStructure = buildSelectedStructure();
        handleAssign(selectedStructure);
        handleClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size='lg'
        >
            <Modal.Header closeButton>
                <Modal.Title>Asignar Menú a Agente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Accordion defaultActiveKey="0">
                    {Array.isArray(menus) && menus.map((menu, index) => (
                        <Accordion.Item eventKey={index.toString()} key={menu.id}>
                            <Accordion.Header onClick={() => handleAccordionClick(index, menu.views && menu.views.length > 0)}>
                                <label
                                    style={{ display: 'block', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    <input
                                        style={{ marginRight: '5px' }}
                                        type="checkbox"
                                        checked={selectedMenus.includes(menu.id)}
                                        onChange={() => handleSelectMenu(menu)}
                                    />
                                    <i className={menu.icon} style={{ marginRight: '5px' }}></i>
                                    {menu.name}
                                </label>
                            </Accordion.Header>
                            <Accordion.Body>
                                {menu.views && menu.views.length > 0 && (
                                    <div style={{ marginLeft: '20px' }}>
                                        {menu.views.map((view) => (
                                            <label key={view.id} style={{ display: 'block' }}>
                                                <input
                                                    style={{ marginRight: '5px' }}
                                                    type="checkbox"
                                                    checked={selectedMenus.includes(view.id)}
                                                    onChange={() => handleSelectSubMenu(view.id)}
                                                />
                                                {view.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Modal.Body>
            <Modal.Footer>
                <button className='button-bm' onClick={handleClose}>
                    Cancelar
                </button>
                <button  
                    className='button-bm'
                    onClick={assignMenus}>
                    Asignar
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalOpcionesMenu;
