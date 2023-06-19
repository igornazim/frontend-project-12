import { Modal, Form, Button, FormGroup } from 'react-bootstrap';
import { removeChannel, channelsSelector } from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from "../../hooks/useSocket.jsx";

const Remove = (props) => {
  const channels = useSelector(channelsSelector.selectAll);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { hideModal, modalInfo, setId } = props;

  const onSubmit = (e) => {
    e.preventDefault();
    setId(channels[0].id);
    socket.emit('removeChannel', { id: modalInfo.channel.id });
    socket.on('removeChannel', (payload) => {
    dispatch(removeChannel(payload.id));
    });
    hideModal();
  };

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => hideModal()}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={(e) => onSubmit(e)}>
          <p className="lead">Уверены?</p>
          <FormGroup className="d-flex justify-content-end">
            <Form.Label className="visually-hidden">Уверены?</Form.Label>
            <Button
              variant="secondary"
              onClick={() => hideModal()}
              className="me-2"
            >
              Отменить
            </Button>
            <Button
              className="btn btn-danger me-2"
              variant="primary"
              type="submit"
              value="remove"
            >
            Удалить
          </Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
// END