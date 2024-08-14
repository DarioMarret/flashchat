import logo from "assets/img/logo512.png";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// react-bootstrap components
import { GetCountRecordatorio, GetTokenDecoded, SetCountRecordatorio } from "function/storeUsuario";
import { colorPrimario } from "function/util/global";
import useAuth from "hook/useAuth";
import {
  Collapse,
  Nav
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import FlashChat from "views/Components/FlashChat/FlashChat";
import Paginas from "views/Pages/Paginas/Paginas";
import { ControllerListarPaginas } from "views/Pages/Paginas/Services.pagina";
import socket from "views/SocketIO";
import { addAgente } from "../../redux/Agentes/agente.servicio";

function Sidebar({ routes, image, background, setMensajeBanner }) {
  const { logout } = useAuth();
  const dispatch = useDispatch();
  // to check for active links and opened collapses
  let location = useLocation();
  // const navigate = useNavigate();
  // this is for the user collapse
  const [userCollapseState, setUserCollapseState] = React.useState(false);
  const [paginasTab, setPaginasTab] = React.useState([]);
  const [recor, setRecor] = React.useState(null);
  const tokenDecoded = useRef(GetTokenDecoded());
  // this is for the rest of the collapses

  useEffect(() => {
    (async () => {
      if (tokenDecoded.current && tokenDecoded.current.cuenta_id) {
        const { data, status } = await ControllerListarPaginas();
        if (status === 200) {
          routes.forEach((route) => {
            if (route.path === "/pages") {
              const newViews = data.data.filter(pagina => 
                !route.views.some(r => r.name === pagina.nombre)
              ).map(pagina => ({
                path: "/pagina/" + pagina.id,
                name: pagina.nombre,
                layout: "/admin",
                mini: pagina.nombre.charAt(0) + pagina.nombre.charAt(1),
                component: Paginas
              }));
              if (newViews.length > 0) {
                route.views.push(...newViews);
              }
            }
          });
        }
      }
    })();
  }, [tokenDecoded.current]); // Dependencia opcional basada en si tokenDecoded puede cambiar
  

  useEffect(() => {
    if (tokenDecoded.current && tokenDecoded.current.cuenta_id) {
      const cuentaId = tokenDecoded.current.cuenta_id;
      const userId = tokenDecoded.current.id;
      socket.on(`banner_${cuentaId}`, (data) => {
        const { mensaje, cuenta_id } = data;
        if (tokenDecoded.current && cuenta_id === tokenDecoded.current.cuenta_id) {
          setMensajeBanner({
            mensaje: mensaje,
            color: data.color,
            btnColor: data.btnColor,
            tipo: data.tipo,
            cuenta_id: cuenta_id,
            tiempo: data.tiempo
          });
        }
      });

      socket.on(`infoUsuario_${cuentaId}_${userId}`, (msg) => {
        try {
          const { type, data, agente_id, cuenta_id, estado } = msg;
          if (type === "recargarToken" && agente_id === userId && data !== null) {
            logout();
          } else if (type === "status" && agente_id === userId && cuenta_id === cuentaId) {
            socket.emit('infoUsuario', { type: "online", agente_id, cuenta_id, estado });
            dispatch(addAgente());
          } else if (type === "mensaje_personalizado" && agente_id === userId && cuenta_id === cuentaId) {
            Swal.fire({
              title: 'Mensaje personalizado',
              text: data.mensaje,
              icon: data.tipo,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3F98F8',
            });
          } else if (type === "recordatorio" && agente_id === userId && cuenta_id === cuentaId) {
            SetCountRecordatorio(data);
            setRecor(data);
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    
    // Cleanup function to avoid memory leaks
    return () => {
      socket.off(`banner_${tokenDecoded.current.cuenta_id}`);
      socket.off(`infoUsuario_${tokenDecoded.current.cuenta_id}_${tokenDecoded.current.id}`);
    };
  }, [socket]);

  const [state, setState] = React.useState({});
  React.useEffect(() => {
    setState(getCollapseStates(routes));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);
  // this creates the intial state of this component based on the collapse routes
  // that it gets through routes prop
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const ViewAdmin = ['/configuracion', '/bots','/dashboard', '/cuenta','/suscripciones', '/factura', '/historial', '/logs']
  const createLinks = (routes) => {
    // anadir las nuevas paginas en dentro del path pages y que no se muestren en el sidebar sin quitar el que esta en views

    return routes.map((prop, key) => {
      if (ViewAdmin.includes(prop.path) && GetTokenDecoded().perfil !== "Administrador") {
        return null;
      }
      if (prop.redirect) {
        return null;
      }
      // si layout es auth, no se muestra en el sidebar
      if (prop.layout === "/auth") {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <Nav.Item
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            as="li"
            key={key}
          >
            <Nav.Link
              className={state[prop.state] ? "collapsed" : ""}
              data-toggle="collapse"
              onClick={(e) => {
                e.preventDefault();
                setState({ ...state, ...st });
              }}
              aria-expanded={state[prop.state]}
            >
              <i className={prop.icon}></i>
              <p>
                {prop.name} <b className="caret"></b>
              </p>
            </Nav.Link>
            <Collapse in={state[prop.state]}>
              <div>
                <Nav as="ul">{createLinks(prop.views)}</Nav>
              </div>
            </Collapse>
          </Nav.Item>
        );
      }
      return (
        <Nav.Item
          className={activeRoute(prop.layout + prop.path)}
          key={key}
          as="li"
        >
          <Link to={prop.layout + prop.path} 
          className={`nav-link ${activeRoute(prop.layout + prop.path)}`}>
            {prop.icon ? (
              <>
              <div className="icon">
                <i className={prop.icon} />
                <p>{prop.name}</p>
                {/* poner un icono de notificacion que esten end de fondo rojo */}
                <div className="notification" style={{
                  display: prop.path === "/recordatorios" ? "flex" : "none",
                  justifyContent: "end",
                  zIndex: 1000,
                  position: "absolute",
                  left: "7%",
                  marginTop: "-7%",
                                    
                }}>
                  <span className="badge badge-danger"
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                  >{GetCountRecordatorio() || recor}</span>
                </div>


              </div>
                
              </>
            ) : (
              <>
                <span className="sidebar-mini">{prop.mini}</span>
                <span className="sidebar-normal">{prop.name}</span>
              </>
            )}
          </Link>
        </Nav.Item>
      );
    });
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  }


  return (
    <>
      <div 
        className="sidebar"
      // data-color={background}
        // data-image={image}
        style={{ backgroundColor: colorPrimario }}
        >
        <div className="sidebar-wrapper">
          <div className="logo">
            <a
              className="simple-text logo-mini"
              href="https://flashchat.chat"
            >
              <div className="logo-img">
                <img
                  src={logo}
                  className="img-fluid rounded-circle "
                  alt="logo"
                  style={{
                    top: "-5%",
                  }}
                />
              </div>
            </a>
            <a
              className="simple-text logo-normal"
              href="#;"
              style={{
                textDecoration: "none",
                marginRight: "20px",
              }}
            >
              <FlashChat />
            </a>
          </div>
          <div className="user">
            <div className="photo">
              <img alt="..." src={
                GetTokenDecoded() && GetTokenDecoded().avatar
                } />
            </div>
            <div className="info">
              <a
                className={userCollapseState ? "collapsed" : ""}
                data-toggle="collapse"
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  setUserCollapseState(!userCollapseState);
                }}
                aria-expanded={userCollapseState}
              >
                <span>
                    {GetTokenDecoded() && GetTokenDecoded().nombre}
                   <b className="caret"></b>
                </span>
              </a>
              <Collapse id="collapseExample" in={userCollapseState}>
                <div>
                  <Nav as="ul">
                    <li>
                      <a
                        className="profile-dropdown"
                        href="/admin/perfil"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = "/admin/perfil";
                        }}
                      >
                        <span className="sidebar-mini">MP</span>
                        <span className="sidebar-normal">MI PERFIL</span>
                      </a>
                    </li>
                    {/* <li>
                      <a
                        className="profile-dropdown"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="sidebar-mini">EP</span>
                        <span className="sidebar-normal">Edit Profile</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="profile-dropdown"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="sidebar-mini">S</span>
                        <span className="sidebar-normal">Settings</span>
                      </a>
                    </li> */}
                  </Nav>
                </div>
              </Collapse>
            </div>
          </div>
          <Nav as="ul">{createLinks(routes)}</Nav>
        </div>
        {/* <div
          className="sidebar-background"
          style={{
            backgroundImage: "url('" + image + "')"
          }}
        ></div> */}
      </div>
    </>
  );
}

let linkPropTypes = {
  path: PropTypes.string,
  layout: PropTypes.string,
  name: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
};

Sidebar.defaultProps = {
  image: "",
  background: "black",
  routes: []
};

Sidebar.propTypes = {
  image: PropTypes.string,
  background: PropTypes.oneOf([
    "black",
    "azure",
    "green",
    "orange",
    "red",
    "purple"
  ]),
  routes: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        ...linkPropTypes,
        icon: PropTypes.string
      }),
      PropTypes.shape({
        collapse: true,
        path: PropTypes.string,
        name: PropTypes.string,
        state: PropTypes.string,
        icon: PropTypes.string,
        views: PropTypes.shape({
          ...linkPropTypes,
          mini: PropTypes.string
        })
      })
    ])
  )
};

export default Sidebar;
