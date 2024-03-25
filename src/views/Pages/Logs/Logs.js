import { GetTokenDecoded } from 'function/storeUsuario';
import { BmHttp, host } from 'function/util/global';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';


function Logs(props) {
    const [logs, setLogs] = useState([])
    const ListarLogs = async() => {
        const url = `${host}logs/?cuenta_id=${GetTokenDecoded().cuenta_id}&skip=0&take=15`
        const { data, status } = await BmHttp.get(url)
        if (status === 200) {
            setLogs(data.data)
        }else{
            setLogs([])
        }
    }
    useEffect(() => {
        (async()=>{
            await ListarLogs()
        })()
    }, [])
    return (
        <Container fluid>
        {/* Crear una tabla con paginador en la cabecera ca acciones realizado id logs */}
        <h1>Logs</h1>
        <Card style={{ overflow: 'auto' }}>
            <table responsive className='table-personalisado table-hover'>
                <thead>
                    <tr>
                        <th>Id logs</th>
                        <th>Acciones realizadas</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <tr key={index} >
                            <td className='text-center'>{log.id}</td>
                            <td>{log.log}</td>
                            <td>{moment(log.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div
                className='d-flex justify-content-between mx-3 mb-3'
            >
                <button className='button-bm'>Anterior</button>
                <button className='button-bm'>Siguiente</button>
            </div>
        </Card>
            
        </Container>
    );
}

export default Logs;