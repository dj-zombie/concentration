import React from 'react';
import API from '../api/api';

export default class Dealer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picks: []
    }
    this.drop = new Audio('bleep.ogg');
    this.cheer = new Audio('cheer.wav');
    window.ee.addListener('pick', this.pickCard.bind(this))
  }

  componentWillUnmount() {
    window.ee.removeListener('pick', this.pickCard);
  }
  
  // Player picks 1 of 2 cards
  pickCard(card) {
    if (this.state.picks.length === 1) {
      this.setState({picks: this.state.picks.concat([card])});
      let vm = this;
      setTimeout(function(){
        vm.compareCards();      
      },100);
    } else {
      this.setState({picks: this.state.picks.concat([card])});
    }
  }

  // Event emitter to remove player card selection
  removeSelection() {
    let vm = this;
    setTimeout(function() {
      vm.setState({picks: []});
      window.ee.emitEvent('removeSelection');
    },400)
  }

  // Compares the 2 cards in the current selection
  compareCards() {
    let card1 = this.state.picks[0].code.split('')[0]
    let card2 = this.state.picks[1].code.split('')[0]
    let code1 = this.state.picks[0].code;
    let code2 = this.state.picks[1].code
    // We have a match!
    if (card1 === card2) {
      this.cheer.play();
      window.ee.emitEvent('removeCards', [code1, code2]);
      API.get(this.props.deckId + '/pile/discard/add/?cards=' + code1 + ',' + code2)
        .then(function (res) {
          window.ee.emitEvent('updateBoard')
        }).catch(function (error) {console.log(error);})
    }
    // Cards don't match 😭
    else {
      let vm = this;
      var obj = this.props.board.find(function (obj) { 
        return (obj.code === code1) || (obj.code === code2); 
      });
      if (obj) {
        // Wait for animation for finish
        setTimeout(function() {
          vm.setState({picks: []});        
          window.ee.emitEvent('removeSelection');
          window.ee.emitEvent('updateBoard')  
        }, 500);
        return;
      }
      // Send to board pile
      API.get(this.props.deckId + '/pile/board/add/?cards=' + code1 + ',' + code2)
        .then(function (res) {
          window.ee.emitEvent('updateBoard')
          vm.drop.play();
        }).catch(function (error) {console.log(error);})
      window.ee.emitEvent('removeCards', [code1, code2]);      
    }
    this.removeSelection();
  }

  render() {
    return (
      <div className='pick'>
        <ul>
          {this.state.picks.map(function(card, index){
            return <li key={index}><img className='card' src={card.image} alt='card' /></li>;
          })}
        </ul>
      </div>
    );
  }
}