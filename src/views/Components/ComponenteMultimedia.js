
function ComponenteMultimedia(props) {
    const {item} = props;
    if (item === null || item === undefined) {
        return null;
    }
    if (item.type === "text") {
        let texto = item.text ? String(item.text) : "";
        // Expresiones regulares para encontrar texto entre asteriscos y guiones bajos
        const boldRegex = /\*(.*?)\*/g;
        const italicRegex = /_(.*?)_/g;
        // Reemplaza el texto entre asteriscos y guiones bajos con etiquetas <strong> y <em>
        let formattedText = texto.replace(boldRegex, "<strong>$1</strong>");
        formattedText = formattedText.replace(italicRegex, "<em>$1</em>");
        return <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} dangerouslySetInnerHTML={{ __html: formattedText }} />;
    } else if (item.type === "image") {
        // cuando se haga click en la imagen se debe abrir en un modal
        // validar si la dentro de la imagen hay texto, si hay texto mostrarlo debajo de la imagen
        let texto = item.text ? String(item.text) : "";
        return (
            <div className="d-flex flex-column gap-2 align-items-center">
                <img src={item.url} alt="imagen" width={250}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        window.open(item.url, "_blank");
                    }}
                />
                {item.text !== "" && <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }} >{
                    texto
                }</span>}
            </div>
        );
    } else if (item.type === "video") {
        return (
            <video controls width={250}>
                <source src={item.url} type="video/mp4" />
            </video>
        )
    } else if (item.type === "contact") {
        return <span className="">{String(item.text)}</span>;
    } else if (item.type === "file") {
        // preview del archivo
        if (item.url.split('.').pop() === 'xlsx' || item.url.split('.').pop() === 'xls') {
            // si es xlsx mostrar el icono de excel y cuando se haga click descargar el archivo
            return (
                <div className="d-flex gap-2">
                    <span className="material-symbols-outlined">insert_drive_file</span>
                    <a href={item.url} download>
                        {item.url.split('/').pop()}
                    </a>
                </div>
            )
            // si es .json .exe .docx .doc .pptx .ppt .txt .zip .rar mostrar el icono de archivo y cuando se haga click descargar el archivo
        } else if (item.url.split('.').pop() === 'json' || item.url.split('.').pop() === 'exe' || item.url.split('.').pop() === 'docx' || item.url.split('.').pop() === 'doc' || item.url.split('.').pop() === 'pptx' || item.url.split('.').pop() === 'ppt' || item.url.split('.').pop() === 'txt' || item.url.split('.').pop() === 'zip' || item.url.split('.').pop() === 'rar') {
            return (
                <div className="d-flex gap-2">
                    <span className="material-symbols-outlined">insert_drive_file</span>
                    <a href={item.url} download>
                        {item.url.split('/').pop()}
                    </a>
                </div>
            )
        } else {
            return <iframe src={item.url} height="400px"></iframe>;
        }

    } else if (item.type === "audio" || item.type === "voice") {
        return (
            <audio controls>
                <source src={item.url} type="audio/ogg" />
            </audio>
        );
    }else if(item.type === "location"){
        return <span className="">{String(item.text)}</span>;
    } else {
        return null;
    }
}

export default ComponenteMultimedia;