import {
    Card,
    Container
} from "react-bootstrap";


function Historital(props) {
    return (
        <>
            <Container fluid>
                <Card className="shadow">
                    <table
                        responsive
                        className="table-personalisado table-hover"
                     >
                        <thead>
                            <tr className="text-white text-center font-weight-bold text-uppercase text-monospace align-middle">
                                <th># Orden</th>
                                <th>Forma de pago</th>
                                <th>Descripción</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>1</td>
                                <td>Transferencia</td>
                                <td>Plan Básico</td>
                                <td>29/02/2024</td>
                                <td>Pagado</td>
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

export default Historital;