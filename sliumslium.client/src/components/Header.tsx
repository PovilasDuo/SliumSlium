import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHome,
  faUser,
  faCartShopping,
  faPlus,
  faHippo,
  faDog,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./Utils/AuthContext";

export default function Header() {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut();
  };

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
          <li>
            <a href="/book-creation">
              Add book <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            </a>
          </li>
          <li>
            {!user && (
              <li>
                <a href="/login">
                  Log In <FontAwesomeIcon icon={faHippo}></FontAwesomeIcon>
                </a>
              </li>
            )}
            {user && (
              <li>
                <button className="btn-flat white-text" onClick={handleLogout}>
                  Log out <FontAwesomeIcon icon={faDog}></FontAwesomeIcon>
                </button>
              </li>
            )}
            {!user && (
              <li>
                <a href="/Signup">SIGN UP</a>
              </li>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
  return html;
}
