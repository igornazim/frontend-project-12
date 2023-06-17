import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import addChannels from '../../slices/channelsSlice.js';
import { useDispatch } from 'react-redux';
import useAuth from "../../hooks/Index.jsx";

const Add = (props) => {
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { hideModal } = props;
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  });

  const formik = useFormik({
    initialValues: {
      channelName: '',
      channel: {},
    },
    onSubmit: () => {
      console.log('fffff')
      if (formik.values.channelName !== '') {
        const newChannel = { id: _.uniqueId(), channelName: formik.values.channelName, removable: true, currentUser };
        dispatch(addChannels(newChannel));
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
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => hideModal()}>
            Отменить
          </Button>
          <Button
            variant="primary"
            type="submit"
            value="submit"
          >
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default Add;
// END