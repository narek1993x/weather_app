import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "containers/Home";
import DailyWeather from "containers/DailyWeather";
import WeeklyWeather from "containers/WeeklyWeather";
import store from "store";

export default (
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>
          <Route exact path={"/"} component={Home} />
          <Route path={"/today"} component={DailyWeather} />
          <Route path={"/tomorrow"} render={(props) => <DailyWeather {...props} tomorrow />} />
          <Route path={"/week"} component={WeeklyWeather} />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>
);
