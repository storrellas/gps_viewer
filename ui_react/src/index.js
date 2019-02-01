import React from "react";
import ReactDOM from "react-dom";
import Login from "./js/Login.js";
import Map from "./js/Map.js";
import Chart from "./js/Chart.js";
import { BrowserRouter, Route, Link } from "react-router-dom";


ReactDOM.render((
  <BrowserRouter>
    <div>
      <Route path="/ui/" exact component={Login} />
      <Route path="/ui/map/" component={Map} />
      <Route path="/ui/chart/" component={Chart} />
    </div>
  </BrowserRouter>
), document.getElementById('root'))
