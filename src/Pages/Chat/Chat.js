import React from "react";
import LoginString from "../Login/LoginStrings";
import firebase from "../../services/firebase";
import "./Chat.css";
import ReactLoading from "react-loading";
import { fabClasses } from "@mui/material";
import ChatBox from "../ChatBox/ChatBox";
import WelcomeBoard from "../Welcome/Welcome";
import moment from "moment";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isOpenDialogConfirmLogout: false,
      currentPeerUser: null,
      displayedContactSwitchedNotification: [],
      displayedContacts: [],
    };
    this.currentUserName = localStorage.getItem(LoginString.Name);
    this.currentUserId = localStorage.getItem(LoginString.ID);
    this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL);
    this.currentUserDocumentId = localStorage.getItem(
      LoginString.FirebaseDocumentId
    );

    this.currentUserMessages = [];
    this.searchUsers = [];
    this.notificationMessagesErase = [];
    this.onProfileClick = this.onProfileClick.bind(this);
    this.getListUser = this.getListUser.bind(this);
    this.renderListUser = this.renderListUser.bind(this);
    this.getClassnameforUserandNotification =
      this.getClassnameforUserandNotification.bind(this);
    this.notificationErase = this.notificationErase.bind(this);
    this.updaterenderList = this.updaterenderList.bind(this);
  }

  logout = () => {
    firebase.auth().signOut();
    this.props.history.push("/");
    localStorage.clear();
  };
  onProfileClick = () => {
    this.props.history.push("/profile");
  };
  componentDidMount() {
    firebase.firestore
      .collection("users")
      .doc(this.currentUserDocumentId)
      .get()
      .then((doc) => {
        doc.data().messages.map((item) => {
          this.currentUserMessages.push({
            NotificationId: item.NotificationId,
            number: item.number,
          });
        });
        this.setState({
          displayedContactSwitchedNotification: this.currentUserMessages,
        });
      });
    this.getListUser();
  }
  getListUser = async () => {
    const result = await firebase.firestore().collection("users").get();
    if (result.doc.length > 0) {
      let listUsers = [];
      listUsers = [...result.docs];
      listUsers.forEach((item, index) => {
        this.searchUsers.push({
          key: index,
          documentKey: item.Id,
          id: item.data().id,
          name: item.data().name,
          messages: item.data().messages,
          URL: item.data().URL,
          description: item.data().description,
        });
      });
      this.setState({
        isLoading: false,
      });
    }
    this.renderListUser();
  };
  getClassnameforUserandNotification = (itemId) => {
    let number = 0;
    let className = "";
    let check = false;
    if (
      this.state.currentPeerUser &&
      this.state.currentPeerUser.id === itemId
    ) {
      className = "viewWrapItemfocused";
    } else {
      this.state.displayedContactSwitchedNotification.forEach((item) => {
        if (item.NotificationId.length > 0) {
          if (item.NotificationId === itemId) {
            check = true;
            number = item.number;
          }
        }
      });
      if (check === true) {
        className = "viewWrapItemNotification";
      } else {
        className = "viewWrapItem";
      }
    }
    return className;
  };
  notificationErase = (itemId) => {
    this.state.displayedContactSwitchedNotification.forEach((el) => {
      if (el.notification.length > 0) {
        if (el.notification !== itemId) {
          this.notificationMessagesErase.push({
            NotificationId: el.notification,
            number: el.number,
          });
        }
      }
    });
    this.updaterenderList();
  };
  updaterenderList = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.currentUserDocumentId)
      .update({ messages: this.notificationMessagesErase });
    this.setState({
      displayedContactSwitchedNotification: this.notificationMessagesErase,
    });
  };

  renderListUser = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.displayedContacts.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
              }}
            >
              <img className="viewAvatarItem" src={item.URL} alt="" />
              <div className="viewWrapcontentItem">
                <span className="textItem">{"Name : ${item.name}"}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationparagraph">
                  <p id={item.key} className="newmessages">
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No User is Present");
    }
  };

  searchHandler = (event) => {
    let SearchQuery = event.target.value.toLowerCase(),
      displayedContacts = this.searchUsers.filter((el) => {
        let SearchValue = el.name.toLowerCase();
        return (SearchValue.indexOf(SearchQuery) !== -1);
      });
    this.displayedContacts = displayedContacts;
    this.displaySearchedContacts();
  };
  displaySearchedContacts = () => {
    if (this.searchUsers.length > 0) {
      let viewListUser = [];
      let classname = "";
      this.displayedContacts.map((item) => {
        if (item.id !== this.currentUserId) {
          classname = this.getClassnameforUserandNotification(item.id);
          viewListUser.push(
            <button
              id={item.key}
              className={classname}
              onClick={() => {
                this.notificationErase(item.id);
                this.setState({ currentPeerUser: item });
                document.getElementById(item.key).style.backgroundColor =
                  "#fff";
                document.getElementById(item.key).style.color = "#fff";
              }}
            >
              <img className="viewAvatarItem" src={item.URL} alt="" />
              <div className="viewWrapcontentItem">
                <span className="textItem">{"Name : ${item.name}"}</span>
              </div>
              {classname === "viewWrapItemNotification" ? (
                <div className="notificationparagraph">
                  <p id={item.key} className="newmessages">
                    New messages
                  </p>
                </div>
              ) : null}
            </button>
          );
        }
      });
      this.setState({
        displayedContacts: viewListUser,
      });
    } else {
      console.log("No User is Present");
    }
  };
  render() {
    return (
      <div className="root">
        <div className="body">
          <div className="viewListUser">
            <div className="profileviewleftside">
              <img
                className="ProfilePicture"
                alt=""
                src={this.currentUserPhoto}
                onClick={this.onProfileClick}
              />
              <button className="Logout" onClick={this.logout}></button>
            </div>
            <div className="rootsearchbar">
              <div className="input-container">
                <i className="fa fa-search-icon"></i>
                <input
                  className="input-field"
                  type="text"
                  onChange={this.searchHandler}
                />
              </div>
            </div>
            {this.state.displayedContacts}
          </div>
          <div className="viewBoard">
            {this.state.currentPeerUser ? (
              <ChatBox
                currentPeerUser={this.state.currentPeerUser}
                showToast={this.props.showToast}
              />
            ) : (
              <WelcomeBoard
                currentUserName={this.currentUserName}
                currentUserPhoto={this.currentUserPhoto}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
