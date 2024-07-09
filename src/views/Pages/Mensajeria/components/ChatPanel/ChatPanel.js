import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import ComponenteMultimedia from "views/Components/ComponenteMultimedia";

export default function ChatPanel({ conversacionActiva, dummy }) {
    return (
      <div className="row chat-body">
        <div className="col-12">
          {conversacionActiva.map((item) => {
            // Generar un UUID para cada elemento si no tienen un id único
            const key = item.id + uuidv4(); // Reemplaza 'id' con la propiedad única de tu elemento
  
            if (item.tipo === "ingoing") {
              return (
                <div key={key} className="w-100 my-3">
                  <div className="w-50">
                    <section
                      className="w-fit d-flex flex-column px-3 py-2 rounded chat-item-detail chat-receiver"
                    >
                      <ComponenteMultimedia item={item.mensajes} />
                      <small>
                        {moment(item.createdAt) >= moment().subtract(1, "days")
                          ? moment(item.createdAt).format("hh:mm a")
                          : moment(item.createdAt).format("DD/MM/YYYY hh:mm a")}
                      </small>
                    </section>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={key} className="w-100 my-3 d-flex justify-content-end">
                  <div className="w-50 d-flex justify-content-end">
                    <section
                      className="border w-fit d-flex flex-column px-3 py-2 rounded chat-item-detail chat-sender"
                    >
                      <ComponenteMultimedia item={item.mensajes} />
                      <small>
                        {moment(item.createdAt) >= moment().subtract(1, "days")
                          ? moment(item.createdAt).format("hh:mm a")
                          : moment(item.createdAt).format("DD/MM/YYYY hh:mm a")}
                      </small>
                    </section>
                  </div>
                </div>
              );
            }
          })}
          <p className="text-center mt-3" ref={dummy}></p>
        </div>
      </div>
    );
  }