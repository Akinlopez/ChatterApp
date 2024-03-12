import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../services/firebase";
import LoginString from "../Login/LoginStrings";
import "./Login.css";
import { Card } from "react-bootstrap";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from "@mui/material/Typography";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, 
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  componentDidMount() {
    if (localStorage.getItem(LoginString.ID)) {
      this.setState({ isLoading: false }, () => {
        this.props.showToast(1, 'Login success');
        this.props.history.push('./chat');
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      let user = result.user;
      if (user) {
        const querySnapshot = await firebase.firestore().collection('users')
          .where('id', "==", user.uid)
          .get();

        querySnapshot.forEach((doc) => {
          const currentdata = doc.data();
          localStorage.setItem(LoginString.FirebaseDocumentId, doc.id);
          localStorage.setItem(LoginString.ID, currentdata.id);
          localStorage.setItem(LoginString.Name, currentdata.name);
          localStorage.setItem(LoginString.Email, currentdata.email);
          localStorage.setItem(LoginString.Password, currentdata.password);
          localStorage.setItem(LoginString.PhotoURL, currentdata.URL);
          localStorage.setItem(LoginString.Description, currentdata.description);
        });

        this.props.history.push("./chat");
      }
    } catch (error) {
      this.setState({
       errorMessage: "incorrect email/password or poor network"
      });
    }
  }

  render() {
    // Styles moved inside render for clarity; consider moving to external CSS for performance
    const { error, email, password } = this.state;

    return (
      <Grid container component="main" className="root">
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className="image" />
        <Grid item xs={12} sm={8} md={5} component={Card} elevation={6} square>
          <div className="paper">
            <Avatar className="avatar">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className="form" noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={email}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={this.handleChange}
                value={password}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {error && <Typography color="error">{error}</Typography>}
              <button className="submit" type="submit">
                Sign In
              </button>
              <Grid container>
                <Grid item>
                  <Link to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <div className="error">
                <p id="1" style={{color:'red'}}></p>
              </div>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}
