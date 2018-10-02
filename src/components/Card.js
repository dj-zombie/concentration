import React from 'react';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: this.props.data,
      selected: false
    }
    this.swoosh = new Audio('woosh.wav');
    window.ee.addListener('removeSelection', this.removeSelection.bind(this))
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.ee.removeListener('removeSelection', this.removeSelection);
  }

  // Get card data through props
  componentWillReceiveProps(props) {
    if (props.data !== this.state.card) {
      this.setState({card: this.props.data});
    }
  }

  // Select card when player clicks
  handleClick() {
    if (!this.state.selected) {
      window.ee.emitEvent('pick', [this.state.card]);
      this.setState({selected: true});
      this.swoosh.play();
    }
  }

  // Event listener to remove card selection
  removeSelection() {
    this.setState({selected: false}); 
  }

  render() {
    return ( 
      this._isMounted
      ? <img className={"card bounce-in-top" + (this.state.selected ? 'selected flip-scale-up-ver' : '')}
          onClick={this.handleClick.bind(this)}
          src={(this.state.selected ? '/cards/' + this.state.card.code + '.png' : '/playing-card-back.png')}
          alt="card"/>
      : ''
    );
  }
}
