import { useContext } from 'react';

import apiContext from '../contexts/useApi';

const useApi = () => useContext(apiContext);

export default useApi;
