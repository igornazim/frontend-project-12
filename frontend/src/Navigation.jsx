import { Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Navbar bg="white" expand="lg" variant="light" className="shadow-sm">
      <Container>
        <Navbar.Brand>
          <Link className="navbar-brand" to="/">
            Hexlet chat
          </Link>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Navigation;
