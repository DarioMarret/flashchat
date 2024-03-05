import {
    Card,
    Container
} from "react-bootstrap";

function ProximaFactura(props) {
    return (
        <>
            <Container fluid>
                <Card className="shadow">
                    <table responsive className="table-personalisado table-hover">
                        <thead>
                            <tr className="text-white text-center font-weight-bold text-uppercase text-monospace align-middle">
                                <th>Siguiente pago</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>29/03/2024</td>
                                <td>Plan Básico +</td>
                                <td>Procesando</td>
                                <td>
                                    <i className="fas fa-eye cursor-pointer"></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </Container>
        </>
    );
}

export default ProximaFactura;