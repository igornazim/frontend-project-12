import { Container, Navbar, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from './hooks/Index';

const AuthButton = () => {
  const { getUser, logOut } = useAuth();
  const user = getUser('user');

  const location = useLocation();

  const { t } = useTranslation();

  return user ? (
    <Button
      onClick={() => logOut('user')}
      as={Link}
      to="/login"
      state={{ from: location }}
    >
      {t('header.logOutButton')}
    </Button>
  ) : (
    <Button as={Link} to="/login" state={{ from: location }}>
      {t('header.logInButton')}
    </Button>
  );
};

const Navigation = () => {
  const { t } = useTranslation();
  return (
    <Navbar bg="white" expand="lg" variant="light" className="shadow-sm">
      <Container>
        <Navbar.Brand>
          <Link className="navbar-brand" to="/">
            {t('header.logoText')}
          </Link>
        </Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  );
};

export default Navigation;
