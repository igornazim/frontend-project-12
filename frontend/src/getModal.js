import Add from './components/popups/Add';
import Rename from './components/popups/Rename';
import Remove from './components/popups/Remove';

const modals = {
  adding: Add,
  renaiming: Rename,
  removing: Remove,
};

export default (modalName) => modals[modalName];
