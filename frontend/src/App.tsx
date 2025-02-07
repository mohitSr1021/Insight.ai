import React from "react";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <React.Fragment>
      <Analytics />
      <Outlet />
    </React.Fragment>
  );
};
export default App;
