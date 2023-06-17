import { Container, Navbar, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useAuth from "./hooks/Index.jsx";

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();

  return auth.currentUser ? (
    <Button
      onClick={auth.logOut}
      as={Link}
      to="/login"
      state={{ from: location }}
    >
      Выйти
    </Button>
  ) : (
    <Button as={Link} to="/login" state={{ from: location }}>
      Войти
    </Button>
  );
};

const Navigation = () => {
  return (
    <Navbar bg="white" expand="lg" variant="light" className="shadow-sm">
      <Container>
        <Navbar.Brand>
          <Link className="navbar-brand" to="/">
            Hexlet chat
          </Link>
        </Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  );
};

export default Navigation;
