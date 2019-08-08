import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';

const VIBRATION_TIME_STAMP_KEY_NAME = 'recorded_vibration_timestamp';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      statusTitle: '',
      isTableInUse: false,
      lastPlayedTimestamp: -1,
      lastTenTimestamps: [],
      loading: true
    };
    this.interval = null;
  }

  componentWillMount() {
    this.setState({statusTitle: 'Checking the ping pong database'});
  }

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
    // -- no real reason why we are fetching 10 results. Maybe to do something with this data later?
    firebase.database().ref('/ping-pong-table/Usage/')
        .limitToLast(10)
        .on('value', snapshot => {
          this.parseFirebaseSnapshot(snapshot);
        });
    this.autoRefreshStatus();
  }

  parseFirebaseSnapshot = async (snapshot) => {
    this.setState({ loading: true });
    // force the loading animation to occur longer - this is more aesthetic for UI purposes.
    await this.sleep(1000);
    const queryResult = snapshot.val();
    let sortedTimeStamps = [];
    Object.keys(queryResult).map((key) => {
      sortedTimeStamps.push(queryResult[key][VIBRATION_TIME_STAMP_KEY_NAME]);
    });
    sortedTimeStamps = sortedTimeStamps.reverse();
    console.log(sortedTimeStamps);
    if (sortedTimeStamps.length >= 1) {
      this.setState({ lastPlayedTimestamp: sortedTimeStamps[0], lastTenTimestamps: sortedTimeStamps, loading: false });
    }
  };

  sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  formatTimeMessage = (timeElapsed) => {
    const minutesElapsed = Math.floor((timeElapsed/1000)/60);
    if (minutesElapsed >= 60) {
      const hoursElapsed = Math.floor((timeElapsed/1000)/3600);
      const minutesDiff = minutesElapsed % 60;
      const hourPluralization = hoursElapsed > 1 ? 'hours' : 'hour';
      const minutesPluralization = minutesDiff === 1 ? 'minute' : 'minutes';
      return `${hoursElapsed} ${hourPluralization} and ${minutesDiff} ${minutesPluralization}`;
    } else {
      const minutesPluralization = minutesElapsed === 1 ? 'minute' : 'minutes';
      return `${minutesElapsed} ${minutesPluralization}`;
    }
  };

  checkTableStatus = () => {
    if (this.state.loading) {
      this.setState({statusTitle: 'Checking the ping pong database'});
    } else {
      const lastRecordedDate = new Date(this.state.lastPlayedTimestamp * 1000);
      const elapsedTime = Math.abs(new Date() - lastRecordedDate);
      const currentTime = Math.abs(new Date());
      const slidingWindow = 60 * 1000 // one minute

      let timeSeries = this.state.lastTenTimestamps
      let recentEvents = timeSeries.filter(x => x > currentTime - slidingWindow)
      const threshold = 2

      if recentEvents.length > threshold {
        this.setState({statusTitle: 'There is a game currently ongoing!'});
      } else {
        this.setState({statusTitle: `The last game occurred ${this.formatTimeMessage(elapsedTime)} ago.`});
      }
    }
  };

  autoRefreshStatus = () => {
    // First check, wait for firebase to init
    setTimeout(() => { this.checkTableStatus() }, 1000 * 2);

    // Refresh statusTitle every 10 sec
    this.interval = setInterval(() => {
      this.checkTableStatus();
    }, 1000 * 10);
  };

  render() {
    return (
        <div>
          <h1 className={this.state.loading ? 'loading-text' : ''}>{this.state.statusTitle}</h1>
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
