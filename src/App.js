import React from "react";
import Header from "components/Header";
import DisplayWrapper from "components/DisplayWrapper";
import { CssBaseline } from "@material-ui/core";

const App = ({ children }) => {
  return (
    <div className="App">
      <CssBaseline />
      <Header />
      <DisplayWrapper />
      <main className="Main">{children}</main>
    </div>
  );
};

export default App;
