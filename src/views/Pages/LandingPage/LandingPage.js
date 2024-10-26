import logo from "assets/img/Flaschat-horizontal.png";
import houseIcon from "assets/icons/house-icon-flaschat.png";
import "assets/css/landing.css";
import users from "assets/img/users-flaschat.png";
import botFlaschat from "assets/img/flachat-bot.png";
import bgFirstSection from "assets/img/bg-landing-section-first.svg";

export default function LandingPage() {
  return (
    <div className="m-0 m-0">
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
                <a className="nav-link flash-text-secondary" href="#">
                  Sobre Nosotros
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Servicios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link flash-text-secondary">Contáctanos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Primera seccion */}
      <div className="bg-white w-100 flash-first-section">
        <img src={bgFirstSection} className="position-absolute w-100"/>
        <img src={botFlaschat} className="position-absolute bot-flaschat"/>

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
          <p className="flash-text-white">+ 2000 usuarios con nuestros chatbots.</p>
          <img src={users}/>
        </div>

        <div className="px-2 px-md-5 position-relative flash-first-section-description text-center text-md-start">
          <p>Diseñado para proporcionar respuestas instantáneas, personalizadas y eficientes, optimizando tu comunicación y elevando la satisfacción del usuario a un nuevo nivel.</p>
        </div>
      </div>
    </div>
  );
}
