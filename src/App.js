import React, { Component } from 'react';
import Game from './components/Game';
let EventEmitter = require('wolfy87-eventemitter');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restart: false
    }
    let ee = new EventEmitter();
    window.ee = ee;
    ee.addListener('restart', this.restart.bind(this))
  }
  // Restart / New game
  restart() {
    this.setState({restart: !this.state.restart});
  }
  render() {
    return (
      <div key={this.state.restart}>
        <button onClick={this.restart.bind(this)}>New Game</button>
        <Game/>
      </div>
    );
  }
}

export default App;
