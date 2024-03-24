function AlertBanner(props) {
  const { message } = props;
  
  return(
  <>
    <div className="w-100 p-3">
      <section className="border bg-danger mx-auto p-2 px-3 rounded d-flex justify-content-between align-items-center"  
        style={{ width: "90%" }}>
        <h5 className="text-center font-bold text-white mt-1" 
          style={{ 'fontSize': '16px' }}>
          {message}
        </h5>

        <button className="btn btn-danger">X</button>
      </section>
    </div>
  </>);
}

export { AlertBanner };
