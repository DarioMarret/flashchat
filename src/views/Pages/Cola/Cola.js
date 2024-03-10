import {
    Card,
    Col,
    Container,
    Row
} from 'reactstrap';


function Cola(props) {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div>
                            <p>General</p>
                        </div>
                    </Card>
                </Col>
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div>
                            <p>Mias</p>
                        </div>
                    </Card>
                </Col>
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div>
                            <p>En cola</p>
                        </div>
                    </Card>
                </Col>
                <Col>
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div>
                            <p>ChatBot</p>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Col className='d-flex shadow'>
                <div className='d-flex justify-content-center align-items-center '>
                    <p>Agentes</p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <p>Equipos</p>
                </div>
            </Col>
            {/* <Row>
                <Col
                    lg='3'
                    md='3'
                    sm='6'
                    xl='3'
                    xs='6'
                >
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <div>
                            <p>Agentes</p>
                        </div>
                    </Card>
                </Col>
                <Col
                    lg='3'
                    md='3'
                    sm='6'
                    xl='3'
                    xs='6'
                >
                    <Card className='shadow d-flex justify-content-center align-items-center'>
                        <CardHeader>
                            <p>Agentes</p>
                        </CardHeader>
                        <CardBody>
                            <p>Agentes</p>
                        </CardBody>

                    </Card>
                </Col>
            </Row> */}
        </Container>
    );
}

export default Cola;