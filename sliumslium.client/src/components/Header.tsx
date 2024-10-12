import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle,
  faHome,
  faSearch,
  faGasPump,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const html = (
    <nav>
      <div className="nav-wrapper" style={{}}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          <a href="/">
            Moto adventure <FontAwesomeIcon icon={faMotorcycle} />
          </a>
        </span>
        <ul className="right" style={{ marginLeft: "10%" }}>
          <li>
            <a href="/">
              Home <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            <a href="/login">
              Account <FontAwesomeIcon icon={faGasPump}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            <a href="/search">
              Search <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            <a href="/trips/create">
              Add trip <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
  return html;
}
