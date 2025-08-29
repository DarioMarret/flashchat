import { useState } from "react";

function AlertBanner(props) {
  const { message, type, btnColor, setMensajeBanner } = props;
  const [show, setShow] = useState(false);

  const handleClear = () => {
    setMensajeBanner({
      mensaje: "",
      color: "",
      tipo: "",
      cuenta_id: "",
      tiempo: 0
    });
    setShow(false);
  }
  
  let alertColor;

  switch (type) {
    case 'warning':
      alertColor = 'bg-warning';
      break;
    case 'info':
      alertColor = 'bg-info';
      break;
    case 'danger':
      alertColor = 'bg-danger';
      break;
    default:
      alertColor = 'bg-info';
  }

  return(
    <>
    {
      message ? 
      <div className="w-100">
        <section className={`${alertColor} mx-auto p-2 px-3 d-flex justify-content-between align-items-center`}  
          style={{ width: "100%" }}>
          <h5 className="text-center font-bold text-white mt-1" 
            style={{ 'fontSize': '16px' }}>
            {message}
          </h5>
          <button className={`btn ${btnColor}`} onClick={() => handleClear()}>X</button>
        </section>
      </div>
      : null
    }
    </>
  );
}

export { AlertBanner };
