export default function Footer() {
  const footerHTML = (
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <h5 className="white-text">SliumSlium Library</h5>
            <p
              className="grey-text text-lighten-4"
              style={{ textAlign: "left" }}
            >
              Read, live, enjoy - books were meant to make us experience life
              through someone else's eyes. So... what are you waiting for?
            </p>
          </div>
          <div className="col l4 offset-l2 s12" style={{ textAlign: "right" }}>
            <h5 className="white-text">Created by Povilas Duoba</h5>
            <ul>
              <li>
                <a
                  className="grey-text text-lighten-3"
                  href="https://www.linkedin.com/in/povilas-duoba-64ab60290/"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="grey-text text-lighten-3"
                  href="https://en.ktu.edu/"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
  return footerHTML;
}
