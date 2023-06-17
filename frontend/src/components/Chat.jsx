import { Container, Row, Col, Image, Form, Nav, ToggleButton, ButtonGroup, Button, Dropdown} from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes.js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setChannels } from '../slices/channelsSlice.js';
import { useFormik } from "formik";
import useAuth from "../hooks/Index.jsx";
import useSocket from "../hooks/useSocket.jsx";
import getModal from "../getModal.js";

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return (
    <Component modalInfo={modalInfo} hideModal={hideModal} />
  );
};

const Chat = () => {
  const [modalInfo, setModalInfo] = useState({ task: null, type: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });
  const hideModal = () => setModalInfo({ type: null, item: null });

  const [currentId, setId] = useState(1);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channelsReducer.channels);
  const { currentUser } = useAuth();
  const { socket } = useSocket();

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: (values) => {
      socket.emit('newMessage', { body: JSON.stringify(values.text), channelId: 1, username: 'admin' }, (response) => {
        console.log(response.status);
      });
      socket.on('newMessage', (payload) => {
        setMessages([...messages, payload]);
      });
      values.text = '';
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      dispatch(setChannels(data.channels));
    };
    fetchContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderChannels = () => {
    if (channels.length === 0) {
      return null;
    }
    return (
      channels.map(({ id, name, removable }) => {
        if (removable) {
          return (
            <Nav.Item key={id} className="w-100">
              <Dropdown className="w-100" as={ButtonGroup}>
                <Button
                  variant={currentId === id ? 'secondary' : null}
                  onClick={() => setId(id)}
                  className="w-100 rounded-0 text-start text-truncate"
                >
                  {`# ${name}`}
                </Button>
                <Dropdown.Toggle
                  split
                  variant={currentId === id ? 'secondary' : null}
                  id="dropdown-split-basic" />
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Удалить</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Переименовать</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          )
        }
        return (
          <Nav.Item key={id} className="w-100">
            <ToggleButton
              variant={currentId === id ? 'secondary' : null}
              type="button"
              className="w-100 rounded-0 text-start"
              onClick={() => setId(id)}
            >
              <span className="me-1">#</span>
              {name}
            </ToggleButton>
          </Nav.Item>
        )
      })
    )
  }

  const renderMessages = () => {
    return (
        messages.map(({ body, id}) => (
          <div key={id} className="text-break mb-2">
            <b>
              {currentUser.username}:
            </b>
            {` ${JSON.parse(body)}`}
          </div>
        ))
    )
  }

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>Каналы</b>
            <Button
              onClick={() => showModal('adding')}
              type="button"
              variant="light"
              className="p-0 text-primary btn btn-group-vertical"
            >
              <Image
                src={`${process.env.PUBLIC_URL}/plus.svg`}
              />
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <Nav
            id="channels-box"
            className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
          >
            {renderChannels()}
          </Nav>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>{`# ${channels.length !== 0 ? channels.find(({ id }) => id === currentId).name : 'general'}`}</b>
              </p>
              <span className="text-muted">0 сообщений</span>
            </div>
            <div
              id="messages-box"
              className="chat-messages overflow-auto px-5 "
              
            >
              {renderMessages()}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form noValidate="" onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
                <div className="input-group has-validation">
                  <input
                    name="text"
                    aria-label="Новое сообщение"
                    placeholder="Введите сообщение..."
                    className="border-0 p-0 ps-2 form-control"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                  />
                  <Button
                    type="submit"
                    variant="light"
                    disabled=""
                    className="btn btn-group-vertical"
                  >
                    <Image
                      src={`${process.env.PUBLIC_URL}/send.svg`}
                    />
                    <span className="visually-hidden">Отправить</span>
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {renderModal({ modalInfo, hideModal })}
    </Container>
  );
};

export default Chat;