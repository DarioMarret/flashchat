import { Container } from 'react-bootstrap';

function PageContrucion(props) {
    return (
        <>
          <Container fluid>
            <h1>Esta página está en construcción</h1>
            <p>Estamos trabajando en ella, por favor, vuelva más tarde.</p>
            <p>Gracias por su comprensión.</p>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                }}
            >
                <img
                    src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                    alt="Under construction"
                />
            </div>
          </Container>
        </>
    );
}

export default PageContrucion;