import { useSelector } from 'react-redux';

const renderModal = (getModal) => {
  const modalType = useSelector((state) => state.modalsReducer.type);
  if (!modalType) {
    return null;
  }
  const Component = getModal(modalType);
  return (
    <Component />
  );
};

export default renderModal;
