import React, {useState } from 'react';
import {
  Button,
  Form,
  Card,
  Container,
  Image,
  FloatingLabel,
  Row
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../Hooks/Index.jsx';
import routes from '../Hooks/routes.js';
import { useFormik } from "formik";
import axios from 'axios';

const AuthorisationForm = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        navigate('/');
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw err;
      }
    },
  });

  return (
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
                <h1 className="text-center mb-4" as="h1">
                  Войти
                </h1>
                <Form.Group className="form-floating mb-3">
                  <FloatingLabel
                    label="Ваш ник"
                    htmlFor="username"
                    className="mb-3"
                  >
                    <Form.Control
                      name="username"
                      id="username"
                      type="text"
                      required
                      placeholder="Ваш ник"
                      isInvalid={authFailed}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                    />
                  </FloatingLabel>
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <FloatingLabel
                    label="Пароль"
                    htmlFor="password"
                    className="mb-3"
                  >
                    <Form.Control
                      name="password"
                      id="password"
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
                      Неверные имя пользователя или пароль
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button
                  className="w-100"
                  variant="outline-primary"
                  type="submit"
                >
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center p-4">
              <span>Нет аккаунта?</span>{" "}
              <Link to="/signup">Зарегистрироваться</Link>
            </Card.Footer>
          </Card>
        </Container>
      </Row>
    </Container>
  );
};

export default AuthorisationForm;
