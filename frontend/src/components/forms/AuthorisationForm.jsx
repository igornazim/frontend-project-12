import React, { useState } from 'react';
import {
  Button,
  Form,
  Card,
  Container,
  Image,
  FloatingLabel,
  Row,
} from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import useAuth from '../../hooks/Index.jsx';
import routes from '../../routes.js';

const AuthorisationForm = () => {
  const rollbar = useRollbar();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const errNetworkNotify = () => {
    toast.error(t('connectionError'), {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        auth.setUser('user', res.data);
        auth.logIn(res.data);
        navigate('/');
      } catch (err) {
        formik.setSubmitting(false);
        if (err.code === 'ERR_NETWORK') {
          errNetworkNotify();
        }
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        rollbar.error(t('submitError'), err);
        throw err;
      }
    },
  });

  return (
    <>
      <Container className="container-fluid h-100">
        <Row className="justify-content-center align-content-center h-100">
          <Container className="col-12 col-md-8 col-xxl-6">
            <Card className="shadow-sm">
              <Card.Body className="row p-5">
                <Container className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <Image
                    src={`${process.env.PUBLIC_URL}/avatarreg.jpg`}
                    className="rounded-circle"
                    alt="Регистрация"
                  />
                </Container>
                <Form
                  onSubmit={formik.handleSubmit}
                  className="col-12 col-md-6 mt-3 mt-mb-0"
                >
                  <h1 className="text-center mb-4">
                    {t('authForm.headline')}
                  </h1>
                  <Form.Group className="form-floating mb-3">
                    <FloatingLabel
                      label="Ваш ник"
                      controlId="username"
                      className="mb-3"
                    >
                      <Form.Control
                        name="username"
                        type="text"
                        required
                        placeholder="Ваш ник"
                        isInvalid={authFailed}
                        onChange={formik.handleChange}
                        value={formik.values.username}
                      />
                    </FloatingLabel>
                    <Form.Text className="text-muted" />
                  </Form.Group>
                  <Form.Group className="form-floating mb-4">
                    <FloatingLabel
                      label="Пароль"
                      controlId="password"
                      className="mb-3"
                    >
                      <Form.Control
                        name="password"
                        type="password"
                        required
                        placeholder="Пароль"
                        isInvalid={authFailed}
                        onChange={formik.handleChange}
                        value={formik.values.password}
                      />
                      <Form.Control.Feedback
                        placement="right"
                        type="invalid"
                        tooltip
                      >
                        {t('errors.incorrectNameOrPass')}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                  <Button
                    className="w-100"
                    variant="outline-primary"
                    type="submit"
                  >
                    {t('authForm.logInButton')}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center p-4">
                <span>{t('authForm.footerText')}</span>
                {' '}
                <Link to="/signup">{t('authForm.footerButton')}</Link>
              </Card.Footer>
            </Card>
          </Container>
        </Row>
      </Container>
      <ToastContainer />
    </>
  );
};

export default AuthorisationForm;
