import "assets/css/landing.css";
import checkIcon from "assets/icons/check-icon.flaschant.png";
import facebookIcon from "assets/icons/facebook-icon-flaschat.png";
import houseIcon from "assets/icons/house-icon-flaschat.png";
import instagramIcon from "assets/icons/instagram-icon-flaschat.png";
import xIcon from "assets/icons/x-icons-flaschat.png";
import bgFirstSection from "assets/img/bg-landing-section-first.svg";
import bgLastSection from "assets/img/bg-landing-section-last.svg";
import botFlaschat from "assets/img/flachat-bot.png";
import logo from "assets/img/Flaschat-horizontal.png";
import lifeDigitalImg from "assets/img/life-digital.png";
import users from "assets/img/users-flaschat.png";

export default function LandingPage() {
  const year = new Date().getFullYear();
  const apiLinkWhatsapp = 'https://wa.me/593999070572?text=👋%20Hola%2C%20estoy%20interesado%20en%20conocer%20m%C3%A1s%20sobre%20la%20plataforma%20FlashChat';

  return (
    <div className="box-landing">
      {/* Menu de navegación */}
      <nav className="navbar border-0 navbar-expand-lg px-2 px-md-5 bg-white flash-navbar">
        <div className="container-fluid">
          <a class="navbar-brand" href="#">
            <img src={logo} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end bg-white"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active flash-text-primary"
                  aria-current="page"
                  href="#"
                >
                  <img src={houseIcon} style={{ marginRight: "5px" }} />
                  Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Servicios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Contáctanos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Registro</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Primera seccion */}
      <div className="w-100 flash-first-section">
        <img
          src={bgFirstSection}
          alt="First section"
          className="position-absolute w-100 flash-first-section-img-landing"
        />
        <img
          src={botFlaschat}
          alt="bot flaschat"
          className="position-absolute bot-flaschat"
        />

        <div className="px-2 px-md-5 position-relative flash-first-section-info text-center text-md-start">
          <div>
            <h2 className="flash-text-white title-first-section">
              Transforma la experiencia de
            </h2>
            <h2 className="flash-text-white title-first-section">
              servicio al cliente con nuestros
            </h2>
            <h2 className="flash-text-white title-first-section">
              chatbots inteligentes.
            </h2>
          </div>
        </div>

        <div className="px-2 px-md-5 position-relative flash-first-section-text d-flex gap-2 flex-column flex-sm-row text-center text-md-start justify-content-center justify-content-md-start">
          <p className="flash-text-white">
            + 2000 usuarios con nuestros chatbots.
          </p>
          <img
            src={users}
            alt="Icon users"
            width="150px"
            className="mx-auto mx-lg-0"
          />
        </div>

        <div className="px-2 px-md-5 position-relative flash-first-section-description text-center text-md-start">
          <p>
            Diseñado para proporcionar respuestas instantáneas, personalizadas y
            eficientes, optimizando tu comunicación y elevando la satisfacción
            del usuario a un nuevo nivel.
          </p>
        </div>

        <div className="d-flex gap-3 px-2 px-md-5 mt-5 flash-btn-group justify-content-center justify-content-md-start flash-text-decoration-none">
          <a className="text-white flash-bg-secondary px-3 py-2 flash-btn-secondary flash-text-decoration-none"
          href={apiLinkWhatsapp} target="_blank" >
            Quiero mi demostración
          </a>

          {/* <button className="text-white flash-bg-secondary px-3 py-2 flash-btn-secondary">
            Ver planes
          </button> */}
        </div>
      </div>

      {/* Segunda seccion */}

      {/* Tercera seccion */}
      <div className="bg-white w-100 flash-third-section">
        <div className="px-2 px-md-5 mt-5">
          <div className="flash-third-section-title d-flex justify-content-center align-items-center position-relative">
            <h2 className="flash-text-primary text-center">
              Lleva tu comunicación al siguiente nivel
            </h2>
          </div>

          <div className="flash-text-third-section-services flash-mt-80 flash-gap-6">
            <section className="flash-service-box position-relative">
              <span className="flash-service-box-circle position-absolute d-flex justify-content-center align-items-center text-white">
                1
              </span>
              <div className="d-flex flex-column gap-3 flash-service-box-body p-5 px-md-3 justify-content-center align-items-center">
                <h4 className="flash-text-primary fw-bold text-center mt-2">
                  Respuestas instantáneas
                </h4>
                <p className="flash-text-marron">
                  Proporcionamos respuestas en tiempo real y mejoran la
                  sastifacción del cliente reducionedo tiempos de espera.
                </p>
              </div>
            </section>

            <section className="flash-service-box position-relative">
              <span className="flash-service-box-circle position-absolute d-flex justify-content-center align-items-center text-white">
                2
              </span>
              <div className="d-flex flex-column gap-3 flash-service-box-body p-5 px-md-3 justify-content-center align-items-center">
                <h4 className="flash-text-primary fw-bold text-center mt-2">
                  Disponibilidad 24/7
                </h4>
                <p className="flash-text-marron">
                  Aseguramos que tus clientes siempren tenga acceso a la
                  información que necesitan, sin importar la hora.
                </p>
              </div>
            </section>

            <section className="flash-service-box position-relative">
              <span className="flash-service-box-circle position-absolute d-flex justify-content-center align-items-center text-white">
                3
              </span>
              <div className="d-flex flex-column gap-3 flash-service-box-body p-5 px-md-3 justify-content-center align-items-center">
                <h4 className="flash-text-primary fw-bold text-center mt-2">
                  Personalización avanzada
                </h4>
                <p className="flash-text-marron">
                  Diseñamos interacciones a medida, adaptando el chatbot a la
                  necesidades específicas de tu negocio y tus clientes.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Cuarta seccion */}
      <div className="bg-white w-100 flash-fouth-section">
        <div className="px-2 px-md-5 flash-mt-80 position-relative">
          <div className="flash-circle-rigth position-absolute d-none d-lg-block">
            <span className="d-block"></span>
          </div>

          <h2 className="flash-text-primary fw-bold mb-5 text-center text-md-start">
            Adéntrate en el mundo de flaschat
          </h2>

          <div className="flash-list d-flex flex-column gap-3">
            <div className="d-flex gap-2 justify-content-start align-items-center flash-list-detail">
              <img src={checkIcon} alt="Check Icon" width="45px" />
              <p className="flash-text-marron mt-2">
                Transformamos la manera en que las empresas se comunican en sus
                clientes.
              </p>
            </div>

            <div className="d-flex gap-2 justify-content-start align-items-center flash-list-detail">
              <img src={checkIcon} alt="Check Icon" width="45px" />
              <p className="flash-text-marron mt-2">
                Nos especializamos en ofrecer soluciones chatbots de
                personalizados que optimizan la atención al cliente.
              </p>
            </div>

            <div className="d-flex gap-2 justify-content-start align-items-center flash-list-detail">
              <img src={checkIcon} alt="Check Icon" width="45px" />
              <p className="flash-text-marron mt-2">
                Nuestros chatbots avanzados están diseñados para revolucionar la
                forma que interactúas con tus clientes.
              </p>
            </div>
          </div>

          <div className="my-5 text-center text-md-start">
            <a
              className="text-white flash-bg-secondary p-2 p-md-3 flash-btn-secondary"
              style={{ width: "250px", fontSize: "20px", textDecoration: 'none' }}
              href={apiLinkWhatsapp}
              target="_blank"
            >
              Haz click aquí
            </a>
          </div>

          <div className="w-100 position-relative flash-fouth-section-img">
            <img
              src={lifeDigitalImg}
              alt="Life digital"
              width="400px"
              className=""
            />

            <p className="flash-text-primary flash-fouth-section-img-text-leads text-center text-lg-start py-3">
              ¡Comineza hoy!
            </p>

            <div className="flash-circle-left position-absolute d-none d-lg-block">
              <span className="d-block"></span>
            </div>
          </div>
        </div>

        <div className="w-100 flash-fouth-section-svg">
          <img
            src={bgLastSection}
            alt="Landing last section bg"
            className="w-100"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-100">
        <div className="d-flex flex-column gap-3 container-fluid my-3 flex-lg-row justify-content-lg-between align-items-center">
          <div className="text-center text-lg-start">
            <a href="#">
              <img src={logo} alt="logo" />
            </a>
          </div>

          <div className="d-flex flex-column justify-content-center text-center flex-lg-row gap-2">
            <span className="d-block flash-text-primary">
              © {year} FlashChat
            </span>
            <span className="d-block flash-text-primary d-none d-lg-block">
              |
            </span>
            <a
              href="#"
              className="flash-cursor-pointer flash-text-primary"
              style={{ textDecoration: "none" }}
            >
              Política de privacidad
            </a>
            <span className="d-block flash-text-primary d-none d-lg-block">
              |
            </span>
            <a
              href="#"
              className="flash-cursor-pointer flash-text-primary"
              style={{ textDecoration: "none" }}
            >
              Términos y condiciones
            </a>
          </div>

          <div className="d-flex gap-3 text-center w-auto justify-content-center">
            <a href="https://www.facebook.com/people/FlashChat/61566874176659/"  className="flash-cursor-pointer" target="_blank">
              <img
                src={facebookIcon}
                alt="Facebook icon"
                width="40px"
                height="40px"
              />
            </a>

            <a href="#">
              <img
                src={instagramIcon}
                alt="Instagram icon"
                width="40px"
                height="40px"
              />
            </a>

            <a href="#">
              <img
                src={xIcon}
                alt="X (antes Twitter) icon"
                width="40px"
                height="40px"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
