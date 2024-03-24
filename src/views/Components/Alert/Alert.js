function AlertBanner(props) {
  const { message, type, btnColor } = props;
  
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
    <div className="w-100 p-3">
      <section className={`${alertColor} mx-auto p-2 px-3 rounded d-flex justify-content-between align-items-center`}  
        style={{ width: "90%" }}>
        <h5 className="text-center font-bold text-white mt-1" 
          style={{ 'fontSize': '16px' }}>
          {message}
        </h5>

        <button className={`btn ${btnColor}`}>X</button>
      </section>
    </div>
  </>);
}

export { AlertBanner };
