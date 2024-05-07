import axios from 'axios';
import { GetTokenDecoded, IsKeyObject, SubirMedia } from 'function/storeUsuario';
import { BmHttp, host } from 'function/util/global';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Container,
    Modal,
    Row
} from 'react-bootstrap';
import Swal from 'sweetalert2';


function Masivos(props) {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const handleClose = () => {
        LimpiarEnvio()
        setShow(!show)
    }

    const [excel, setExcel] = useState({
        cuenta_id: GetTokenDecoded().cuenta_id,
        conexion: null,
        file: null,
        masivosId:0
    })
    const handleClose2 = (item) => {
        if(item){
            setExcel({
                ...excel,
                conexion: item.nombreunico,
                masivosId: item.id
            })
        }else{
            setExcel({
                ...excel,
                conexion: null,
                masivosId: 0,
                file: null
            })
        }
        setShow2(!show2)
    }

    const regex = /{{\d+}}/g;
    const [bots, setBots] = useState([]);
    const [masivos, setMasivos] = useState([]);
    const [progresoFile, setProgresoFile] = useState(0)
    const [listPlantillas, setListPlantillas] = useState([])
    const [catidadVariables, setCatidadVariables] = useState({
        header: [],
        headerVideo: {},
        body: [],
        footer: []
    })
    const [components, setComponents] = useState([])
    const [envio, setEnvio] = useState({
        id: 0,
        cuenta_id: GetTokenDecoded().cuenta_id,
        channel_id: 0,
        titulo: null,
        nombre_bot: null,
        nombreunico: null,
        fecha_envio: null,
        mensaje: null,
        mensaje_content: null,
        imagen:null,
        video:null,
        type: "imagen",
        plantilla_id: null,
        numero: null,
        parametros: [],
        plantilla: null,
        estado: null,
        progreso: 0,
        intervalo_entre: 10,
        retardo_entre_msjs: 1000,
        contact_plantilla: true,
        updatedAt: null,
        access_token: null,
        api_key: null,
        bots: []
    });

    const handleVariables = (e) => {
        let text = envio.mensaje_content
        if(e.target.name.includes('header_')){
            let h = e.target.name.split('_')
            // reemplazar el valor en la posicion
            text = String(text).replace(h[1], e.target.value)
            setEnvio({
                ...envio,
                mensaje: text
            })
            // guaradr la variable en la posicion en components
            let info = {
                id: h[1],
                type: 'header',
                text: e.target.value
            }
            // no se tiene que el id si es el mismo solo actualizamos el texto
            let existe = components.filter((item) => item.id === h[1] && item.type === 'header')
            if(existe.length === 0){
                setComponents([...components, info])
            }else{
                components.map((item, index) => {
                    if(item.id === h[1] && item.type === 'header'){
                        item.text = e.target.value
                    }
                })
            }
        }else if(e.target.name.includes('body_')){
            let b = e.target.name.split('_')
            // reemplazar el valor en la posicion
            text = String(text).replace(b[1], e.target.value)
            setEnvio({
                ...envio,
                mensaje: text
            })
            // guaradr la variable en la posicion en components
            let info = {
                id: b[1],
                type: 'body',
                text: e.target.value
            }
            // no se tiene que el id si es el mismo solo actualizamos el texto
            let existe = components.filter((item) => item.id === b[1] && item.type === 'body')
            if(existe.length === 0){
                setComponents([...components, info])
            }else{
                components.map((item, index) => {
                    if(item.id === b[1] && item.type === 'body'){
                        item.text = e.target.value
                    }
                })
            }
        }else if(e.target.name.includes('footer_')){
            let f = e.target.name.split('_')
            // reemplazar el valor en la posicion
            text = String(text).replace(f[1], e.target.value)
            setEnvio({
                ...envio,
                mensaje: text
            })
            // guaradr la variable en la posicion en components
            let info = {
                id: f[1],
                type: 'footer',
                text: e.target.value
            }
            // no se tiene que el id si es el mismo solo actualizamos el texto
            let existe = components.filter((item) => item.id === f[1] && item.type === 'footer')
            if(existe.length === 0){
                setComponents([...components, info])
            }else{
                components.map((item, index) => {
                    if(item.id === f[1] && item.type === 'footer'){
                        item.text = e.target.value
                    }
                })
            }
        }
    }

    const handleEnvio = (e) => {
        try {
            setEnvio({
                ...envio,
                [e.target.name]: e.target.value,
            })
            if(envio.type === 'video'){
                setEnvio({
                    ...envio,
                    video: e.target.value
                })
            }else if(envio.type === 'imagen'){
                setEnvio({
                    ...envio,
                    imagen: e.target.value
                })
            }else if(e.target.name === 'plantilla_id'){
                let text = ""
                listPlantillas.map((item) => {
                    if(item.id === e.target.value){
                        item.components.map((item)=>{
                            text += item.text ? item.text : '' 
                        })
                        setEnvio({
                            ...envio,
                            mensaje: text,
                            mensaje_content: text,
                            plantilla_id: item.id
                        })
                        item.components.map((item) => {
                            if(String(item.type).toLowerCase() === 'header' && item.text){
                                let h = item.text.match(regex);
                                console.log("H: ",h)
                                if(h !== null){
                                    setCatidadVariables({
                                        ...catidadVariables,
                                        header: h
                                    })
                                }
                            }else if(IsKeyObject(item, 'format') && String(item.format).toLowerCase() === "video"){

                                let h = {
                                    video: {
                                        link: item.example.header_handle[0]
                                    },
                                    type: "video"
                                }
                                setCatidadVariables({
                                    ...catidadVariables,
                                    headerVideo:h
                                })

                            }else if(String(item.type).toLowerCase() === 'body' && item.text){
                                let b = item.text.match(regex);
                                console.log("B: ",b)
                                if(b !== null){
                                    setCatidadVariables({
                                        ...catidadVariables,
                                        body: b
                                    })
                                }
                            }else if(String(item.type).toLowerCase() === 'footer' && item.text){
                                let f = item.text.match(regex);
                                console.log("F: ",f)
                                if(f !== null){
                                    setCatidadVariables({
                                        ...catidadVariables,
                                        footer: f
                                    })
                                }
                            }
                        })
                    }
                })
            }else if(e.target.name === 'contact_plantilla'){
                setEnvio({
                    ...envio,
                    contact_plantilla: e.target.checked
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleSelect = (item) => {
        if(item){
            let inf = JSON.parse(item.target.value)
            setEnvio({
                ...envio,
                nombre_bot: inf.nombre_bot,
                channel_id: inf.channel_id,
                nombreunico: inf.nombreunico,
                api_key: inf.api_key,
                access_token: inf.access_token
            });
            if(inf.channel_id === 4){
                ListarPlatilla360(inf.api_key)
            }else if(inf.channel_id === 3){
                console.log('whatsappCloud')
            }
        }
    }

    const LimpiarEnvio = () => {
        setEnvio({
            id: 0,
            cuenta_id: GetTokenDecoded().cuenta_id,
            channel_id: 0,
            titulo: null,
            nombre_bot: null,
            nombreunico: null,
            fecha_envio: null,
            mensaje: null,
            imagen:null,
            plantilla: null,
            parametros: [],
            estado: null,
            progreso: 0,
            intervalo_entre: 10,
            retardo_entre_msjs: 1000,
            updatedAt: null,
            access_token: null,
            api_key: null,
            video:null,
            plantilla_id: null,
            numero: null,
            contact_plantilla: false,
        })
    }

    const CargarAvatar = async(file) => {
        setProgresoFile(10)
        const url = await SubirMedia(file)
        if(url !== null){
            if(envio.type === 'video'){
                setEnvio({
                    ...envio,
                    video: url
                })
            }else{
                setEnvio({
                    ...envio,
                    imagen: url
                })
            }
            let i = 0
            for (i = progresoFile; i <= 100; i++) {
                setProgresoFile(i)
                if(i === 100){
                    setTimeout(() => {
                        setProgresoFile(0)
                    }, 1500);
                }
            }
            return url
        }else{
            setProgresoFile(0)
            return null
        }
    }
    
    const ListarBots = async() => {
        const url = `${host}bots/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        if (status === 200) {
            setBots(data.data)
        }
    }

    const ListarPlatilla360 = async(api_key) => {
        const { data, status } = await BmHttp.post('plantilla_360',{
            api_key
        });
        if (status === 200) {
            setListPlantillas(data.data)
        }
    }

    const handleCustomPlantilla =() => {
        let component = []
        const body = components.filter((item) => item.type === 'body')
        const header = components.filter((item) => item.type === 'header')
        const footer = components.filter((item) => item.type === 'footer')
        if(body.length > 0){
            component.push({
                type: "body",
                parameters: body.map((item) => {
                    return {
                        type: "text",
                        text: item.text
                    }
                })
            })
        }else if(header.length > 0){
            component.push({
                type: "header",
                parameters: header.map((item) => {
                    return {
                        type: "text",
                        text: item.text
                    }
                })
            })
        }else if(catidadVariables.headerVideo){
            component.push({
                type: "header",
                parameters: [catidadVariables.headerVideo]
            })
        }else if(footer.length > 0){
            component.push({
                type: "footer",
                parameters: footer.map((item) => {
                    return {
                        type: "text",
                        text: item.text
                    }
                })
            })
        }

        let info = null
        listPlantillas.map(async (item) => {
            if(item.id === envio.plantilla_id){
                info = {
                    api_key: envio.api_key,
                    plantilla: {
                        to: envio.numero,
                        type: "template",
                        template: {
                            namespace: item.namespace,
                            language: {
                                code: item.language,
                                policy: "deterministic"
                            },
                            name: item.name,
                            components: component
                        }
                    }
                }
            }
        })
        return info
    }

    const handleEditar = (item) => {
        setEnvio({
            ...envio,
            id: item.id,
            cuenta_id: item.cuenta_id,
            channel_id: item.channel_id,
            titulo: item.titulo,
            nombre_bot: item.nombre_bot,
            nombreunico: item.nombreunico,
            fecha_envio: item.fecha_envio,
            mensaje: item.mensaje,
            imagen: item.imagen,
            plantilla: item.plantilla,
            parametros: item.parametros,
            estado: item.estado,
            progreso: item.progreso,
            updatedAt: item.updatedAt,
        })
        setShow(true)
    }

    const handleType = (e) => {
        setEnvio({
            ...envio,
            type: e.target.value
        })
    }

    const EnvioPrueba = async(e) => {
        e.preventDefault()
        if(envio.numero === null || envio.numero === ''){
            Swal.fire({
                icon: 'error',
                title: 'El numero es obligatorio',
                showConfirmButton: false,
                timer: 1500
            })
            return null
        }
        if(envio.channel_id === 4 && envio.numero !== null && envio.plantilla_id !== null && envio.api_key !== null){
            let component = []
            const body = components.filter((item) => item.type === 'body')
            const header = components.filter((item) => item.type === 'header')
            const footer = components.filter((item) => item.type === 'footer')
            if(body.length > 0){
                component.push({
                    type: "body",
                    parameters: body.map((item) => {
                        return {
                            type: "text",
                            text: item.text
                        }
                    })
                })
            }else if(header.length > 0){
                component.push({
                    type: "header",
                    parameters: header.map((item) => {
                        return {
                            type: "text",
                            text: item.text
                        }
                    })
                })
            }else if(catidadVariables.headerVideo){
                component.push({
                    type: "header",
                    parameters: [catidadVariables.headerVideo]
                })
            }else if(footer.length > 0){
                component.push({
                    type: "footer",
                    parameters: footer.map((item) => {
                        return {
                            type: "text",
                            text: item.text
                        }
                    })
                })
            }

            listPlantillas.map(async (item) => {
                if(item.id === envio.plantilla_id){
                    let plan = {
                        api_key: envio.api_key,
                        plantilla: {
                            to: envio.numero,
                            type: "template",
                            template: {
                                namespace: item.namespace,
                                language: {
                                    code: item.language,
                                    policy: "deterministic"
                                },
                                name: item.name,
                                components: component
                            }
                        }
                    }
                    const { status } = await BmHttp.post('plantilla_envio_360', plan);
                    if (status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Plantilla enviada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al enviar mensaje',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            })
        }else if(envio.channel_id == 2){
            const {status} = await BmHttp.post("qr_mensaje_external",{
                sessionName: envio.nombreunico,
                numero: [envio.numero],
                mensaje: {
                    type: "masivo",
                    text: envio.mensaje,
                    image:envio.imagen,
                    video:envio.video, 
                }
            })
            if (status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Plantilla enviada',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar mensaje',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    const GuardarEnvio = async(e) => {
        e.preventDefault()
        let info = null
        if(envio.channel_id === 4){
            info = handleCustomPlantilla() 
        }else{
            info = {}
        }

        if(envio.titulo === null || envio.titulo === ''){
            Swal.fire({
                icon: 'error',
                title: 'El titulo es obligatorio',
                showConfirmButton: false,
                timer: 1500
            })
            return null
        }else if(envio.fecha_envio === null || envio.fecha_envio === ''){
            Swal.fire({
                icon: 'error',
                title: 'La fecha de envio es obligatoria',
                showConfirmButton: false,
                timer: 1500
            })
            return null
        }else if(envio.mensaje === null || envio.mensaje === ''){
            Swal.fire({
                icon: 'error',
                title: 'El mensaje es obligatorio',
                showConfirmButton: false,
                timer: 1500
            })
            return null
        }

        if(envio.id !== 0){
            try {
                const url = `${host}masivo/${envio.id}`;
                const { status } = await axios.put(url, envio);
                if (status === 200) {
                    ListarMasivos();
                    setShow(false)
                    LimpiarEnvio()
                    Swal.fire({
                        icon: 'success',
                        title: 'Masivo actualizado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } catch (error) {
                console.log(error)                
            }
        }else{
            try {
                const url = `${host}masivo`;
                const { status } = await axios.post(url, {...envio, plantilla: info});
                if (status === 200) {
                    ListarMasivos();
                    setShow(false)
                    LimpiarEnvio()
                    Swal.fire({
                        icon: 'success',
                        title: 'Masivo creado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } catch (error) {
                console.log(error)                
            }
        }
    }

    const ListarMasivos = async() => {
        const url = `${host}masivo/${GetTokenDecoded().cuenta_id}`;
        const { data, status } = await axios.get(url);
        console.log(data.data)
        if (status === 200) {
            setMasivos(data.data);
        }
    }

    const EliminarMasivo = async(id) => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podras revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async(result) => {
            if(result.isConfirmed){
                const url = `${host}masivo/${id}`;
                const { data, status } = await axios.delete(url);
                if (status === 200) {
                    ListarMasivos();
                }
            }
        })
    }

    const SubirExcel = async(e) => {
        e.preventDefault()
        const url = `masivo/subir?cuenta_id=${excel.cuenta_id}&conexion=${excel.conexion}&masivosId=${excel.masivosId}`;
        const formData = new FormData();
        formData.append('file', excel.file);
        fetch(`${host}${url}`, {
            method: 'POST',
            body: formData
        }).then((response) => {
            if(response.status === 200){
                Swal.fire({
                    icon: 'success',
                    title: 'Excel subido',
                    showConfirmButton: false,
                    timer: 1500
                })
                handleClose2()
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir el excel',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })
    }

    // descragr excel ejemplo
    const DescargarExcel = () => {
        let dataEjemplo = [{
            "nombre": "Juan",
            "telefono": "59334567890",
        }];

        const headers = Object.keys(dataEjemplo[0]);
        const csv = [
            headers.join(','),
            ...dataEjemplo.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
        ];
        const csvArray = csv.join('\r\n');
        const blob = new Blob([csvArray], { type: 'text/xlsx' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'ejemplo.xlsx');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Limpiar después de la descarga
    }

    useEffect(() => {
        (async() => {
            await ListarBots();
            await ListarMasivos();
        })()
    }, [])


    const ComponenteMultimedia = (item) => {
        if(item.imagen){
            return(
                <>
                    <span>Imgen: </span>
                    <img key={item.id} src={item.imagen} alt='...' width={250} />
                </>
            )
        }else if(item.video){
            return(
                <>
                    <span>Video: </span>
                    <video key={item.id} width={250} controls>
                        <source src={item.video} type="video/mp4" />
                    </video>
                </>
            )
        }else{
            return <></>
        }
    }

    return (
        <>
            <Container fluid>
            <div className='d-flex justify-content-start mb-3'>
                <button className="button-bm btn-dark active ml-2"
                    onClick={handleClose}
                >Programar envio masivo</button>
            </div>
            <div className='d-flex justify-content-start flex-wrap'>
                {
                    masivos.map((item, index) => (
                        console.log("Item: ",item),
                        <Col key={index}
                            className="w-fit d-flex flex-column px-3 py-2 bg-white border rounded shadow mb-3 m-2"
                            md="4"
                            sm="12"
                            lg="4"
                            // style={{ width: '40%' }}
                        >
                            <Card.Body>
                                <Row>
                                    <div className="w-fit d-flex flex-column px-3 py-2">
                                        <b>Conexion: {item.nombre_bot}</b>
                                        <b>Campana:</b>
                                        <span
                                        style={{ fontSize: '1.1rem', color: '#3F98F8', fontWeight: 'bold'}}
                                        >{item.titulo}</span>
                                        <b>Fecha de envio: {moment(item.fecha_envio).format("YYYY/MM/DD HH:mm")}</b>
                                        <b>Estado: <span style={{ color: item.estado === 'enviado' ? 'green' : 'red' }}> {item.estado}</span></b>
                                        <b>Total a enviar: {item.total}</b>
                                        <b>Progreso: {item.progreso}</b>
                                        <b>Intervalo de envio: {item.intervalo_entre}</b>
                                        <b>Retardo de envio entre mensajes: {item.retardo_entre_msjs}</b>
                                        {ComponenteMultimedia(item)}
                                        <span>Mensaje: </span>
                                        <b
                                            style={{ fontSize: '1.1rem', color: '#3F98F8', fontWeight: 'bold', cursor: 'pointer', width: 'auto'}}
                                        >{item.mensaje.substring(0, 50)}...</b>
                                    </div>
                                    <div className="w-fit d-flex flex-column px-3 py-2 ">
                                        <button className="button-bm btn "
                                            onClick={()=>handleEditar(item)}
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="button-bm btn" onClick={()=>EliminarMasivo(item.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                        {
                                            item.contact_plantilla ?
                                            <button className="button-bm btn"
                                                onClick={()=>handleClose2(item)}
                                            >
                                               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
                                                <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z"/>
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                               </svg>
                                            </button> : null
                                        }
                                    </div>
                                </Row>
                            </Card.Body>
                        </Col>
                    ))
                }
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header>
                    {
                        envio.id !== 0 ?
                        <Modal.Title>Editar envio</Modal.Title>:
                        <Modal.Title>Crear envio masivo</Modal.Title>
                    }
                    <button
                        type="button"
                        className='btn-dark mr-2 w-10'
                        onClick={handleClose}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="titulo">Titulo</label>
                            <input type="text" className="form-control" id="titulo" placeholder="titulo" name='titulo'
                                value={envio.titulo}
                                onChange={handleEnvio}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombreunico">Bot Envio</label>
                            <select className="form-control" id="nombreunico" name='nombreunico' onChange={handleSelect}>
                                <option value="">Seleccione un bot</option>
                                {
                                    bots.map((item, index) => (
                                        <option key={index} value={JSON.stringify(item)}>{item.nombre_bot}</option>
                                    ))
                                }
                            </select>
                            
                        </div>
                        
                            <div className='d-flex justify-conten-center'>
                                <div className="form-group m-1 col-4 col-md-4 col-lg-4">
                                    <label htmlFor="nombreunico">Intervalo de envio</label>
                                    <input type="number" className="form-control" id="intervalo_entre" placeholder="intervalo_entre" name='intervalo_entre'
                                        value={envio.intervalo_entre}
                                        onChange={handleEnvio}
                                    />
                                </div>

                                {/* restartdo entre mensajes */}

                                <div className="form-group m-1 col-4 col-md-4 col-lg-4">
                                    <label htmlFor="nombreunico">Retardo</label>
                                    <input type="number" className="form-control" id="retardo_entre_msjs" placeholder="retardo_entre_msjs" name='retardo_entre_msjs'
                                        value={envio.retardo_entre_msjs}
                                        onChange={handleEnvio}
                                    />
                                </div>

                                <div className="form-group m-1 col-3 col-md-4 col-lg-4">
                                    <label htmlFor="fecha_envio">Fecha de envio</label>
                                    <input type="datetime-local" className="form-control" id="fecha_envio" placeholder="Fecha de envio"
                                        name='fecha_envio'
                                        value={envio.fecha_envio}
                                        onChange={handleEnvio}
                                        />
                                </div>
                            </div>

                        <div className="form-group">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea className="form-control" id="mensaje" rows={50} cols={50}
                                style={{ height: '100px' }}
                                name='mensaje'
                                value={envio.mensaje}
                                onChange={handleEnvio}
                            />
                        </div>
                        {
                            envio.channel_id === 4 ?
                            <div className="form-group">
                                <label htmlFor="contact_plantilla" className="">Contactos externos</label>
                                <input type="checkbox" id="contact_plantilla" className='m-1'
                                    name='contact_plantilla'
                                    checked={envio.contact_plantilla ? true : false}
                                    value={envio.contact_plantilla}
                                    onClick={(e)=>handleEnvio(e)}
                                />
                            </div> : null
                        }
                        {
                            envio.channel_id !== 0 && envio.channel_id !== 2 ?
                            <div className="form-group">
                                <label htmlFor="todos_contactos" className="">Seleccione Plantilla</label>
                                <select className="form-control" id="plantilla" name='plantilla_id'
                                    value={envio.plantilla_id}
                                    onChange={handleEnvio}
                                >
                                    <option value="">Seleccione una plantilla</option>
                                    {  
                                        listPlantillas.map((item, index) => (
                                            <option key={index} value={item.id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                            </div> : null
                        }
                        {
                            envio.channel_id !== 0 && envio.channel_id !== 2 ?
                            <>
                            <div className="form-group">
                                {
                                    catidadVariables.header.length !== 0 ?
                                    <>
                                        <label htmlFor="parametros">Parametros Header</label>
                                        {
                                            catidadVariables.header.map((item, i) => (
                                                <input key={i} type="text" className="form-control" id="parametros" placeholder={`${item}`}
                                                    name={`header_${item}`}
                                                    onChange={handleVariables}
                                                />
                                            ))
                                        }
                                    </>: null
                                }
                            </div>
                            <div className="form-group">
                                {
                                    catidadVariables.body.length !== 0 ?
                                    <>
                                        <label htmlFor="parametros">Parametros Body</label>
                                        {
                                            catidadVariables.body.map((item, i) => (
                                                <input key={i} type="text" className="form-control m-1" id="parametros" placeholder={`${item}`}
                                                    name={`body_${item}`}
                                                    onChange={handleVariables}
                                                />
                                            ))
                                        }
                                    </>: null
                                }
                            </div>
                            <div className="form-group">
                                {
                                    catidadVariables.footer.length !== 0 ?
                                    <>
                                        <label htmlFor="parametros">Parametros Footer</label>
                                        {
                                            catidadVariables.footer.map((item, i) => (
                                                <input key={i} type="text" className="form-control" id="parametros" placeholder={`${item}`}
                                                    name={`footer_${item}`}
                                                    onChange={handleVariables}
                                                />
                                            ))
                                        }
                                    </>: null

                                }
                            </div>
                            </>
                            : null
                        }
                            {/* checkout para saver si envia imagen o video */}
                            <div className="form-group">
                            <label htmlFor="type">Tipo de multimedia</label>
                            <div className="d-flex">
                                <div className="">
                                    <label htmlFor="imagen">Imagen</label>
                                    <input type="checkbox" id="imagen"
                                        name='imagen'
                                        checked={envio.type === 'imagen' ? true : false}
                                        value="imagen"
                                        onChange={handleType}
                                    />
                                </div>
                                <div className="px-3">
                                    <label htmlFor="video">Video</label>
                                    <input type="checkbox" id="video"
                                        name='video'
                                        checked={envio.type === 'video' ? true : false}
                                        value="video"
                                        onChange={handleType}
                                    />
                                </div>
                            </div>
                        </div>
                        {
                            envio.type ?
                            <div className="form-group">
                                <label htmlFor="attachment">{
                                    envio.type === 'imagen' ? 'Imagen' : 'Video'
                                }</label>
                                <input 
                                    className="form-control" id={envio.type === 'imagen' ? 'imagen' : 'video'} placeholder="imagen"
                                    type="file"
                                    accept={envio.type === 'imagen' ? 'image/*' : 'video/*'}
                                    name={envio.type === 'imagen' ? 'imagen' : 'video'}
                                    onChange={(e) => CargarAvatar(e.target.files[0])}
                                />
                                {
                                    progresoFile !== 0 ?
                                    <p className='text-center mt-1'>{progresoFile}%</p> : null
                                }
                                {
                                    progresoFile !== 0 ?
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped progress-bar-animated" 
                                        role="progressbar" 
                                        aria-valuenow={progresoFile} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100" 
                                        style={{ width: `${progresoFile}%` }}></div>
                                    </div> : null
                                }
                            </div> : null
                        }

                        {
                            <div className="form-group">
                                <label htmlFor="parametros">Numero de prueba</label>
                                <input className="form-control" id="numero" 
                                    name='numero'
                                    value={envio.numero}
                                    onChange={handleEnvio}
                                />
                            </div> 
                        }

                        <div className="d-flex justify-content-center">

                            <button type="submit" className="button-bm btn-dark w-100 mt-4"
                                onClick={(e) => GuardarEnvio(e)}
                            >
                                {
                                    envio.id !== 0 ? 'Actualizar masivo' : 'Registrar masivo'
                                }
                            </button>
                            {
                                <button className="button-bm btn-dark w-100 mt-4"
                                    onClick={(e)=>EnvioPrueba(e)}
                                >
                                    Envio de prueba
                                </button>
                            }
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal
                show={show2}
                onHide={handleClose2}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header>
                    <Modal.Title>Envio de plantilla</Modal.Title>
                    <button
                        type="button"
                        className='btn-dark mr-2 w-10'
                        onClick={handleClose2}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <div className='d-flex justify-content-between'>
                                <label htmlFor="numero">Excel</label>
                                <a role='button' onClick={DescargarExcel} >Descarge el excel ejemplo</a>
                            </div>
                            <input type="file" className="form-control" id="excel" placeholder="excel" name='excel'
                                accept='.xlsx, .xls, .csv'
                                onChange={(e) => setExcel({...excel, file: e.target.files[0]})
                            }
                            />
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="button-bm btn-dark w-100 mt-4"
                                onClick={(e) => SubirExcel(e)}
                            >
                                Enviar plantilla
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            </Container>
        </>
    );
}

export default Masivos;