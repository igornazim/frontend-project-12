import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { updateChannel, channelsSelector, setCurrentChannelId } from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import useSocket from "../../hooks/useSocket.jsx";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const filter = require('leo-profanity');
filter.loadDictionary('en');

const RenameChannelNotify = () => {
  toast.success('Канал переименован', {
    position: toast.POSITION.TOP_RIGHT
  });
};

const Rename = (props) => {
  const channels = useSelector(channelsSelector.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { hideModal, modalInfo } = props;
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  }, []);

  const { t } = useTranslation();

  const renaimingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('errors.nameMinlength'))
      .required(('errors.required'))
      .notOneOf(channelsNames, t('errors.notOneOfChannel'))
  });

  const formik = useFormik({
    initialValues: {
      channelName: modalInfo.channel.name,
      channel: {},
    },
    validationSchema: renaimingSchema,
    onSubmit: () => {
      if (formik.values.channelName !== '') {
        const updatedChannel = {...modalInfo.channel, name: formik.values.channelName };
        socket.emit('renameChannel', updatedChannel);
        socket.on('renameChannel', (payload) => {
          dispatch(updateChannel({ id: modalInfo.channel.id, changes: payload }));
          dispatch(setCurrentChannelId(payload.id))
        });
        formik.values.channelName = '';
        hideModal();
        RenameChannelNotify();
      }
    },
  });

  return (
      <Modal centered show>
        <Modal.Header closeButton onClick={() => hideModal()}>
          <Modal.Title>{t('modals.rename.headline')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label
                htmlFor="name"
                className="visually-hidden">
                Имя канала
                </Form.Label>
              <Form.Control
                id="name"
                ref={inputEl}
                data-testid="input-body"
                name="name"
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
            {t('modals.rename.cancelButton')}
          </Button>
          <Button
            variant="primary"
            type="submit"
            value="submit"
          >
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