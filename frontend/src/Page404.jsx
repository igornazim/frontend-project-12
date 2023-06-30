import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Page404 = () => (
    <Container className="text-center">
      <h1>404</h1>
      <h3>Страница не найдена</h3>
      <p>
        Но вы можете перейти на
        <Link to="/">
          главную страницу
        </Link>
      </p>
    </Container>
  );

export default Page404;
