import { GetTokenDecoded } from "function/storeUsuario";
import { BmHttp } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Card,
    Container
} from "react-bootstrap";

function ProximaFactura(props) {

    const [proximoPago, setProximoPago] = useState(null);

    const ListarProximoPago = async () => {
        try {
            const {data, status} = await BmHttp.get(`proximo_pago_plan/${GetTokenDecoded().cuenta_id}`)
            if(status === 200){
                console.log(data);
                setProximoPago(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        (async () => {
            await ListarProximoPago();
        })();
    }, []);
    return (
        <>
            <Container fluid>
                <Card className="shadow">
                    <table responsive className="table-personalisado table-hover">
                        <thead>
                            <tr className="text-white text-center font-weight-bold text-uppercase text-monospace align-middle">
                                <th>Fecha de Corte</th>
                                <th>Descripción</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Link Pagon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                proximoPago && [proximoPago].map((pago, index) => (
                                    <tr key={index} className="text-center">
                                        <td>{moment(pago.fecha_plazo).add(pago.plazo, 'day').format("YYYY/MM/DD")}</td>
                                        <td>{pago.planes.plan}</td>
                                        <td>{`$${(pago.monto).toFixed(2)}`}</td>
                                        <td>{pago.estado}</td>
                                        <td>
                                            <button
                                                className="btn"
                                                onClick={() => {
                                                    window.open(pago.link_pago);
                                                }}
                                            >
                                                <i className="fas fa-money-check-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Card>
            </Container>
        </>
    );
}

export default ProximaFactura;