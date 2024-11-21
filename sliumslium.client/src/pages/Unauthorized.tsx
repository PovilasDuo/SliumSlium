export default function Unauthorized() {
  return (
    <>
      <div
        className="container grey lighten-3 center-align"
        style={{ margin: "4.8rem auto 6.4rem" }}
      >
        <h3>Something is wrong :(</h3>
        <h5>
          If the issue persists, submit a bug report at duobapovilas@gmail.com
        </h5>
        <br></br>
        <a href="/" className="btn teal lighten-2">
          Return to home page
        </a>
      </div>
    </>
  );
}
