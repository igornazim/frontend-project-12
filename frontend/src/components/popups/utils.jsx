import { useSelector } from 'react-redux';

const Modal = (props) => {
  const { getModal } = props;
  const modalType = useSelector((state) => state.modalsReducer.type);
  if (!modalType) {
    return null;
  }
  const Component = getModal(modalType);
  return (
    <Component />
  );
};

export default Modal;
