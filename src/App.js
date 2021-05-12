import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/home";
// import ClassRoom from "./common/delCodeTemp/classRoomDel";
import ClassRoom from "./pages/classRoom.jsx";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/share" component={Login} />
          <Route exact path="/class" component={ClassRoom} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
