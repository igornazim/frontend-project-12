import { useContext } from 'react';

import SocketContext from '../contexts/socket';

const useApi = () => useContext(SocketContext);

export default useApi;
