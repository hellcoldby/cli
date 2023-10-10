import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "tdesign-react/es/style/index.css";
import { BrowserRouter } from "react-router-dom";
i

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
