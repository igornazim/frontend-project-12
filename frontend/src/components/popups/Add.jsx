import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import { addChannel, channelsSelector } from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
// import useAuth from "../../hooks/Index.jsx";
import * as Yup from "yup";
import useSocket from "../../hooks/useSocket.jsx";

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
  });

  const addingSchema = Yup.object().shape({
    channelName: Yup.string()
      .min(3, "Минимум 3 символа")
      .required("Обязательное поле")
      .notOneOf(channelsNames, "Должно быть уникальным")
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      channel: {},
    },
    validationSchema: addingSchema,
    onSubmit: () => {
      if (formik.values.channelName !== '') {
        const newChannel = { id: _.uniqueId(), name: formik.values.channelName, removable: true };
        socket.emit('newChannel', newChannel);
        socket.on('newChannel', (payload) => {
          dispatch(addChannel(payload));
        });
        formik.values.channelName = '';
        hideModal();
      }
    },
  });

  return (
      <Modal centered show>
        <Modal.Header closeButton onClick={() => hideModal()}>
          <Modal.Title>Добавить канал</Modal.Title>
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

export default Add;
// END