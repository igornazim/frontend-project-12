import {
  Button,
  Form,
  Card,
  Container,
  Image,
  FloatingLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Минимум 3 символа")
    .max(20, "Максимум 20 символов")
    .required("Обязательное поле"),
  password: Yup.string()
    .min(6, "Минимум 6 символов")
    .required("Обязательное поле"),
});

const AuthorisationForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => console.log(values),
  });

  return (
    <Container className="container-fluid h-100">
      <Container className="row justify-content-center align-content-center h-100">
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
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
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
      </Container>
    </Container>
  );
};

export default AuthorisationForm;
