import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';

function CardChat(props) {
  const { index, messageItem, agente, verConversacion } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <>
      <div
      key={index + 1}
      className="chat-item rounded w-100">
        <div className="w-100 rounded px-2 rounded-1 rounded-bottom-0 d-flex justify-content-between align-items-center" 
        style={{ 
          backgroundColor: "#3F98F8",
          color: "white",
          fontSize: "13px" }}>
            <span>{ messageItem.bot }</span>

            <Dropdown 
              isOpen={dropdownOpen}
              toggle={toggle}>
              <DropdownToggle
                data-toggle="dropdown"
                tag="span"
              >
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem>Action 1</DropdownItem>
                <DropdownItem>Action 2</DropdownItem>
                <DropdownItem>Action 3</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>


        <div className="d-flex gap-2 align-items-center p-2 cursor-pointer" 
        onClick={verConversacion}>
          <div className="w-25 d-flex flex-column align-items-center justify-content-center">
            <div className="w-25 rounded d-flex align-items-center justify-content-center">
                <img
                  src={ messageItem.url_avatar }
                  className="rounded-circle"
                  width="50px"
                  height="50px"
                />
            </div>
          </div>

          <div className="w-75 p-1 d-flex flex-column">
            <div className="d-flex flex-column justify-content-between">
              <span className="w-100 text-dark font-bold text-start" 
              style={{ fontSize: '14px' }}>
                { messageItem.name }
              </span>

              <div className="w-100 d-flex justify-content-between">
                <small 
                className="text-warning" 
                style={{ fontSize: '12px' }}>{messageItem.fecha}</small>

                <div className="rounded-circle text-center p-0 circle-count bg-warning"
                style={{ fontSize: '12px' }}>
                  1
                </div>
              </div>
            </div>

            <div className="d-flex flex-row justify-content-between my-1" 
            style={{ lineHeight: '17px'}}>
              <small className="text-dark">
                {
                  // limitar la cantidad de caracteres a mostrar
                  messageItem.mensaje.type === "text"
                    ? String(messageItem.mensaje.text).length > 30
                      ? String(messageItem.mensaje.text).substring(0, 30) +
                        "..."
                      : messageItem.mensaje.text
                    : // si es imagen o video mostrar el tipo de archivo
                    messageItem.mensaje.type === "image" ||
                      messageItem.mensaje.type === "video"
                    ? messageItem.mensaje.type
                    : // si es audio mostrar el nombre del archivo
                    messageItem.mensaje.type === "audio"
                    ? messageItem.mensaje.type
                    : // si es archivo mostrar el nombre del archivo
                    messageItem.mensaje.type === "file"
                    ? messageItem.mensaje.type
                    : null
                }
              </small>
            </div>
          </div>
        </div>

        <div className="border-top w-100"></div>
        
        <div className="w-100 rounded px-2 my-2 rounded-1 rounded-top-0" 
        style={{ fontSize: "13px" }}>
          <div className="d-flex gap-2 flex-wrap mt-1">
              { messageItem.etiqueta.map((et, index) => {
                if (et !== null && et !== "" && et !== undefined){
                  return (
                    <span
                      key={index + 1}
                      className="chat-tag rounded bg-gray text-white"
                    >
                      {et}
                    </span>
                  );
                }
              })}
            <span className="w-20 text-dark font-bold"
              style={{ fontSize: "12px" }}
            >
            Ag: {agente}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export { CardChat }