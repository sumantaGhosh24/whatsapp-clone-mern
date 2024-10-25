import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import ChatProvider from "./context/chat-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <App />
        <ToastContainer />
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
