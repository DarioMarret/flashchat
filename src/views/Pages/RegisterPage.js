import React from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Media,
  Navbar,
  Nav,
  Container,
  Row,
  Col
} from "react-bootstrap";

function RegisterPage() {
  return (
    <>
      <div
        className="full-page register-page section-image"
        data-color="orange"
        data-image={require("assets/img/bg5.jpg")}
      >
        <div className="content d-flex align-items-center">
          <Container>
            <Card className="card-register card-plain text-center">
              <Card.Header>
                <Row className="justify-content-center">
                  <Col md="8">
                    <div className="header-text">
                      <Card.Title as="h2">
                        Light Bootstrap Dashboard PRO
                      </Card.Title>
                      <Card.Subtitle as="h4">
                        Register for free and experience the dashboard today
                      </Card.Subtitle>
                      <hr></hr>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                Hola mundo
              </Card.Body>
            </Card>
          </Container>
        </div>
        <div
          className="full-page-background"
          style={{
            backgroundImage: "url(" + require("assets/img/bg5.jpg") + ")"
          }}
        ></div>
      </div>
    </>
  );
}

export default RegisterPage;
