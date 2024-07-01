import {
    GetTokenDecoded,
    IsKeyObject,
    SubirMedia,
} from "function/storeUsuario";
import { BmHttp, host } from "function/util/global";
import moment from "moment";
import { useEffect, useState } from "react";
import { Card, Container, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

function Masivos(props) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const handleClose = () => {
    LimpiarEnvio();
    setShow(!show);
  };

  const handleClose3 = () => {
    setShow3(!show3);
  }

  const [excel, setExcel] = useState({
    cuenta_id: GetTokenDecoded().cuenta_id,
    conexion: null,
    file: null,
    masivosId: 0,
  });
  const handleClose2 = (item) => {
    if (item) {
      setExcel({
        ...excel,
        conexion: item.nombreunico,
        masivosId: item.id,
      });
    } else {
      setExcel({
        ...excel,
        conexion: null,
        masivosId: 0,
        file: null,
      });
    }
    setShow2(!show2);
  };

  const regex = /{{\d+}}/g;
  const [bots, setBots] = useState([]);
  const [masivos, setMasivos] = useState([]);
  const [progresoFile, setProgresoFile] = useState(0);
  const [listPlantillas, setListPlantillas] = useState([]);
  const [catidadVariables, setCatidadVariables] = useState({
    header: [],
    headerVideo: {},
    headerImagen: {},
    body: [],
    footer: [],
  });
  const [components, setComponents] = useState([]);
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
    imagen: null,
    video: null,
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
    bots: [],
  });

  // esto se acciona cuando se escribe en los inputs de las variables
  const handleVariables = (e) => {
    let text = envio.mensaje_content;
    if (e.target.name.includes("header_")) {
      let h = e.target.name.split("_");
      // reemplazar el valor en la posicion
      text = String(text).replace(h[1], e.target.value);
      setEnvio({
        ...envio,
        mensaje: text,
      });
      // guaradr la variable en la posicion en components
      let info = {
        id: h[1],
        type: "header",
        text: e.target.value,
      };
      // no se tiene que el id si es el mismo solo actualizamos el texto
      let existe = components.filter(
        (item) => item.id === h[1] && item.type === "header"
      );
      if (existe.length === 0) {
        setComponents([...components, info]);
      } else {
        components.map((item, index) => {
          if (item.id === h[1] && item.type === "header") {
            item.text = e.target.value;
          }
        });
      }
    } else if (e.target.name.includes("body_")) {
      let b = e.target.name.split("_");
      // reemplazar el valor en la posicion
      text = String(text).replace(b[1], e.target.value);
      setEnvio({
        ...envio,
        mensaje: text,
      });
      // guaradr la variable en la posicion en components
      let info = {
        id: b[1],
        type: "body",
        text: e.target.value,
      };
      // no se tiene que el id si es el mismo solo actualizamos el texto
      let existe = components.filter(
        (item) => item.id === b[1] && item.type === "body"
      );
      if (existe.length === 0) {
        setComponents([...components, info]);
      } else {
        components.map((item, index) => {
          if (item.id === b[1] && item.type === "body") {
            item.text = e.target.value;
          }
        });
      }
    } else if (e.target.name.includes("footer_")) {
      let f = e.target.name.split("_");
      // reemplazar el valor en la posicion
      text = String(text).replace(f[1], e.target.value);
      setEnvio({
        ...envio,
        mensaje: text,
      });
      // guaradr la variable en la posicion en components
      let info = {
        id: f[1],
        type: "footer",
        text: e.target.value,
      };
      // no se tiene que el id si es el mismo solo actualizamos el texto
      let existe = components.filter(
        (item) => item.id === f[1] && item.type === "footer"
      );
      if (existe.length === 0) {
        setComponents([...components, info]);
      } else {
        components.map((item, index) => {
          if (item.id === f[1] && item.type === "footer") {
            item.text = e.target.value;
          }
        });
      }
    }
  };

  const handleEnvio = (e) => {
    console.log("E: ", e.target.name);
    console.log("E: ", e.target.value);
    try {
      setEnvio({
        ...envio,
        [e.target.name]: e.target.value,
      });
      if (envio.type === "video") {
        setEnvio({
          ...envio,
          video: e.target.value,
        });
      } else if (envio.type === "imagen") {
        setEnvio({
          ...envio,
          imagen: e.target.value,
        });
      } else if (e.target.name === "plantilla_id") {
        let text = "";
        listPlantillas.map((item) => {
          if (item.id === e.target.value) {
            item.components.map((item) => {
              text += item.text ? item.text : "";
            });
            setEnvio({
              ...envio,
              mensaje: text,
              mensaje_content: text,
              plantilla_id: item.id,
            });
            item.components.map((item) => {
              if (String(item.type).toLowerCase() === "header" && item.text) {
                let h = item.text.match(regex);
                console.log("H: ", h);
                if (h !== null) {
                  setCatidadVariables({
                    ...catidadVariables,
                    header: h,
                  });
                }
              } else if (
                IsKeyObject(item, "format") &&
                String(item.format).toLowerCase() === "video"
              ) {
                let h = {
                  video: {
                    link: item.example.header_handle[0],
                  },
                  type: "video",
                };
                setCatidadVariables({
                  ...catidadVariables,
                  headerVideo: h,
                });
              } else if (
                IsKeyObject(item, "format") &&
                String(item.format).toLowerCase() === "image"
              ) {
                let h = {
                  image: {
                    link: item.example.header_handle[0],
                  },
                  type: "image",
                };
                setCatidadVariables({
                  ...catidadVariables,
                  headerImagen: h,
                });
              } else if (
                String(item.type).toLowerCase() === "body" &&
                item.text
              ) {
                let b = item.text.match(regex);
                if (b !== null) {
                  setCatidadVariables({
                    ...catidadVariables,
                    body: b,
                  });
                }
              } else if (
                String(item.type).toLowerCase() === "footer" &&
                item.text
              ) {
                let f = item.text.match(regex);
                if (f !== null) {
                  setCatidadVariables({
                    ...catidadVariables,
                    footer: f,
                  });
                }
              }
            });
          }
        });
      } else if (e.target.name === "contact_plantilla") {
        setEnvio({
          ...envio,
          contact_plantilla: e.target.checked,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (item) => {
    if (item) {
      let inf = JSON.parse(item.target.value);
      setEnvio({
        ...envio,
        nombre_bot: inf.nombre_bot,
        channel_id: inf.channel_id,
        nombreunico: inf.nombreunico,
        api_key: inf.api_key,
        access_token: inf.access_token,
        plantilla: inf.plantilla,
      });
      if (inf.channel_id === 4) {
        ListarPlatilla360(inf.api_key);
      } else if (inf.channel_id === 3) {
        console.log("whatsappCloud");
      }
    }
  };

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
      imagen: null,
      plantilla: null,
      parametros: [],
      estado: null,
      progreso: 0,
      intervalo_entre: 10,
      retardo_entre_msjs: 1000,
      updatedAt: null,
      access_token: null,
      api_key: null,
      video: null,
      plantilla_id: null,
      numero: null,
      contact_plantilla: false,
    });
  };

  const CargarAvatar = async (file) => {
    setProgresoFile(10);
    const url = await SubirMedia(file);
    if (url !== null) {
      if (envio.type === "video") {
        setEnvio({
          ...envio,
          video: url,
        });
      } else {
        setEnvio({
          ...envio,
          imagen: url,
        });
      }
      let i = 0;
      for (i = progresoFile; i <= 100; i++) {
        setProgresoFile(i);
        if (i === 100) {
          setTimeout(() => {
            setProgresoFile(0);
          }, 1500);
        }
      }
      return url;
    } else {
      setProgresoFile(0);
      return null;
    }
  };

  const ListarBots = async () => {
    const url = `bots/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await BmHttp().get(url);
    if (status === 200) {
      setBots(data.data);
    }
  };

  const ListarPlatilla360 = async (api_key) => {
    const { data, status } = await BmHttp().post("plantilla_360", {
      api_key,
    });
    if (status === 200) {
      setListPlantillas(data.data);
    }
  };

  const handleCustomPlantilla = () => {
    let component = [];
    const body = components.filter((item) => item.type === "body");
    const header = components.filter((item) => item.type === "header");
    const footer = components.filter((item) => item.type === "footer");
    if (Array.isArray(body).length > 0) {
      component.push({
        type: "body",
        parameters: body.map((item) => {
          return {
            type: "text",
            text: item.text,
          };
        }),
      });
    } else if (Array.isArray(header) && header.length > 0) {
      component.push({
        type: "header",
        parameters: header.map((item) => {
          console.log("Item: ", item);
          return {
            type: "text",
            text: item.text,
          };
        }),
      });
    } else if ( typeof catidadVariables.headerVideo === "object" && Object.keys(catidadVariables.headerVideo).length > 0) {
      component.push({
        type: "header",
        parameters: [catidadVariables.headerVideo],
      });
      // tambien lo seteamos en video para que se muestre en el modal
      setEnvio({
        ...envio,
        video: catidadVariables.headerVideo.video.link,
      });
    } else if (typeof catidadVariables.headerImagen === "object" && Object.keys(catidadVariables.headerImagen).length > 0 ) {
      component.push({
        type: "header",
        parameters: [catidadVariables.headerImagen],
      });
      // tambien lo seteamos en imagen para que se muestre en el modal
      setEnvio({
        ...envio,
        imagen: catidadVariables.headerImagen.image.link,
      });
    } else if (Array.isArray(footer) && footer.length > 0) {
      component.push({
        type: "footer",
        parameters: footer.map((item) => {
          return {
            type: "text",
            text: item.text,
          };
        }),
      });
    }
    let info = null;
    listPlantillas.map(async (item) => {
      if (item.id === envio.plantilla_id) {
        info = {
          api_key: envio.api_key,
          plantilla: {
            to: envio.numero,
            type: "template",
            template: {
              namespace: item.namespace,
              language: {
                code: item.language,
                policy: "deterministic",
              },
              name: item.name,
              components: component,
            },
          },
        };
      }
    });
    return info;
  };

  const handleEditar = (item) => {
    setEnvio(item);
    setShow(true);
  };

  const handleType = (e) => {
    setEnvio({
      ...envio,
      type: e.target.value,
    });
  };

  const EnvioPrueba = async (e) => {
    e.preventDefault();
    if (envio.numero === null || envio.numero === "") {
      Swal.fire({
        icon: "error",
        title: "El numero es obligatorio",
        showConfirmButton: false,
        timer: 1500,
      });
      return null;
    }
    if (
      envio.channel_id === 4 &&
      envio.numero !== null &&
      envio.plantilla_id !== null &&
      envio.api_key !== null
    ) {
      let component = [];
      const body = components.filter((item) => item.type === "body");
      const header = components.filter((item) => item.type === "header");
      const footer = components.filter((item) => item.type === "footer");
      if (Array.isArray(body).length > 0) {
        component.push({
          type: "body",
          parameters: body.map((item) => {
            return {
              type: "text",
              text: item.text,
            };
          }),
        });
      } else if (Array.isArray(header) && header.length > 0) {
        component.push({
          type: "header",
          parameters: header.map((item) => {
            console.log("Item: ", item);
            return {
              type: "text",
              text: item.text,
            };
          }),
        });
      } else if ( typeof catidadVariables.headerVideo === "object" && Object.keys(catidadVariables.headerVideo).length > 0 ) {
        component.push({
          type: "header",
          parameters: [catidadVariables.headerVideo],
        });
        // tambien lo seteamos en video para que se muestre en el modal
        setEnvio({
          ...envio,
          video: catidadVariables.headerVideo.video.link,
        });
      } else if ( typeof catidadVariables.headerImagen === "object" && Object.keys(catidadVariables.headerImagen).length > 0) {
        component.push({
          type: "header",
          parameters: [catidadVariables.headerImagen],
        });
        // tambien lo seteamos en imagen para que se muestre en el modal
        setEnvio({
          ...envio,
          imagen: catidadVariables.headerImagen.image.link,
        });
      } else if (Array.isArray(footer) && footer.length > 0) {
        component.push({
          type: "footer",
          parameters: footer.map((item) => {
            return {
              type: "text",
              text: item.text,
            };
          }),
        });
      }

      listPlantillas.map(async (item) => {
        if (item.id === envio.plantilla_id) {
          let plan = {
            api_key: envio.api_key,
            plantilla: {
              to: envio.numero,
              type: "template",
              template: {
                namespace: item.namespace,
                language: {
                  code: item.language,
                  policy: "deterministic",
                },
                name: item.name,
                components: component,
              },
            },
          };
          const { status } = await BmHttp().post("plantilla_envio_360", plan);
          if (status === 200) {
            Swal.fire({
              icon: "success",
              title: "Plantilla enviada",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error al enviar mensaje",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      });
    } else if (envio.channel_id === 2) {
      
      const { status } = await BmHttp().post("qr_mensaje_external", {
        sessionName: envio.nombreunico,
        numero: [envio.numero],
        mensaje: {
          type: "masivo",
          text: envio.mensaje,
          image: envio.imagen,
          video: envio.video,
        },
      });
      if (status === 200) {
        Swal.fire({
          icon: "success",
          title: "Mensaje enviado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al enviar mensaje",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const GuardarEnvio = async (e) => {
    e.preventDefault();
    let info = null;
    if (envio.channel_id === 4) {
      info = handleCustomPlantilla();
    } else {
      info = {};
    }

    if (envio.titulo === null || envio.titulo === "") {
      Swal.fire({
        icon: "error",
        title: "El titulo es obligatorio",
        showConfirmButton: false,
        timer: 1500,
      });
      return null;
    } else if (envio.fecha_envio === null || envio.fecha_envio === "") {
      Swal.fire({
        icon: "error",
        title: "La fecha de envio es obligatoria",
        showConfirmButton: false,
        timer: 1500,
      });
      return null;
    } else if (envio.mensaje === null || envio.mensaje === "") {
      Swal.fire({
        icon: "error",
        title: "El mensaje es obligatorio",
        showConfirmButton: false,
        timer: 1500,
      });
      return null;
    }

    if (envio.id !== 0) {
      try {
        const url = `masivo/${envio.id}`;
        const { status } = await BmHttp().put(url, envio);
        if (status === 200) {
          ListarMasivos();
          setShow(false);
          LimpiarEnvio();
          Swal.fire({
            icon: "success",
            title: "Masivo actualizado",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const url = `masivo`;
        const { status } = await BmHttp().post(url, { ...envio, plantilla: info });
        if (status === 200) {
          ListarMasivos();
          setShow(false);
          LimpiarEnvio();
          Swal.fire({
            icon: "success",
            title: "Masivo creado",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const ListarMasivos = async () => {
    const url = `masivo/${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await BmHttp().get(url);
    if (status === 200) {
      setMasivos(data.data);
    }
  };

  const EliminarMasivo = async (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `masivo/${id}`;
        const { data, status } = await BmHttp().delete(url);
        if (status === 200) {
          ListarMasivos();
        }
      }
    });
  };

  const SubirExcel = async (e) => {
    e.preventDefault();
    handleClose3();
    const url = `masivo/subir?cuenta_id=${excel.cuenta_id}&conexion=${excel.conexion}&masivosId=${excel.masivosId}`;
    const formData = new FormData();
    formData.append("file", excel.file);
    fetch(`${host()}${url}`, {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        handleClose3();
        Swal.fire({
          icon: "success",
          title: "Excel subido",
          showConfirmButton: false,
          timer: 1500,
        });
        handleClose2();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al subir el excel",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // descragr excel ejemplo
  const DescargarExcel = () => {
    let dataEjemplo = [
      {
        nombre: "Juan",
        telefono: "59334567890",
      },
    ];

    const headers = Object.keys(dataEjemplo[0]);
    const csv = [
      headers.join(","),
      ...dataEjemplo.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName])).join(",")
      ),
    ];
    const csvArray = csv.join("\r\n");
    const blob = new Blob([csvArray], { type: "text/xlsx" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "ejemplo.xlsx");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Limpiar después de la descarga
  };

  const DescargarExcelReporte = async (id) => {
    const url = `/masivo/exportar?masivosId=${id}&cuenta_id=${GetTokenDecoded().cuenta_id}`;
    const { data, status } = await BmHttp().get(url);
    if (status === 200) {
      const headers = Object.keys(data.data[0]);
      const csv = [
        headers.join(","),
        ...data.data.map((row) =>
          headers.map((fieldName) => JSON.stringify(row[fieldName])).join(",")
        ),
      ];
      const csvArray = csv.join("\r\n");
      const blob = new Blob([csvArray], { type: "text/xlsx" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "Reporte_de_envio.xlsx");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Limpiar después de la descarga
    }
  }

  const DetenerEnvio = async (id) => {
    const url = `masivo/detener/${id}`;
    const { data, status } = await BmHttp().put(url);
    if (status === 200) {
      Swal.fire({
        icon: "success",
        title: data.data,
        showConfirmButton: false,
        timer: 1500,
      });
      ListarMasivos();
    }
  }

  useEffect(() => {
    (async () => {
      await ListarBots();
      await ListarMasivos();
    })();
  }, []);

  const ComponenteMultimedia = (item) => {
    if (item.imagen) {
      return (
        <>
          <div className="row">
            <div className="col-12 box-info-text">
              <div className="d-flex" style={{gap: '10px'}}>
                <b>Formato: </b>
                <span>Imgen</span>
              </div>
            </div>

            <div className="col-12">
              <div className="mx-auto" style={{width: '250px', height: '250px', overflow: 'hidden'}}>
                <img key={item.id} src={item.imagen} alt="..." width={250} />
              </div>
            </div>
          </div>
        </>
      );
    } else if (item.video) {
      return (
        <>
          <div className="row">
            <div className="col-12 box-info-text">
              <div className="d-flex" style={{gap: '10px'}}>
                <b>Formato: </b>
                <span>Video</span>
              </div>
            </div>
            
            <div className="col-12 mx-auto text-center">
                <video key={item.id} width={250} controls>
                  <source src={item.video} type="video/mp4" />
                </video>
            </div>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Container fluid>
        <div className="d-flex justify-content-start mb-3">
          <button
            className="button-bm btn-dark active ml-2"
            onClick={handleClose}
          >
            Programar envio masivo
          </button>
        </div>

        <div className="w-full d-flex flex-column flex-md-row row">
          {masivos.map((item, index) => (
            <div
              className="col-12 col-md-6 d-flex flex-column mb-3"
              // style={{ width: '40%' }}
            >
              <div className="p-4 pt-3 pb-2 bg-white rounded shadow">
                <Card.Body>
                  <Row>
                    <div className="w-fit d-flex flex-column px-3 py-2">
                      <div className="row">
                        <div className="col-12 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Campaña:</b>
                            <span
                              style={{
                                fontSize: "1rem",
                                color: "#3F98F8",
                                fontWeight: "bold",
                              }}
                            >
                              {item.titulo}
                            </span>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Conexion: </b>
                            <span>{item.nombre_bot}</span>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Estado</b>
                            <span
                              style={{
                                color:
                                  item.estado === "enviado" ? "green" : "red",
                              }}
                            >
                              {item.estado}
                            </span>
                          </div>
                        </div>
                      </div>

                      <hr></hr>

                      <div className="row">
                        <div className="col-12 col-md-6 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Progreso:</b>
                            <span>{item.progreso}</span>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Total a enviar:</b>
                            <span>{item.total}</span>
                          </div>
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Fallos:</b>
                            <span>{item.total_fallos}</span>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 col-md-6 box-info-text">
                          <div className="d-flex" style={{ gap: "10px" }}>
                            <b>Enviado el: </b>
                            <span>
                              {moment(item.fecha_envio).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="col-12 col-md-6 box-info-text">
                          <b>Intervalo de envio:</b>
                          <span>{item.intervalo_entre}</span>
                        </div>
                      </div>

                      <div className="col-12 box-info-text">
                        <b>Retardo de envio entre mensajes: </b>
                        <span>{item.retardo_entre_msjs}</span>
                      </div>

                      {ComponenteMultimedia(item)}

                      <div className="col-12 box-info-text mt-3 d-flex flex-column">
                        <b>Mensaje: </b>
                        <b
                          style={{
                            fontSize: "1rem",
                            color: "#3F98F8",
                            fontWeight: "bold",
                            cursor: "pointer",
                            width: "auto",
                          }}
                        >
                          {item.mensaje.substring(0, 45)}...
                        </b>
                      </div>

                      <hr></hr>
                      <div
                        className="w-100 d-flex flex-row gap-3 justify-content-center flex-wrap 
                                            bot-card-buttons"
                      >
                        {item.contact_plantilla ? (
                          <button
                            className="bot-card-buttons-btn"
                            onClick={() => handleClose2(item)}
                            title="Subir excel de contactos"
                          >
                            <span className="material-symbols-outlined text-secondary">
                              upload_file
                            </span>
                          </button>
                        ) : null}

                        <button
                          className="bot-card-buttons-btn"
                          onClick={() => handleEditar(item)}
                          title="Editar programa de envio"
                        >
                          <span className="material-symbols-outlined text-secondary">
                            edit_square
                          </span>
                        </button>

                        <button
                          className="bot-card-buttons-btn"
                          onClick={() => EliminarMasivo(item.id)}
                          title="Eliminar programa de envio"
                        >
                          <span className="material-symbols-outlined text-secondary">
                            delete
                          </span>
                        </button>

                        {/* descargar reporde de envio */}
                        <button
                          className="bot-card-buttons-btn"
                          onClick={() => DescargarExcelReporte(item.id)}
                          title="Descargar reporte de envio"
                        >
                          <span className="material-symbols-outlined text-secondary">
                            download
                          </span>
                        </button>

                        {/* poner en stop el envio */}
                        <button
                          className="bot-card-buttons-btn"
                          title="Detener envio"
                          onClick={() => DetenerEnvio(item.id)}
                          disabled={item.estado === "finalizado" ? true : false}
                        >
                          <span className="material-symbols-outlined "
                            style={{
                              color: item.estado === "finalizado" ? "" : "red",
                            }}
                          >
                            stop_circle
                          </span>
                        </button>
                      </div>
                    </div>
                  </Row>
                </Card.Body>
              </div>
            </div>
          ))}
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header>
            {envio.id !== 0 ? (
              <Modal.Title>Editar envio</Modal.Title>
            ) : (
              <Modal.Title>Crear envio masivo</Modal.Title>
            )}
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handleClose}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="titulo">Titulo</label>
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  placeholder="titulo"
                  name="titulo"
                  value={envio.titulo}
                  onChange={handleEnvio}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nombreunico">Conexion</label>
                <select
                  className="form-control"
                  id="nombreunico"
                  name="nombreunico"
                  value={JSON.stringify(envio)}
                  onChange={handleSelect}
                >
                  <option value="">Seleccione una conexion</option>
                  {bots.map((item, index) => (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.nombre_bot}
                      </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-conten-center">
                <div className="form-group m-1 col-4 col-md-4 col-lg-4">
                  <label htmlFor="nombreunico">Intervalo de envio</label>
                  <input
                    type="number"
                    className="form-control"
                    id="intervalo_entre"
                    placeholder="intervalo_entre"
                    name="intervalo_entre"
                    value={envio.intervalo_entre}
                    onChange={handleEnvio}
                  />
                </div>

                {/* restartdo entre mensajes */}

                <div className="form-group m-1 col-4 col-md-4 col-lg-4">
                  <label htmlFor="nombreunico">Retardo</label>
                  <input
                    type="number"
                    className="form-control"
                    id="retardo_entre_msjs"
                    placeholder="retardo_entre_msjs"
                    name="retardo_entre_msjs"
                    value={envio.retardo_entre_msjs}
                    onChange={handleEnvio}
                  />
                </div>

                <div className="form-group m-1 col-3 col-md-4 col-lg-4">
                  <label htmlFor="fecha_envio">Fecha de envio</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="fecha_envio"
                    placeholder="Fecha de envio"
                    name="fecha_envio"
                    min={moment().format("YYYY-MM-DDTHH:mm")}
                    value={envio.fecha_envio}
                    onChange={handleEnvio}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  className="form-control"
                  id="mensaje"
                  rows={50}
                  cols={50}
                  style={{ height: "100px" }}
                  name="mensaje"
                  value={envio.mensaje}
                  onChange={(e)=>handleEnvio(e)}
                />
              </div>
              {envio.channel_id === 4 ? (
                <div className="form-group">
                  <label htmlFor="contact_plantilla" className="">
                    Contactos externos
                  </label>
                  <input
                    type="checkbox"
                    id="contact_plantilla"
                    className="m-1"
                    name="contact_plantilla"
                    checked={envio.contact_plantilla ? true : false}
                    value={envio.contact_plantilla}
                    onClick={(e) => handleEnvio(e)}
                  />
                </div>
              ) : null}
              {envio.channel_id !== 0 && envio.channel_id !== 2 ? (
                <div className="form-group">
                  <label htmlFor="todos_contactos" className="">
                    Seleccione Plantilla
                  </label>
                  <select
                    className="form-control"
                    id="plantilla"
                    name="plantilla_id"
                    value={envio.plantilla_id}
                    onChange={handleEnvio}
                  >
                    <option value="">Seleccione una plantilla</option>
                    {listPlantillas.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {envio.channel_id !== 0 && envio.channel_id !== 2 ? (
                <>
                  <div className="form-group">
                    {catidadVariables.header.length !== 0 ? (
                      <>
                        <label htmlFor="parametros">Parametros Header</label>
                        {catidadVariables.header.map((item, i) => (
                          <input
                            key={i}
                            type="text"
                            className="form-control"
                            id="parametros"
                            placeholder={`${item}`}
                            name={`header_${item}`}
                            onChange={handleVariables}
                          />
                        ))}
                      </>
                    ) : null}
                  </div>
                  <div className="form-group">
                    {catidadVariables.body.length !== 0 ? (
                      <>
                        <label htmlFor="parametros">Parametros Body</label>
                        {catidadVariables.body.map((item, i) => (
                          <input
                            key={i}
                            type="text"
                            className="form-control m-1"
                            id="parametros"
                            placeholder={`${item}`}
                            name={`body_${item}`}
                            onChange={handleVariables}
                          />
                        ))}
                      </>
                    ) : null}
                  </div>
                  <div className="form-group">
                    {catidadVariables.footer.length !== 0 ? (
                      <>
                        <label htmlFor="parametros">Parametros Footer</label>
                        {catidadVariables.footer.map((item, i) => (
                          <input
                            key={i}
                            type="text"
                            className="form-control"
                            id="parametros"
                            placeholder={`${item}`}
                            name={`footer_${item}`}
                            onChange={handleVariables}
                          />
                        ))}
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {/* checkout para saver si envia imagen o video */}
              <div className="form-group">
                <label htmlFor="type">Tipo de multimedia</label>
                <div className="d-flex">
                  <div className="">
                    <label htmlFor="imagen">Imagen</label>
                    <input
                      type="checkbox"
                      id="imagen"
                      name="imagen"
                      checked={envio.type === "imagen" ? true : false}
                      value="imagen"
                      onChange={handleType}
                    />
                  </div>
                  <div className="px-3">
                    <label htmlFor="video">Video</label>
                    <input
                      type="checkbox"
                      id="video"
                      name="video"
                      checked={envio.type === "video" ? true : false}
                      value="video"
                      onChange={handleType}
                    />
                  </div>
                </div>
              </div>
              {envio.type ? (
                <div className="form-group">
                  <label htmlFor="attachment">
                    {envio.type === "imagen" ? "Imagen" : "Video"}
                  </label>
                  <input
                    className="form-control"
                    id={envio.type === "imagen" ? "imagen" : "video"}
                    placeholder="imagen"
                    type="file"
                    accept={envio.type === "imagen" ? "image/*" : "video/*"}
                    name={envio.type === "imagen" ? "imagen" : "video"}
                    onChange={(e) => CargarAvatar(e.target.files[0])}
                  />
                  {progresoFile !== 0 ? (
                    <p className="text-center mt-1">{progresoFile}%</p>
                  ) : null}
                  {progresoFile !== 0 ? (
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        aria-valuenow={progresoFile}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: `${progresoFile}%` }}
                      ></div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {
                <div className="form-group">
                  <label htmlFor="parametros">Numero de prueba</label>
                  <input
                    className="form-control"
                    id="numero"
                    name="numero"
                    value={envio.numero}
                    onChange={handleEnvio}
                  />
                </div>
              }

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="button-bm btn-dark w-100 mt-4"
                  onClick={(e) => GuardarEnvio(e)}
                >
                  {envio.id !== 0 ? "Actualizar masivo" : "Registrar masivo"}
                </button>
                {
                  <button
                    className="button-bm btn-dark w-100 mt-4"
                    onClick={(e) => EnvioPrueba(e)}
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
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>Envio de plantilla</Modal.Title>
            <button
              type="button"
              className="btn-dark mr-2 w-10"
              onClick={handleClose2}
            >
              <i className="fa fa-times"></i>
            </button>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <div className="d-flex justify-content-between">
                  <label htmlFor="numero">Excel</label>
                  <a role="button" onClick={DescargarExcel}>
                    Descarge el excel ejemplo
                  </a>
                </div>
                <input
                  type="file"
                  className="form-control"
                  id="excel"
                  placeholder="excel"
                  name="excel"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) =>
                    setExcel({ ...excel, file: e.target.files[0] })
                  }
                />
              </div>

                {
                  show3 ?
                  <>
                    <div className="d-flex justify-content-center text-center mt-3">
                      <Spinner animation="border" role="status" className="spinner-border text-primary">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    </div> 
                    <div className="d-flex justify-content-center text-center mt-3">
                      <p>Subiendo archivo...</p>
                    </div>
                  </>
                  : null
                }

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="button-bm btn-dark w-100 mt-4"
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
