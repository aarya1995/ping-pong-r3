import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';

class App extends Component {
  componentDidMount() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCSkIUx6iTEKYx4Kr1NQMVQ2C5SsHSImu4",
      authDomain: "ping-pong-r3.firebaseapp.com",
      databaseURL: "https://ping-pong-r3.firebaseio.com",
      projectId: "ping-pong-r3",
      storageBucket: "",
      messagingSenderId: "220243026482",
      appId: "1:220243026482:web:47b84b7da31d28d2"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // fetch initial data in database and log to console
    firebase.database().ref('/ping-pong-table/Usage/')
        .orderByKey()
        .on('value', snapshot => {
          console.log(snapshot.val());
        });
  }

  render() {
    return (
        <div>
          <h1 className="loading-text">Checking the ping pong database</h1>
          <div className="spinner">
            <svg className="raquet" id="r-1">
              <ellipse className="front" cx="44" cy="50" rx="35" ry="50" />
              <ellipse className="middle" cx="42" cy="50" rx="35" ry="50" />
              <ellipse className="back" cx="40" cy="50" rx="35" ry="50" />
              <rect className="handle outer" x="40" y="100" width="10" height="42" />
              <rect className="handle inner" x="38" y="100" width="10" height="41" />
              <rect className="handle outer" x="35" y="100" width="10" height="40" />
              <ellipse className="shadow" id="sor-1" cx="40" cy="50" rx="7" ry="10" />
            </svg>
            <svg className="raquet" id="r-2">
              <ellipse className="back" cx="40" cy="50" rx="35" ry="50" />
              <ellipse className="middle" cx="42" cy="50" rx="35" ry="50" />
              <ellipse className="front" cx="44" cy="50" rx="35" ry="50" />
              <rect className="handle outer" x="35" y="100" width="10" height="42" />
              <rect className="handle inner" x="37" y="100" width="10" height="41" />
              <rect className="handle outer" x="40" y="100" width="10" height="40" />
              <ellipse className="shadow" id="sor-2" cx="44" cy="50" rx="7" ry="10" />
            </svg>
            <div className="ball-container">
              <svg className="ball">
                <circle cx="20" cy="20" r="12" />
              </svg>
            </div>
            <svg className="shadow">
              <ellipse id="sr-1" cx="70" cy="30" rx="50" ry="15"/>
              <ellipse id="sb" cx="150" cy="30" rx="15" ry="4.5"/>
              <ellipse id="sr-2" cx="230" cy="30" rx="50" ry="15"/>
            </svg>
          </div>
        </div>
    );
  }
}

export default App;
