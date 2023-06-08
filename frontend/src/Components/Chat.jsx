import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
import React from 'react';
import { useSelector } from 'react-redux';

const Chat = () => {
  const channels = useSelector((state) => state.channelsReducer.channels);
  const renderChannels = () => {
    if (channels.length === 0) {
      return null;
    }
    return (
      channels.map(({ id, name }) => (
        <li key={id} className="nav-item w-100">
          <button type="button" className="w-100 rounded-0 text-start btn">
            <span className="me-1">#</span>
            {name}
          </button>
        </li>
      ))
    )
  }

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <button
              type="button"
              className="p-0 text-primary btn btn-group-vertical"
            >
              <Image
                src={`${process.env.PUBLIC_URL}/plus.svg`}
              />
              <span className="visually-hidden">+</span>
            </button>
          </div>
          <ul
            id="channels-box"
            className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
            {renderChannels()}
          </ul>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b># general</b>
              </p>
              <span className="text-muted">0 сообщений</span>
            </div>
            <div
              id="messages-box"
              className="chat-messages overflow-auto px-5 "
            ></div>
            <div className="mt-auto px-5 py-3">
              <Form noValidate="" className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    name="body"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    value=""
                  />
                  <button
                    type="submit"
                    disabled=""
                    className="btn btn-group-vertical"
                  >
                    <Image
                      src={`${process.env.PUBLIC_URL}/send.svg`}
                    />
                    <span className="visually-hidden">Отправить</span>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
