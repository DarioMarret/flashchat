import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp } from 'function/util/global';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CorreoDetail from './components/CorreoDetail';
import CorreoList from './components/CorreoList';
import EmailForm from './components/EmailForm';

const PCorreo = () => {
    const [correos, setCorreos] = useState([]);
    const [selectedCorreo, setSelectedCorreo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [initialFormData, setInitialFormData] = useState({});

    useEffect(() => {
        const fetchCorreos = async () => {
          try {
            const { data } = await BmHttp().get('correos/'+GetTokenDecoded().cuenta_id);
            setCorreos(data);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching correos:", error);
            setLoading(false);
          }
        };
        fetchCorreos();
      }, []);


      const ListarCorreos = async () => {
        try {
          setLoading(true);
          const { data } = await BmHttp().get('correos/'+GetTokenDecoded().cuenta_id);
          setCorreos(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching correos:", error);
          setLoading(false);
        }
      }

      const handleNewEmail = () => {
        setInitialFormData({});
        setShowForm(true);
      };
    
      const handleReply = (correo) => {
        setInitialFormData({
          to: correo.from[0].address,
          subject: `Re: ${correo.subject}`,
          isReply: true,
        });
        setShowForm(true);
      };
    
      const handleCloseForm = () => {
        setShowForm(false);
        setInitialFormData({});

      };

      return (
        <Container fluid>
        <Row>
          <Col xs={4} className="p-0">
            <button 
                onClick={handleNewEmail} className="button-bm ml-2">
                Nuevo Correo
            </button>
            <button className="button-bm ml-2" onClick={ListarCorreos}>
              {/* icono para recargar  */}
              <i className="fas fa-sync-alt"></i>
            </button>
            <CorreoList correos={correos} loading={loading} onSelectCorreo={setSelectedCorreo} onReply={handleReply} />
          </Col>
          <Col xs={8} className="p-0">
          <CorreoDetail correo={selectedCorreo} onReply={handleReply} />
          </Col>
        </Row>
        <EmailForm 
          show={showForm} 
          handleClose={handleCloseForm} 
          initialData={initialFormData} 
          ListarCorreos={ListarCorreos} 
        />
      </Container>
      );
    };

export default PCorreo;
