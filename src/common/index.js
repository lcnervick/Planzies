import React from "react";
import ReactDOM from "react-dom/client";
//redux
import { Provider } from "react-redux";
import store from "./store/store";
//router
import { RouterProvider } from "react-router-dom";
import { router } from './routes/routes'


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider route={router} />
    </Provider>
  </React.StrictMode>,
);
