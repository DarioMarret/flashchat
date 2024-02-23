// import AdminFooter from "components/Footers/AdminFooter";
import AdminNavbar from "components/Navbars/AdminNavbar";

import Sidebar from "components/Sidebar/Sidebar";
import AuthContext from "context/AuthContext";
import { GetToken, removeDatosUsuario } from "function/storeUsuario";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import routes from "routes";

import image3 from "assets/img/full-screen-image-3.jpg";
import { RemoverConversacion } from "function/storeUsuario";
import Dashboard from "views/Dashboard";
import ChatBots from "views/Pages/ChatBots";
import Agentes from "views/Pages/Configuracion/Agentes";
import ComprobantesOcr from "views/Pages/Configuracion/ComprobantesOcr";
import Equipos from "views/Pages/Configuracion/Equipos";
import Etiquetas from "views/Pages/Configuracion/Etiquetas";
import HorarioAtencion from "views/Pages/Configuracion/HorarioAtencion";
import Inactividad from "views/Pages/Configuracion/Inactividad";
import Masivos from "views/Pages/Configuracion/Masivos";
import MensajesAutomaticos from "views/Pages/Configuracion/MensajesAutomaticos";
import Contactos from "views/Pages/Contactos";
import Mensajeria from "views/Pages/Mensajeria";
import Auths from "views/Pages/auth/Auths";

import "./assets/css/style.css";

export default function App() {
  const [auth, setAuth] = useState(undefined);
  const [ReloadUser, setReloadUser] = useState(false);
  const [sidebarImage, setSidebarImage] = React.useState(image3);
  const [sidebarBackground, setSidebarBackground] = React.useState("black");

  useEffect(() => {
    (() => {
      const user = GetToken();
      if (user != null) {
        setAuth(user);
      } else {
        setAuth(null);
      }
      setReloadUser(false);
    })();
  }, [ReloadUser]);

  const login = (user) => {
    setAuth(user);
    // volver a recargar las rutas
    setReloadUser(true);
  }

  const logout = () => {
    removeDatosUsuario();
    RemoverConversacion();
    setAuth(null);
    setReloadUser(true);
    window.location.href = "/";
  }

  const authData = useMemo(
    () => ({
      auth,
      login,
      logout,
      setReloadUser,
    }),
    [auth]
  )

  if (auth === undefined) return null;
  return (
    <AuthContext.Provider value={authData}>
      <Router>
        {!auth ? (
            <>
              <div className="wrapper wrapper-full-page">
                <Auths />
              </div>
            </>
        ) : (
          <>
            <div className="wrapper">
              <Sidebar routes={routes} image={sidebarImage} 
                // background={colorPrimario}
                background={sidebarBackground}
              />
              <div className="main-panel">
                <AdminNavbar />
                <div className="content"
                style={{ overflow: 'auto'}}>
                  <Routes
                    basename="/"
                    forceRefresh={true}
                    initialEntries={["/admin/dashboard"]}
                  >
                    <Route
                      path="/admin/dashboard"
                      element={<Dashboard />}
                      exact
                    />
                    <Route path="/*" element={<Navigate to="admin/dashboard" replace />} />
                    <Route
                      path="/admin/mensajeria"
                      element={<Mensajeria />}
                      exact
                    />
                    <Route
                      path="/admin/contactos"
                      element={<Contactos />}
                      exact
                    />
                    <Route path="/admin/equipos" element={<Equipos />} exact />
                    <Route path="/admin/agentes" element={<Agentes />} exact />
                    <Route
                      path="/admin/etiquetas"
                      element={<Etiquetas exact />}
                    />
                    <Route
                      path="/admin/horarios-atencion"
                      element={<HorarioAtencion />}
                      exact
                    />
                    <Route path="/admin/equipos" element={<Equipos />} exact />
                    <Route
                      path="/admin/mensajes-automaticos"
                      element={<MensajesAutomaticos />}
                      exact
                    />
                    <Route
                      path="/admin/inactividad"
                      element={<Inactividad />}
                      exact
                    />
                    <Route path="/admin/masivos" element={<Masivos />} exact />
                    <Route
                      path="/admin/ocr"
                      element={<ComprobantesOcr />}
                      exact
                    />
                    <Route path="/admin/bots" element={<ChatBots />} exact />
                    {/* <Route path="/admin/sweet-alert" element={<SweetAlertPage />} exact /> */}

                  </Routes>
                </div>
                {/* <AdminFooter /> */}
                <div
                  className="close-layer"
                  onClick={() =>
                    document.documentElement.classList.toggle("nav-open")
                  }
                />
              </div>
            </div>
            {/* <FixedPlugin
              setSidebarImageParent={(value) => setSidebarImage(value)}
              sidebarDefaultImage={sidebarImage}
              sidebarImages={[image1, image2, image3, image4]}
              backgroundColors={[
                "black",
                "azure",
                "green",
                "orange",
                "red",
                "purple",
              ]}
              backgroundColor={sidebarBackground}
              setSidebarBackgroundParent={(value) =>
                setSidebarBackground(value)
              }
            /> */}
          </>

        )}
      </Router>
    </AuthContext.Provider>
  );
}
