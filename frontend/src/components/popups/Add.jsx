import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import {
  addChannel,
  channelsSelector,
  setCurrentChannelId,
} from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
// import useAuth from "../../hooks/Index.jsx";
import * as Yup from 'yup';
import useSocket from '../../hooks/useSocket.jsx';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const filter = require('leo-profanity');

filter.loadDictionary('en');

const AddChannelNotify = () => {
  toast.success('Канал создан', {
    position: toast.POSITION.TOP_RIGHT,
  });
};

const Add = (props) => {
  const channels = useSelector(channelsSelector.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  // const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { hideModal } = props;
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const { t } = useTranslation();

  const addingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('errors.nameMinlength'))
      .required(t('errors.required'))
      .notOneOf(channelsNames, t('errors.notOneOfChannel')),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      channel: {},
    },
    validationSchema: addingSchema,
    onSubmit: () => {
      if (formik.values.channelName !== '') {
        const newChannel = {
          id: _.uniqueId(),
          name: formik.values.channelName,
          removable: true,
        };
        socket.emit('newChannel', newChannel);
        socket.on('newChannel', (payload) => {
          dispatch(addChannel(payload));
          dispatch(setCurrentChannelId(payload.id));
        });
        formik.values.channelName = '';
        hideModal();
        AddChannelNotify();
      }
    },
  });

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => hideModal()}>
        <Modal.Title>{t('modals.add.headline')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name" className="visually-hidden">
              Имя канала
            </Form.Label>
            <Form.Control
              id="name"
              ref={inputEl}
              data-testid="input-body"
              name="channelName"
              required=""
              onChange={formik.handleChange}
              value={formik.values.channelName}
              isInvalid={
                !!formik.errors.channelName && formik.touched.channelName
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => hideModal()}
              className="me-2"
            >
              {t('modals.add.cancelButton')}
            </Button>
            <Button variant="primary" type="submit" value="submit">
              {t('modals.add.submitButton')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
// END
