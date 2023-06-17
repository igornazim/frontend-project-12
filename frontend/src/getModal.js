import Add from './components/popups/Add.jsx';

const modals = {
  adding: Add,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (modalName) => modals[modalName];
