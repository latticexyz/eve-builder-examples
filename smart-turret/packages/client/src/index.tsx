import ReactDOM from "react-dom/client";
import { App } from "./App";
import { sync } from "./mud/sync";

sync();

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
