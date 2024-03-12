import React, { Component } from "react";
import {
  BrowserRouter,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Chat from "./Pages/Chat/Chat";
import Profile from "./Pages/Profile/Profile";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import { toast, ToastContainer } from "react-toastify";

class App extends Component {
  showToast = (type, message) => {
    switch (type) {
      case 0:
        toast.warning(message);
        break;
      case 1:
        toast.success(message);
      default:
        break;
    }
  };

  render() {
    return (
      <Router>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position={toast.POSITION.BOTTOM_CENTER}
        />
        <BrowserRouter>
          <Route exact path="/" render={(props) => <Home {...props} />} />

          <Route
            path="/login"
            render={(props) => <Login showToast={this.showToast} {...props} />}
          />

          <Route
            path="/Profile"
            render={(props) => (
              <Profile showToast={this.showToast} {...props} />
            )}
          />

          <Route
            path="/Signup"
            render={(props) => <Signup showToast={this.showToast} {...props} />}
          />

          <Route
            path="/Chat"
            render={(props) => <Chat showToast={this.showToast} {...props} />}
          />
        </BrowserRouter>
      </Router>
    );
  }
}

export default App;
