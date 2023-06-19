import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { updateChannel, channelsSelector } from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import useSocket from "../../hooks/useSocket.jsx";

const Rename = (props) => {
  const channels = useSelector(channelsSelector.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { hideModal, modalInfo } = props;
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  });

  const renaimingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, "Минимум 3 символа")
      .required("Обязательное поле")
      .notOneOf(channelsNames, "Должно быть уникальным")
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
        });
        formik.values.channelName = '';
        hideModal();
      }
    },
  });

  return (
      <Modal centered show>
        <Modal.Header closeButton onClick={() => hideModal()}>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="visually-hidden">Имя канала</Form.Label>
              <Form.Control
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
            Отменить
          </Button>
          <Button
            variant="primary"
            type="submit"
            value="submit"
          >
            Отправить
          </Button>
          </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
  );
};

export default Rename;
// END