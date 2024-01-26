// react-bootstrap components

import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import AuthFooter from "components/Footers/AuthFooter.js";
import AuthNavbar from "components/Navbars/AuthNavbar.js";

// dinamically create auth routes
import React from "react";
import LoginPage from "views/Pages/LoginPage";

function Auth() {
  const [path, setPath] = React.useState(window.location.pathname);


  React.useEffect(() => {
    const updatePath = () => {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, [path]);

  const getComponente = () => {
    switch (path) {
      case "/auth/login-page":
        return <LoginPage />;
      case "/auth/register-page":
        return <></>;
      case "/auth":
        return <></>;
      default:
        return <></>;
    }
  }


  return (
    <>
      <div className="wrapper wrapper-full-page">
        {/* Navbar */}
        {/* <AuthNavbar /> */}
        {/* End Navbar */}
        {
          getComponente()
        }
        <AuthFooter />
      </div>
      <FixedPlugin />
    </>
  );
}

export default Auth;
