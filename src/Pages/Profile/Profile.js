import React from "react";
import "./Profile.css";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import firebase from "../../services/firebase";
import images from "../../ProjectImages/ProjectImages";
import LoginString from "../Login/LoginStrings";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
      id: localStorage.getItem(LoginString.ID),
      name: localStorage.getItem(LoginString.Name),
      description: localStorage.getItem(LoginString.Description),
      photoUrl: localStorage.getItem(LoginString.PhotoURL),
    };
    this.newPhoto = null;
    this.newPhotoUrl = "";
  }
  componentDidMount() {
    if (!localStorage.getItem(LoginString.ID)) {
      this.props.history.push("/");
    }
  }

  onChangeNickname = (event) => {
    this.setState({
      name: event.target.value,
    });
  };
  onChangeAboutMe = (event) => {
    this.setState({
      aboutMe: event.target.value,
    });
  };
  onChangeAvatar = (event) => {
    if (event.target.files && event.target.files[0]) {
      const prefixfiletype = event.taret.file[0].type.toString();
      if (prefixfiletype.indexof(LoginString.PREFIX_IMAGE) !== 0) {
        this.props.showToast(0, "This file is not an image");
        return;
      }
      this.newPhoto = event.target.files[0];
      this.setState({ photoUrl: URL.createObjectURL(event.target.files[0]) });
    } else {
      this.props.showToast(0, "something wrong with input file");
    }
  };

  uploadAvatar = () => {
    this.setState({ isLoading: true });
    if (this.newPhoto) {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(this.state.id)
        .put(this.newPhoto);
      uploadTask.on(
        LoginString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      this.updateUserInfo(false, null);
    }
  };
  updateUserInfo = (isUpdatedPhotoURL, downloadURL) => {
    let newinfo;
    if (isUpdatedPhotoURL) {
      newinfo = {
        name: this.state.name,
        Description: this.state.aboutMe,
        URL: downloadURL,
      };
    } else {
      newinfo = {
        name: this.state.name,
        Description: this.state.aboutMe,
      };
      firebase
        .firestore()
        .collection("users")
        .doc(this.state.documentKey)
        .update(newinfo)
        .then((data) => {
          localStorage.setItem(LoginString.Name, this.state.name);
          localStorage.setItem(LoginString.Description, this.state.aboutMe);
        });
    }
  };
  render() {
    return (
      <div className="profileroot">
        <div className="headerprofile">
          <span>PROFILE</span>
        </div>
        <img className="avatar" alt="" src="this.state.photoUrl" />
        <div className="viewWrapInputFile">
          <img
            className="imgInputFile"
            alt="icon gallery"
            src={images.Olajide}
            onClick={() => {
              this.refInput.click();
            }}
          />

          <input
            ref={(el) => (this.refInput = el)}
            accept="images/*"
            className="viewInputFile"
            type="file"
            onChange="this.onChangeAvatar"
          />
        </div>
        <span className="textLabel">Name</span>
        <input
          className="textInput"
          value={this.state.name ? this.state.name : ""}
          placeholder="Your nickname..."
          onChange={this.onChangeNickname}
        />
        <span className="textLabel">About Me</span>
        <input
          className="textInput"
          value={this.state.aboutMe ? this.state.aboutMe : ""}
          placeholder="Tell about yourself..."
          onChange={this.onChangeAboutMe}
        />
        <div>
          <button className="btnupdate" onClick={this.uploadAvatar}>
            SAVE
          </button>
          <button
            className="btnback"
            onClick={() => {
              this.props.history.push("/chat");
            }}
          >
            SAVE
          </button>
        </div>
        {this.state.isLoading ? (
          <div>
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null}
      </div>
    );
  }
}
