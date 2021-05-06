import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./routes/Home";
import "./App.css";


function App() {
  return (
    <div className="whole-app">
      <Router>
        <Switch>
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
