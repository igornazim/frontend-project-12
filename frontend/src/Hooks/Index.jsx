
import { useContext } from 'react';

import authContext from '../Contexts/Index.jsx';

const useAuth = () => useContext(authContext);

export default useAuth;