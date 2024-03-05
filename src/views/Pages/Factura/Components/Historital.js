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
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                                <td>@mdo</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </Container>
        </>
    );
}

export default Historital;