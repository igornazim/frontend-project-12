import React, { useState } from "react";
import {
  Button,
  Form,
  Card,
  Container,
  Image,
  FloatingLabel,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/Index.jsx";
import routes from "../../routes.js";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

const RegistrationForm = () => {
  const [regFailed, setRegFailed] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Минимум 3 символа")
      .max(20, "Максимум 20 символов")
      .required("Обязательное поле"),
    password: Yup.string()
      .min(6, "Минимум 6 символов")
      .required("Обязательное поле"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Пароли должны совпадать"
    ),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setRegFailed(false);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem("user", JSON.stringify(res.data));
        auth.logIn(res.data);
        navigate("/");
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setRegFailed(true);
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
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
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
                  Регистрация
                </h1>
                <Form.Group className="form-floating mb-3">
                  <FloatingLabel
                    label="Имя пользователя"
                    htmlFor="username"
                    className="mb-3"
                  >
                    <Form.Control
                      name="username"
                      id="username"
                      type="text"
                      required
                      placeholder="Имя пользователя"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={
                        !!formik.errors.username || !regFailed
                      }
                    />
                    <Form.Control.Feedback
                      placement="right"
                      type="invalid"
                      tooltip
                    >
                      {formik.errors.username}
                    </Form.Control.Feedback>
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
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={
                        !!formik.errors.password || !regFailed
                      }
                    />
                    <Form.Control.Feedback
                      placement="right"
                      type="invalid"
                      tooltip
                    >
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <FloatingLabel
                    label="Подтвердите пароль"
                    htmlFor="confirmPassword"
                    className="mb-3"
                  >
                    <Form.Control
                      name="confirmPassword"
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="Подтвердите пароль"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      isInvalid={
                        !!formik.errors.confirmPassword || !regFailed
                      }
                    />
                    <Form.Control.Feedback
                      placement="right"
                      type="invalid"
                      tooltip
                    >
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback
                      placement="right"
                      type="invalid"
                      tooltip
                    >
                      {regFailed ? null : 'Такой пользователь уже существует'}
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
              <span>Уже зарегистрированы?</span> <Link to="/login">Войти</Link>
            </Card.Footer>
          </Card>
        </Container>
      </Row>
    </Container>
  );
};

export default RegistrationForm;