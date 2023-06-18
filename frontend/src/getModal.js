import Add from './components/popups/Add.jsx';
import Rename from './components/popups/Rename.jsx';
import Remove from './components/popups/Remove.jsx';

const modals = {
  adding: Add,
  renaiming: Rename,
  removing: Remove,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (modalName) => modals[modalName];
