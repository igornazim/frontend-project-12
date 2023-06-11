import { useContext } from "react";

import authContext from "../contexts/Index.jsx";

const useAuth = () => useContext(authContext);

export default useAuth;
