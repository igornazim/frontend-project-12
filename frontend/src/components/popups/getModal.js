import Add from './Add';
import Rename from './Rename';
import Remove from './Remove';

const modals = {
  adding: Add,
  renaiming: Rename,
  removing: Remove,
};

export default (modalName) => modals[modalName];
