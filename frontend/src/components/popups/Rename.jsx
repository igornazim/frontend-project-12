import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateChannel,
  channelsSelector,
  setCurrentChannelId,
} from '../../slices/channelsSlice';
import { hideModal } from '../../slices/modalsSlice';
import useApi from '../../hooks/useSocket';

const filter = require('leo-profanity');

filter.loadDictionary('en');

const Rename = () => {
  const channels = useSelector(channelsSelector.selectAll);
  const channel = useSelector((state) => state.modalsReducer.channel);
  const channelsNames = channels.map(({ name }) => name);
  const dispatch = useDispatch();
  const { socket } = useApi();

  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.select();
  }, []);

  const { t } = useTranslation();

  const RenameChannelNotify = () => {
    toast.success(t('modals.rename.toastText'), {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const renaimingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, 'errors.nameMinlength')
      .required('errors.required')
      .notOneOf(channelsNames, t('errors.notOneOfChannel')),
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      channel: {},
    },
    validationSchema: renaimingSchema,
    onSubmit: () => {
      if (formik.values.channelName !== '') {
        const updatedChannel = {
          id: channel.id,
          name: formik.values.channelName,
        };
        socket.emit('renameChannel', updatedChannel);
        socket.on('renameChannel', (payload) => {
          dispatch(updateChannel({ id: channel.id, changes: payload }));
          dispatch(setCurrentChannelId(payload.id));
        });
        formik.values.channelName = '';
        dispatch(hideModal());
        RenameChannelNotify();
      }
    },
  });

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => dispatch(hideModal())}>
        <Modal.Title>{t('modals.rename.headline')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="visually-hidden" htmlFor="name">
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
              {t('modals.rename.cancelButton')}
            </Button>
            <Button variant="primary" type="submit" value="submit">
              {t('modals.rename.submitButton')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
// END
