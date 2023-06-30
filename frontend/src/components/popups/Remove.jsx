import {
  Modal,
  Form,
  Button,
  FormGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  removeChannel,
  setCurrentChannelId,
} from '../../slices/channelsSlice.js';
import useSocket from '../../hooks/useSocket.jsx';

const RemoveChannelNotify = () => {
  toast.success('Канал удалён', {
    position: toast.POSITION.TOP_RIGHT,
  });
};

const Remove = (props) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { hideModal, modalInfo } = props;

  const { t } = useTranslation();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(setCurrentChannelId(1));
    socket.emit('removeChannel', { id: modalInfo.channel.id });
    socket.on('removeChannel', (payload) => {
      dispatch(removeChannel(payload.id));
    });
    hideModal();
    RemoveChannelNotify();
  };

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => hideModal()}>
        <Modal.Title>{t('modals.remove.headline')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={(e) => onSubmit(e)}>
          <p className="lead">Уверены?</p>
          <FormGroup className="d-flex justify-content-end">
            <Form.Label className="visually-hidden">
              {t('modals.remove.subText')}
            </Form.Label>
            <Button
              variant="secondary"
              onClick={() => hideModal()}
              className="me-2"
            >
              {t('modals.remove.cancelButton')}
            </Button>
            <Button
              className="btn btn-danger me-2"
              variant="primary"
              type="submit"
              value="remove"
            >
              {t('modals.remove.submitButton')}
            </Button>
          </FormGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
// END
