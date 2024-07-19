import {
  Input
} from "reactstrap";
import TabChat from 'views/Pages/Chat/components/Tab';

export default function CardTab({handleBusqueda, onHideMensaje, countC, card_mensajes, loading, VerConversaciones, ManejarConversacion}) {
  return (
    <div className="chat-list bg-chat rounded-start">
      <div className="d-flex py-2 px-2 flex-wrap align-items-center justify-content-between">
        <div className="w-100 m-1">
          <Input
            className="input-dark text-dark bg-white"
            placeholder="Buscar chat"
            onChange={(e) => handleBusqueda(e)}
          />
        </div>
      </div>
      <TabChat
        onHideMensaje={onHideMensaje}
        countC={countC}
        card_mensajes={card_mensajes}
        loading={loading}
        VerConversaciones={VerConversaciones}
        ManejarConversacion={ManejarConversacion}
      />
    </div>
  )
}
