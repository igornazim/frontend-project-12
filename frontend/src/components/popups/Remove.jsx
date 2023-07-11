import {
  Modal,
  Form,
  Button,
  FormGroup,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hideModal } from '../../slices/modalsSlice';
import useApi from '../../hooks/useApi';

const Remove = () => {
  const channel = useSelector((state) => state.modalsReducer.channel);

  const dispatch = useDispatch();
  const { socketEmetWrapper } = useApi();

  const { t } = useTranslation();

  const RemoveChannelNotify = () => {
    toast.success(t('modals.remove.toastText'), {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    socketEmetWrapper('removeChannel', { id: channel.id });
    dispatch(hideModal());
    RemoveChannelNotify();
  };

  return (
    <Modal centered show>
      <Modal.Header closeButton onClick={() => dispatch(hideModal())}>
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
              onClick={() => dispatch(hideModal())}
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
