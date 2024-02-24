import Dashboard from "views/Dashboard.js";
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
import LoginPage from "views/Pages/LoginPage";
import Mensajeria from "views/Pages/Mensajeria";
import Suscripciones from "views/Pages/Suscripcion/Suscripcion";

var routes = [
    {
      path: "/panel",
      layout: "/admin",
      name: "Panel",
      icon: "nc-icon nc-chart-pie-35",
      component: Dashboard
    },
    {
      path: "/cuenta",
      layout: "/admin",
      name: "Cuenta",
      icon: "nc-icon nc-single-02",
      component: Suscripciones
    },
    {
      path: "/mensajeria",
      layout: "/admin",
      name: "Mensajeria",
      icon: "nc-icon nc-chat-round",
      component: Mensajeria
    },
    {
      path: "/contactos",
      layout: "/admin",
      name: "Contactos",
      icon: "nc-icon nc-single-02",
      component: Contactos
    },
    {
      collapse: true,
      path: "/configuracion",
      name: "Configuracion",
      state: "openMaps",
      icon: "nc-icon nc-settings-gear-64",
      views: [
        {
          path: "/equipos",
          layout: "/admin",
          name: "Equipos",
          mini: "EQ",
          component: Equipos
        },
        {
          path: "/agentes",
          layout: "/admin",
          name: "Agentes",
          mini: "AG",
          component: Agentes
        },
        {
          path: "/etiquetas",
          layout: "/admin",
          name: "Etiquetas",
          mini: "ET",
          component: Etiquetas
        },
        {
          path: "/horarios-atencion",
          layout: "/admin",
          name: "Horarios de Atencion",
          mini: "HA",
          component: HorarioAtencion
        },
        {
          path: "/mensajes-automaticos",
          layout: "/admin",
          name: "Mensajes automaticos",
          mini: "MA",
          component: MensajesAutomaticos
        },
        {
          path: "/inactividad",
          layout: "/admin",
          name: "Inactividad",
          mini: "IN",
          component: Inactividad
        },
        {
          path: "/masivos",
          layout: "/admin",
          name: "Masivos",
          mini: "MS",
          component: Masivos
        },
        {
          path: "/ocr",
          layout: "/admin",
          name: "Ocr Comprobantes",
          mini: "OC",
          component: ComprobantesOcr
        }
      ]
    },
    {
      path: "/bots",
      layout: "/admin",
      name: "Bots",
      icon: "nc-icon nc-android",
      component: ChatBots
    },
    {
      path: "/login-page",
      layout: "/auth",
      name: "Login Page",
      mini: "LP",
      component: LoginPage
    },
    {
      path: "/suscripciones",
      layout: "/admin",
      name: "Suscripciones",
      icon: "nc-icon nc-money-coins",
      component: Suscripciones
    },
    //   {
    //   path: "/sweet-alert",
    //   layout: "/admin",
    //   name: "Sweet Alert",
    //   mini: "SA",
    //   component: SweetAlertPage
    // },
    // {
    //   collapse: true,
    //   path: "/components",
    //   name: "Components",
    //   state: "openComponents",
    //   icon: "nc-icon nc-app",
    //   views: [
    //     {
    //       path: "/buttons",
    //       layout: "/admin",
    //       name: "Buttons",
    //       mini: "B",
    //       component: Buttons
    //     },
    //     {
    //       path: "/grid-system",
    //       layout: "/admin",
    //       name: "Grid System",
    //       mini: "GS",
    //       component: GridSystem
    //     },
    //     {
    //       path: "/panels",
    //       layout: "/admin",
    //       name: "Panels",
    //       mini: "P",
    //       component: Panels
    //     },
    //     {
    //       path: "/sweet-alert",
    //       layout: "/admin",
    //       name: "Sweet Alert",
    //       mini: "SA",
    //       component: SweetAlert
    //     },
    //     {
    //       path: "/notifications",
    //       layout: "/admin",
    //       name: "Notifications",
    //       mini: "N",
    //       component: Notifications
    //     },
    //     {
    //       path: "/icons",
    //       layout: "/admin",
    //       name: "Icons",
    //       mini: "I",
    //       component: Icons
    //     },
    //     {
    //       path: "/typography",
    //       layout: "/admin",
    //       name: "Typography",
    //       mini: "T",
    //       component: Typography
    //     }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/forms",
    //   name: "Forms",
    //   state: "openForms",
    //   icon: "nc-icon nc-notes",
    //   views: [
    //     {
    //       path: "/regular-forms",
    //       layout: "/admin",
    //       name: "Regular Forms",
    //       mini: "RF",
    //       component: RegularForms
    //     },
    //     {
    //       path: "/extended-forms",
    //       layout: "/admin",
    //       name: "Extended Forms",
    //       mini: "EF",
    //       component: ExtendedForms
    //     },
    //     {
    //       path: "/validation-forms",
    //       layout: "/admin",
    //       name: "Validation Forms",
    //       mini: "VF",
    //       component: ValidationForms
    //     },
    //     {
    //       path: "/wizard",
    //       layout: "/admin",
    //       name: "Wizard",
    //       mini: "W",
    //       component: Wizard
    //     }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/tables",
    //   name: "Tables",
    //   state: "openTables",
    //   icon: "nc-icon nc-paper-2",
    //   views: [
    //     {
    //       path: "/regular-tables",
    //       layout: "/admin",
    //       name: "Regular Tables",
    //       mini: "RT",
    //       component: RegularTables
    //     },
    //     {
    //       path: "/extended-tables",
    //       layout: "/admin",
    //       name: "Extended Tables",
    //       mini: "ET",
    //       component: ExtendedTables
    //     },
    //     {
    //       path: "/react-table",
    //       layout: "/admin",
    //       name: "React Table",
    //       mini: "RT",
    //       component: ReactTables
    //     }
    //   ]
    // },
    // {
    //   collapse: true,
    //   path: "/maps",
    //   name: "Maps",
    //   state: "openMaps",
    //   icon: "nc-icon nc-pin-3",
    //   views: [
    //     {
    //       path: "/google-maps",
    //       layout: "/admin",
    //       name: "Google Maps",
    //       mini: "GM",
    //       component: GoogleMaps
    //     },
    //     {
    //       path: "/full-screen-maps",
    //       layout: "/admin",
    //       name: "Full Screen Map",
    //       mini: "FSM",
    //       component: FullScreenMap
    //     },
    //     {
    //       path: "/vector-maps",
    //       layout: "/admin",
    //       name: "Vector Map",
    //       mini: "VM",
    //       component: VectorMap
    //     }
    //   ]
    // },
    // {
    //   path: "/charts",
    //   layout: "/admin",
    //   name: "Charts",
    //   icon: "nc-icon nc-chart-bar-32",
    //   component: Charts
    // },
    // bots
  
    // {
    //   path: "/calendar",
    //   layout: "/admin",
    //   name: "Calendar",
    //   icon: "nc-icon nc-single-copy-04",
    //   component: Calendar
    // },
    // {
    //   collapse: true,
    //   path: "/pages",
    //   name: "Pages",
    //   state: "openPages",
    //   icon: "nc-icon nc-puzzle-10",
    //   views: [
    //     {
    //       path: "/user-page",
    //       layout: "/admin",
    //       name: "User Page",
    //       mini: "UP",
    //       component: UserPage
    //     },
    //     {
    //       path: "/login-page",
    //       layout: "/auth",
    //       name: "Login Page",
    //       mini: "LP",
    //       component: LoginPage
    //     },
    //     {
    //       path: "/register-page",
    //       layout: "/auth",
    //       name: "Register",
    //       mini: "RP",
    //       component: RegisterPage
    //     },
    //     {
    //       path: "/lock-screen-page",
    //       layout: "/auth",
    //       name: "Lock Screen Page",
    //       mini: "LSP",
    //       component: LockScreenPage
    //     }
    //   ]
    // }

  ];

export default routes;
