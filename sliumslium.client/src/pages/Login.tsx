import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../components/Utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await logIn(email, password);
      navigate("/");
    } catch (err: any) {
      M.toast({ html: `${err.message}`, classes: "red" });
    }
  };

  return (
    <>
      <div
        className="container grey lighten-3"
        style={{ margin: "4.8rem auto 6.4rem" }}
      >
        <h3 className="center-align">Login</h3>
        <div className="row">
          <form className="col s12" onSubmit={() => {}}>
            <div className="input-field col s12">
              <input
                id="email"
                type="email"
                className="validate"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field col s12">
              <input
                id="password"
                type="password"
                className="validate"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-field col s12">
              <button
                className="btn-large waves-effect waves-light"
                type="submit"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="center-align">
        <p style={{ fontSize: "1.2rem" }}>
          <strong>Don't have an account yet?</strong>
        </p>
        <a href="/signup" className="btn teal lighten-2">
          Sign up
        </a>
      </div>
    </>
  );
};

export default Login;
