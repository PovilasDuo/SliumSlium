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
  const { user, logOut, hasRole } = useAuth();

  const handleLogout = () => {
    logOut();
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          <a href="/">
            &emsp;SliumSlium library&ensp;
            <FontAwesomeIcon icon={faBook} />
          </a>
        </span>
        <ul className="right" style={{ marginLeft: "10%" }}>
          <li>
            <a href="/">
              Home <FontAwesomeIcon icon={faHome} />
            </a>
          </li>
          {hasRole("admin") && (
            <li>
              <a href="/book-creation">
                Add book <FontAwesomeIcon icon={faPlus} />
              </a>
            </li>
          )}

          {!user && (
            <li>
              <a href="/login">
                Log In <FontAwesomeIcon icon={faHippo} />
              </a>
            </li>
          )}
          {user && (
            <>
              <li>
                <a href="/account">
                  {hasRole("user") ? (
                    <>
                      My reservations <FontAwesomeIcon icon={faUser} />
                    </>
                  ) : (
                    <>
                      All reservations <FontAwesomeIcon icon={faUser} />
                    </>
                  )}
                </a>
              </li>
              {hasRole("user") && (
                <li>
                  <a href="/cart">
                    Cart <FontAwesomeIcon icon={faCartShopping} />
                  </a>
                </li>
              )}

              <li>
                <button className="btn-flat white-text" onClick={handleLogout}>
                  Log out <FontAwesomeIcon icon={faDog} />
                </button>
              </li>
            </>
          )}
          {!user && (
            <li>
              <a href="/signup">Sign up</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
