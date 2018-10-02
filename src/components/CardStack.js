import React from 'react';
import API from '../api/api';
import Card from '../components/Card';

export default class CardStack extends React.Component {  
  state = {
    cards: [],
    selected: ''
  }
  
  componentDidMount() {
    window.ee.addListener('removeCards', this.remove.bind(this));
    this.draw(this.props.count);
  }

  componentWillUnmount() {
    window.ee.removeListener('removeCards', this.remove);
  }

  // Draw x num of cards from card API
  draw(count) {
    var vm = this;
    API.get(this.props.deckid + '/draw/?count=' + count)
      .then(function (res) {
        vm.setState({cards: res.data.cards});
      }).catch(function (error) {console.log(error);})
  }

  // Observer to remove top card by card code
  remove(card1, card2) {
    if (this.top().code === card1 || this.top().code === card2) {
      this.removeTopCard();
    }
  }

  // Removes card by index
  removeCard(index) {
    this.setState({
      cards: this.state.cards.filter((_, i) => i !== index)
    });
  }

  // Removes the card on top of the stack
  removeTopCard() {
    let index = this.state.cards.length - 1;
    let vm = this;
    this.setState({
      cards: this.state.cards.filter((_, i) => i !== index)
    });    
    // Wait for animation to finish
    setTimeout(function() {
      vm.setState({selected: ''});
    }, 500);
  }

  // Returns top card
  top() {
    if (this.state.cards.length) {
      return this.state.cards[this.state.cards.length-1]
    } else {
      return [];
    }
  }

  // Click on card event
  selectCard() {
    this.setState({selected: this.top().code});
    this.props.selected(this.top().code);
  }

  // Show me the stacks! 💵
  render() {
    return (
      this.state.cards && this.state.cards.length
      ? <div className='cardStack'>
          <Card onClick={this.selectCard.bind(this)} data={this.top()} />
          <small className='cardCount'>{this.state.cards.length}</small>
        </div>
      : ""
    );
  }
}
