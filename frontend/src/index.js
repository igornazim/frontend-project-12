import ReactDOM from "react-dom/client";
import "./index.css";
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'));
  root.render(await init());
};

app();