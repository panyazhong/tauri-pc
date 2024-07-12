import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./containers/login";
import Trade from "./containers/trade";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <HashRouter>
    <App>
      <Routes>
        <Route path="/" element={<Trade />} />
        <Route path="login" element={<Login />} />
        <Route path="trade" element={<Trade />} />
      </Routes>{" "}
    </App>
  </HashRouter>
);
