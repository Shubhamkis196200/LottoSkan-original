import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./Helpers/setAuthToken";
import { loadUser } from "./actions/authActions";
import { deleteAllAlert } from "./actions/alertAction";
// import "../public/css/style2.css";
const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const ForgotPassword = React.lazy(() => import("./views/Pages/ForgotPassword"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

class App extends Component {
  componentWillMount() {
    store.dispatch(loadUser());
    store.dispatch(deleteAllAlert());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route
                exact
                path="/login"
                name="Login Page"
                render={(props) => <Login {...props} />}
              />
              <Route
                exact
                path="/forgot-password"
                name="Forgot Password Page"
                render={(props) => <ForgotPassword {...props} />}
              />
              <Route
                exact
                path="/register"
                name="Register Page"
                render={(props) => <Register {...props} />}
              />
              <Route
                exact
                path="/404"
                name="Page 404"
                render={(props) => <Page404 {...props} />}
              />
              <Route
                exact
                path="/500"
                name="Page 500"
                render={(props) => <Page500 {...props} />}
              />
              <Route
                path="/"
                name="Home"
                component={DefaultLayout}
                render={(props) => <DefaultLayout {...props} />}
              />
            </Switch>
          </React.Suspense>
        </Router>
      </Provider>
    );
  }
}

export default App;
