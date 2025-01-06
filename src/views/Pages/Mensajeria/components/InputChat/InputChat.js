import { AudioRecorder } from 'react-audio-voice-recorder';
import { handlePaste } from '../../service/ultilInputs';

export default function InputChat({inputStr, setInputStr, EnvianMensaje, linkPreview, CargarAvatar, colorPrimario, disabledInput, setShowRespuesta, setShowPicker, setTypeInput, showRespuesta, addAudioElement, openGrande, setOpenGrande}) {
  return (
    <div className="row rounded border-top d-flex d-flex flex-column flex-md-row align-items-center pt-2" style={{ minHeight: "50px" }}>
    <div className="col-9 d-flex align-items-center py-1">
      {/* se hace visible las respuesta rapidas que el usuario las puedas seleccionar  */}
      <textarea
        className="w-100 rounded border text-dark px-3 bg-chat chat-text py-1"
        cols={"3"}
        rows={"3"}
        placeholder="Escribir ..."
        disabled={disabledInput}
        value={inputStr}
        onPaste={async (event)=>{
          const rest = await handlePaste(event);
          if(rest){
            setInputStr(rest.content);
            setTypeInput(rest.type);
          }
        }}
        onChange={(e) => {
          setInputStr(e.target.value)
        }}
        // cuando se presione enter enviar el mensaje
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            EnvianMensaje(e);
          }
        }}
        // detectar cuando el usuario digite / para mostrar las opciones de respuesta rapida
        onKeyUp={(e) => {
          if (e.key === "/") {
            setShowRespuesta(true);
          }else{
            setShowRespuesta(false);
          }
        }}
      ></textarea>
      {linkPreview && (
        <div className="link-preview">
          {
            // ver si es una imagen
            linkPreview.includes(".png") || linkPreview.includes(".jpg") || linkPreview.includes(".jpeg") ? (
              <img src={linkPreview} alt="link-preview" 
                // que la imagen se muestre en un tamaño pequeño
                style={{ width: "100px", height: "100px" }}
              />
            ) : (
              <a href={linkPreview} target="_blank" rel="noreferrer">
                {linkPreview}
              </a>
            )
          }
        </div>
      )}
      {
        
      }
    </div>

    <div
      className="col-3 d-flex gap-2 justify-content-end"
      style={{ zIndex: "400" }}
    >
      <button
        className="btn-chat"
        onClick={() => setShowPicker((val) => !val)}
      >
        <span className="material-symbols-outlined">mood</span>
      </button>

      <button className="btn-chat"
        // onClick={()=>setOpenGrande(!openGrande)}
      >
        {/* <span className="material-symbols-outlined">mic</span> */}
        <AudioRecorder
          onRecordingComplete={addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          // downloadOnSavePress={true}
          downloadFileExtension="mp3"
          classes={{
            display: "none",
          }}
        />
      </button>

      <button className="btn-chat"
        onClick={() => {
          setTypeInput("image");
          document.getElementById("file").click();
        }}
      >
        <input
          type="file"
          id="file"
          name="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            CargarAvatar(e.target.files[0])
          }}
        />
        <span className="material-symbols-outlined">image</span>
      </button>

      <button className="btn-chat"
        onClick={() => {
          setTypeInput("file");
          document.getElementById("cualquiercosa").click();
        }}
      >
        <input type="file" id="cualquiercosa" name="file" 
        // que acepte cualquier tipo de archivo menos imagen .exe
        accept="application/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.pdf,.json"
        style={{ display: "none" }}
          onChange={(e) => {
            CargarAvatar(e.target.files[0])
          }}
        />
        <span className="material-symbols-outlined">attach_file</span>
      </button>

      <button className="btn-chat d-flex align-items-center justify-content-center rounded-circle" 
        onClick={EnvianMensaje}
        style={{
          background: colorPrimario,
          color: "#fff",
        }}
      >
        <span className="material-symbols-outlined">send</span>
      </button>
    </div>
  </div>
  )
}
