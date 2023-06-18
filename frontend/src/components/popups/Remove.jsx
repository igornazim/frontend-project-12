import { Modal, Form, Button, FormGroup } from 'react-bootstrap';
import { removeChannel, channelsSelector } from '../../slices/channelsSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const Remove = (props) => {
  const channels = useSelector(channelsSelector.selectAll);
  // const channelsNames = channels.map(({ name }) => name);
  const dispatch = useDispatch();
  const { hideModal, modalInfo, setId } = props;

  const onSubmit = () => {
    setId(channels[0].id);
    dispatch(removeChannel(modalInfo.channel.id));
  };

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => hideModal()}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <p className="lead">Уверены?</p>
          <FormGroup className="d-flex justify-content-end">
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