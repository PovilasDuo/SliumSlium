import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHome,
  faUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const html = (
    <nav>
      <div className="nav-wrapper" style={{}}>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          <a href="/">
            &emsp;SliumSlium library&ensp;
            <FontAwesomeIcon icon={faBook} />
          </a>
        </span>
        <ul className="right" style={{ marginLeft: "10%" }}>
          <li>
            <a href="/">
              Home <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            <a href="/account">
              My reservations <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            <a href="/cart">
              Cart <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
  return html;
}
