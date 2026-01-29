import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { AppRouter } from "./router/AppRouter";
import { store } from "./store/store";
import "./styles.css";
import { RealtimeEventsListener } from "./realtime/RealtimeEventsListener";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <>
        <RealtimeEventsListener />
        <AppRouter />
      </>
    </Provider>
  </React.StrictMode>
);

