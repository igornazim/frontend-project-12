import { Container, Navbar } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <div className="d-flex flex-column h-100">
        <Navbar bg="white" expand="lg" variant="light" className="shadow-sm">
          <Container>
            <Navbar.Brand>
              <Link className="navbar-brand" to="/">
                Hexlet chat
              </Link>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Outlet />
      </div>
    </>
  );
};

export default Navigation;
