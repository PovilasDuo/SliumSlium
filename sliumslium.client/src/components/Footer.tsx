export default function Footer() {
    const html = (
      <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">
                T120B178 Informacinių sistemų kūrimas karkasais
              </h5>
              <p className="grey-text text-lighten-4">
                This site was created for the aforementioned university course
                module
              </p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="white-text">Links</h5>
              <ul>
                <li>
                  <a
                    className="grey-text text-lighten-3"
                    href="https://moodle.ktu.edu/course/view.php?id=203"
                  >
                    Moodle
                  </a>
                </li>
                <li>
                  <a
                    className="grey-text text-lighten-3"
                    href="https://en.ktu.edu/"
                  >
                    Home page
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <p>
              <a href="https://www.linkedin.com/in/povilas-duoba-64ab60290/">
                © 2024 IFZm-1 Povilas Duoba
              </a>
            </p>
          </div>
        </div>
      </footer>
    );
    return html;
  }
  