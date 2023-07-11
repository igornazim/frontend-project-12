import {
  Container,
  Row,
  Col,
  Image,
  Form,
  Nav,
  Button,
} from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRollbar } from '@rollbar/react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import {
  setChannels,
  channelsSelector,
} from '../../slices/channelsSlice';
import {
  setMessages,
  messagesSelector,
} from '../../slices/messagesSlice';
import { showModal } from '../../slices/modalsSlice';
import useAuth from '../../hooks/useAuth';
import useApi from '../../hooks/useApi';
import getModal from '../popups/getModal';
import Modal from '../popups/utils';
import Channels from './Channels';
import Messages from './Messages';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const getAuthHeader = (dataName, getData) => {
  const user = getData(dataName);
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const Chat = () => {
  const rollbar = useRollbar();

  const dispatch = useDispatch();

  const channels = useSelector(channelsSelector.selectAll);
  const currentId = useSelector((state) => state.channelsReducer.currentChannelId);
  const messages = useSelector(messagesSelector.selectAll)
    .filter(({ channelId }) => channelId === currentId);

  const { getUser } = useAuth();
  const { socketEmetWrapper } = useApi();

  const { t } = useTranslation();

  const getCurrentChannel = () => {
    const currentChannel = channels.find(({ id }) => id === currentId);
    if (currentChannel) {
      return currentChannel.name;
    }
    return t('defaultChannel');
  };

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    onSubmit: () => {
      const newMessage = {
        body: JSON.stringify(formik.values.text),
        channelId: currentId,
        username: 'admin',
      };
      socketEmetWrapper('newMessage', newMessage);
      formik.values.text = '';
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), {
          headers: getAuthHeader('user', getUser),
        });
        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));
      } catch (error) {
        rollbar.error(t('fetchingError'), error);
      }
    };
    fetchContent();
  }, [dispatch, rollbar, t, getUser]);

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('chat.headline')}</b>
              <Button
                onClick={() => dispatch(showModal({ type: 'adding' }))}
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
              <Channels />
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
                <Messages />
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
        <Modal getModal={getModal} />
      </Container>
      <ToastContainer />
    </>
  );
};

export default Chat;
