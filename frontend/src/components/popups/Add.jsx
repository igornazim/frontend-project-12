import React, { useEffect, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addChannel,
  channelsSelector,
  setCurrentChannelId,
} from '../../slices/channelsSlice';
import { hideModal } from '../../slices/modalsSlice';
import useApi from '../../hooks/useSocket';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const Add = () => {
  const channels = useSelector(channelsSelector.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  const dispatch = useDispatch();
  const { socket } = useApi();
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const { t } = useTranslation();

  const AddChannelNotify = () => {
    toast.success(t('modals.add.toastText'), {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const addingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, 'errors.nameMinlength')
      .required('errors.required')
      .notOneOf(channelsNames, 'errors.notOneOfChannel'),
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
        dispatch(hideModal());
        AddChannelNotify();
      }
    },
  });

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => dispatch(hideModal())}>
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
              {t(formik.errors.channelName)}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => dispatch(hideModal())}
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
