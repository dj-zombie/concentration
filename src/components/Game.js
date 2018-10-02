import React from 'react';
import GameBoard from './GameBoard';
import Dealer from './Dealer';
import API from '../api/api';
import Card from './Card';
import { CSSTransitionGroup } from 'react-transition-group'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: '',
      cards: [],
      discard: []
    }
    this.getDeckId();
    window.ee.addListener('updateBoard', this.getCards.bind(this))
    this.shallWe = new Audio('Shall-we-play-a-game.mp3');        
    this.shallWe.play();
  }

  componentWillUnmount() {
    window.ee.removeListener('updateBoard', this.getCards);
  }

  // Creates a new deck and returns the deck id
  getDeckId() {
    var vm = this;    
    API.get('/new/shuffle/?deck_count=1')
      .then(function (response) {
        vm.setState({deckId: response.data.deck_id});
      }).catch(function (error) {console.log(error);})
  }

  // Get discarded cards from discard pile API
  getDiscard() {
    var vm = this;    
    API.get(this.state.deckId + '/pile/discard/list')
      .then(function (res) {
        if (res.data.piles.discard) { 
          vm.setState({discard: res.data.piles.discard.cards})
          vm.didPlayerWin();
        }
      }).catch(function (error) {console.log(error);})
  }

  // Get cards from board pile API
  getCards() {
    let vm = this;
    API.get(vm.state.deckId + '/pile/board/list')
      .then(function (res) {
        vm.setState({cards: res.data.piles.board.cards})
      }).catch(function (error) {console.log(error);})  
    this.getDiscard();
  }

  // Checks if player wins and asks to play again
  didPlayerWin() {
    if (this.state.discard && this.state.discard.length === 52) {
      let playAgain = window.confirm('You WIN! Play Again?')
      if (playAgain) {
        window.ee.emitEvent('restart');
      }
    }
  }

  render() {
    return (
      <div className='game'>
        <img className='logo' src='logo.png' alt='card' />
        <GameBoard deckId={this.state.deckId} />
        <div className='text-left'>
          <CSSTransitionGroup
            transitionName="card"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {this.state.cards.map(function(card, index){
              return <Card data={card} key={index} />;
            })}
          </CSSTransitionGroup>
        </div>
        <Dealer board={this.state.cards} deckId={this.state.deckId} />        
      </div>
    );
  }
}
