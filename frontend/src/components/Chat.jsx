import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Nav,
  ToggleButton,
  ButtonGroup,
  Button,
  Dropdown,
} from 'react-bootstrap';
import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { useFormik } from 'formik';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRollbar } from '@rollbar/react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from '../routes.js';
import {
  setChannels,
  setCurrentChannelId,
  channelsSelector,
} from '../slices/channelsSlice.js';
import {
  setMessages,
  addMessage,
  messagesSelector,
} from '../slices/messagesSlice.js';
import useAuth from '../hooks/Index.jsx';
import useSocket from '../hooks/useSocket.jsx';
import getModal from '../getModal.js';

const filter = require('leo-profanity');

filter.loadDictionary('en');

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
  const rollbar = useRollbar();
  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const showModal = (type, channel = null) => setModalInfo({ type, channel });
  const hideModal = () => setModalInfo({ type: null, channel: null });

  const dispatch = useDispatch();

  const channels = useSelector(channelsSelector.selectAll);
  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const messages = useSelector(messagesSelector.selectAll)
    .filter(({ channelId }) => channelId === currentId);

  const { currentUser } = useAuth();
  const { socket } = useSocket();

  const { t } = useTranslation();

  const getCurrentChannel = () => {
    const currentChannel = channels.find(({ id }) => id === currentId);
    if (currentChannel) {
      return currentChannel.name;
    }
    return 'general';
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: () => {
      socket.emit(
        'newMessage',
        {
          body: JSON.stringify(formik.values.text),
          channelId: currentId,
          username: 'admin',
        },
        (response) => console.log(response.status));
      socket.on('newMessage', (payload) => dispatch(addMessage(payload)));
      formik.values.text = '';
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), {
          headers: getAuthHeader(),
        });
        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));
      } catch (error) {
        rollbar.error('Error fetching contact', error);
      }
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
    return channels.map((channel) => {
      if (channel.removable) {
        return (
          <Nav.Item key={_.uniqueId()} className="w-100">
            <Dropdown className="w-100" as={ButtonGroup}>
              <Button
                variant={currentId === channel.id ? 'secondary' : null}
                onClick={() => dispatch(setCurrentChannelId(channel.id))}
                className="w-100 rounded-0 text-start text-truncate"
              >
                {`# ${filter.clean(channel.name)}`}
              </Button>
              <Dropdown.Toggle
                split
                variant={currentId === channel.id ? 'secondary' : null}
                id="dropdown-split-basic"
              >
                <span className="visually-hidden">{t('chat.hiddenText')}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => showModal('removing', channel)}
                  href="#/action-1"
                >
                  {t('chat.dropdownItemDelete')}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => showModal('renaiming', channel)}
                  href="#/action-2"
                >
                  {t('chat.dropdownItemRename')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav.Item>
        );
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
      );
    });
  };

  const renderMessages = () => messages.map(({ body, id }) => (
      <div key={id} className="text-break mb-2">
        <b>
        {currentUser.username}
          :
        </b>
        {` ${filter.clean(JSON.parse(body))}`}
      </div>
  ));

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
                <Image src={`${process.env.PUBLIC_URL}/plus.svg`} />
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
                  <b>{`# ${getCurrentChannel()}`}</b>
                </p>
                <span className="text-muted">
                  {t('chat.counter.count', { count: messages.length })}
                </span>
              </div>
              <div
                id="messages-box"
                className="chat-messages overflow-auto px-5 "
              >
                {renderMessages()}
              </div>
              <div className="mt-auto px-5 py-3">
                <Form
                  noValidate=""
                  onSubmit={formik.handleSubmit}
                  className="py-1 border rounded-2"
                >
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
                      <Image src={`${process.env.PUBLIC_URL}/send.svg`} />
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
