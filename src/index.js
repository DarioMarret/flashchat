import * as React from "react";
import * as ReactDOM from "react-dom/client";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/demo.css";
import "assets/scss/light-bootstrap-dashboard-pro-react.scss?v=2.0.0";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// reportWebVitals();
