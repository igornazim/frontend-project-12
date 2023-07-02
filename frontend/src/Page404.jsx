import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <Container className="text-center">
      <h1>{t('page404.headline')}</h1>
      <h3>{t('page404.thirdLevelHeadLine')}</h3>
      <p>
        {t('page404.textPartOne')}
        <Link to="/">
          {t('page404.textPartTwo')}
        </Link>
      </p>
    </Container>
  );
};

export default Page404;
