import { Container, Row, Col, Image, Form, Nav, ToggleButton, ButtonGroup, Button, Dropdown} from "react-bootstrap";
import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import axios from 'axios';
import routes from '../routes.js';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels, setCurrentChannelId, channelsSelector } from '../slices/channelsSlice.js';
import { setMessages, addMessage, messagesSelector } from '../slices/messagesSlice.js';
import { useFormik } from "formik";
import useAuth from "../hooks/Index.jsx";
import useSocket from "../hooks/useSocket.jsx";
import getModal from "../getModal.js";
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const renderModal = ({ modalInfo, hideModal, setId }) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return (
    <Component modalInfo={modalInfo} hideModal={hideModal} setId={setId} />
  );
};

const Chat = () => {
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const showModal = (type, channel = null) => setModalInfo({ type, channel });
  const hideModal = () => setModalInfo({ type: null, channel: null });

  const dispatch = useDispatch();

  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const channels = useSelector(channelsSelector.selectAll);
  const messages = useSelector(messagesSelector.selectAll).filter(({ channelId }) => channelId === currentId);

  const { currentUser } = useAuth();
  const { socket } = useSocket();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: (values) => {
      socket.emit('newMessage', { body: JSON.stringify(values.text), channelId: currentId, username: 'admin' }, (response) => {
        console.log(response.status);
      });
      socket.on('newMessage', (payload) => {
        dispatch(addMessage(payload));
      });
      values.text = '';
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      dispatch(setChannels(data.channels));
      dispatch(setMessages(data.messages)); // новое
    };
    fetchContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const renderChannels = () => {
    if (channels.length === 0) {
      return null;
    }
    return (
      channels.map((channel) => {
        if (channel.removable) {
          return (
            <Nav.Item key={_.uniqueId()} className="w-100">
              <Dropdown className="w-100" as={ButtonGroup}>
                <Button
                  variant={currentId === channel.id ? 'secondary' : null}
                  onClick={() => dispatch(setCurrentChannelId(channel.id))}
                  className="w-100 rounded-0 text-start text-truncate"
                >
                  {`# ${channel.name}`}
                </Button>
                <Dropdown.Toggle
                  split
                  variant={currentId === channel.id ? 'secondary' : null}
                  id="dropdown-split-basic" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => showModal('removing', channel)} href="#/action-1">{t('chat.dropdownItemDelete')}</Dropdown.Item>
                  <Dropdown.Item onClick={() => showModal('renaiming', channel)} href="#/action-2">{t('chat.dropdownItemRename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          )
        }
        return (
          <Nav.Item key={_.uniqueId()} className="w-100">
            <ToggleButton
              variant={currentId === channel.id ? 'secondary' : null}
              type="button"
              className="w-100 rounded-0 text-start"
              onClick={() => dispatch(setCurrentChannelId(channel.id))}
            >
              <span className="me-1">#</span>
              {channel.name}
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
    <>
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('chat.headline')}</b>
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
                <b>{`# ${channels.length >= 2 ? channels.find(({ id }) => id === currentId).name : 'general'}`}</b>
              </p>
              <span className="text-muted">{t('chat.counter.count', { count: messages.length })}</span>
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
                    ref={inputEl}
                    name="text"
                    required
                    aria-label="Новое сообщение"
                    placeholder={t('chat.inputText')}
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
    <ToastContainer />
    </>
  );
};

export default Chat;