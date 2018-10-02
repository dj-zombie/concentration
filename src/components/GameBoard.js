import React from 'react';
import CardStack from './CardStack';

export default class GameBoard extends React.Component {  
  render() {
    return (
      this.props.deckId
      ? <div>        
          <CardStack deckid={this.props.deckId} count={13} />
          <CardStack deckid={this.props.deckId} count={13} />
          <CardStack deckid={this.props.deckId} count={13} />
          <CardStack deckid={this.props.deckId} count={13} />
        </div>
      : "Loading..."
    );
  }
}
