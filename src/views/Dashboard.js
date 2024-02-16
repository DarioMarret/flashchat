// react component used to create charts
// react components used to create a SVG / Vector map

// react-bootstrap components
import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { GetTokenDecoded } from "function/storeUsuario";
import { host } from "function/util/global";
import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Table
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const [bots, setBots] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [conversaciones, setConversaciones] = useState();
  const [agentes, setAgentes] = useState([]);


  const ListarBots = async() => {
    const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      const conversacionBot = await axios.get(`${host}bots_conversacion/${GetTokenDecoded().cuenta_id}`);
      console.log(conversacionBot.data);
      let count = 0;
      if(conversacionBot.status === 200){
        data.data.forEach((bot, index) => {
          conversacionBot.data.data.forEach((conversacion, index) => {
            if(bot.nombreunico === conversacion.nombreunico){
              bot["conversaciones"] = index+1;
              
            }
          })
        });
        setBots(data.data);
        data.data.forEach((bot, index) => {
          count += bot.conversaciones;
        });
        setConversaciones(count);

      }
    }
  }

  const ListarContactos = async() => {
    const url = `${host}contactos/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await axios.get(url);
    if (status === 200) {
      console.log(data);
      setContactos(data.data);
    }
  }
  const ListarAgentes = async() => {
    const url = `${host}agentes/${GetTokenDecoded().cuenta_id}`
    const { data, status } = await axios.get(url)
    if (status === 200) {
      setAgentes(data.data);
    }
  }

  useEffect(() => {
    console.log("useEffect App: ", GetTokenDecoded());
    (async()=>{
      await ListarContactos();
      await ListarAgentes();
      await ListarBots();
    })()
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FlashChat Bar',
      },
    },
  };
  const labels = bots.map(bot => bot.nombre_bot);
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-chart text-warning"></i> */}
                      {/* icono de clientes o contactos */}
                      <i className="nc-icon nc-single-02 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Contactos</p>
                      <Card.Title as="h4">{contactos.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats cursor-pointer">
                  <i className="fas fa-redo mr-1 cursor-pointer"></i>
                  Actualizar
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-light-3 text-success"></i> */}
                      {/* icono de mensajeria */}
                      <i className="nc-icon nc-chat-round text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Conversaciones</p>
                      <Card.Title as="h4">{conversaciones}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  A la fecha
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-vector text-danger"></i> */}
                      {/* bot */}
                      <i className="nc-icon nc-android text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Bot</p>
                      <Card.Title as="h4">{bots.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  Bots activos
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {/* <i className="nc-icon nc-favourite-28 text-primary"></i> */}
                      {/* icono de agentes */}
                      <i className="nc-icon nc-badge text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Agentes</p>
                      <Card.Title as="h4">{agentes.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Agentes en linea
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Conversaciones por bot</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md="6">
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th>Canal</th>
                          <th>Bot</th>
                          <th>Conversaciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          bots.map((bot, index) => (
                            <tr key={index}>
                              <td>{bot.channel.proveedor}</td>
                              <td>{bot.nombre_bot}</td>
                              <td>{bot.conversaciones}</td>
                            </tr>
                          ))
                        }
                      </tbody>

                    </Table>
                  </Col>
                      {/* grafica de barra  */}
                  <Col md="6">
                    <Bar
                      data={
                        {
                          labels: labels,
                          datasets: [
                            {
                              label: 'Conversaciones',
                              data: bots.map(bot => bot.conversaciones),
                              backgroundColor: "rgba(75,192,192,0.2)",
                              borderColor: "rgba(75,192,192,1)",
                              borderWidth: 1
                            }
                          ]
                        }
                      }
                      options={options}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Conversaciones por dias </Card.Title>
              </Card.Header>
              <Card.Body>
                <Bar
                  data={
                    {
                      labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
                      datasets: [
                        {
                          label: 'Conversaciones',
                          data: [12, 19, 3, 5, 2, 3, 10],
                          backgroundColor: "rgba(75,192,192,0.2)",
                          borderColor: "rgba(75,192,192,1)",
                          borderWidth: 1
                        }
                      ]
                    }
                  }
                  options={options}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Conversacion por mes</Card.Title>
                <p className="card-category">24/7</p>
              </Card.Header>
              <Card.Body>
                <Bar
                  data={
                    {
                      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', "Diciembre"],
                      datasets: [
                        {
                          label: 'Conversaciones',
                          data: [5, 5, 3, 5, 2, 3, 5, 5],
                          backgroundColor: "rgba(75,192,192,0.2)",
                          borderColor: "rgba(75,192,192,1)",
                          borderWidth: 1,
                          // base: 0,
                          // categoryPercentage: 0.5,
                          // barPercentage: 0.5,
                        }
                      ]
                    }
                  }
                  options={options}

                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">2017 Sales</Card.Title>
                <p className="card-category">All products including Taxes</p>
              </Card.Header>
              <Card.Body>

              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle mr-1 text-info"></i>
                  Tesla Model S{" "}
                  <i className="fas fa-circle mr-1 text-danger"></i>
                  BMW 5 Series
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Tasks</Card.Title>
                <p className="card-category">Backend development</p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Sign contract for "What are conference organizers
                          afraid of?"
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-688296980">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-202192706">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Lines From Great Russian Literature? Or E-mails From
                          My Boss?
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-746544352">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-743037005">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Flooded: One year later, assessing what was lost and
                          what was found when a ravaging rain swept through
                          metro Detroit
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-855684210">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-242945902">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>
                          Create 4 Invisible User Experiences you Never Knew
                          About
                        </td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-488557184">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-789597281">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Read "Following makes Medium better"</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-521344137">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-934093947">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Form.Check className="mb-1 pl-0">
                            <Form.Check.Label>
                              <Form.Check.Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              ></Form.Check.Input>
                              <span className="form-check-sign"></span>
                            </Form.Check.Label>
                          </Form.Check>
                        </td>
                        <td>Unfollow 5 enemies from twitter</td>
                        <td className="td-actions text-right">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-97404283">
                                Edit Task..
                              </Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="info"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="tooltip-888894273">Remove..</Tooltip>
                            }
                            placement="top"
                          >
                            <Button
                              className="btn-simple btn-link"
                              type="button"
                              variant="danger"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row> */}
      </Container>
    </>
  );
}

export default Dashboard;
