import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { BetsBlock } from './BetsBlock.jsx';
import { RouletteBlock } from './RouletteBlock.jsx';
import { ChatBlock } from './ChatBlock.jsx';

import { Messages } from '../../api/messages/messages';
import { Games } from '../../api/games/games';
import { Bets } from '../../api/bets/bets';
import { Winners } from '../../api/winners/winners';

class Home extends Component {
  render() {
    return (
      <div className="main-full">
        <div className="main">
          <BetsBlock bets={this.props.bets} games={this.props.games} winners={this.props.winners} />
          <RouletteBlock game={this.props.game} bets={this.props.bets} winners={this.props.winners} />
          <ChatBlock user={this.props.user} messages={this.props.messages} />
        </div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('Meteor.users.public');
  Meteor.subscribe('messages.public');
  Meteor.subscribe('games.public');
  Meteor.subscribe('bets.public');
  Meteor.subscribe('winners.public');

  return {
    user: Meteor.user(),
    messages: Messages.find({}, { sort: { time: -1 }, limit: 20 }).fetch(),
    game: Games.findOne({ status: { $ne: 'end' }}),
    games: Games.find().fetch(),
    bets: Bets.find().fetch(),
    winners: Winners.find().fetch()
  };
}, Home);