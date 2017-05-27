import React, { Component } from 'react';
import uuidV1 from 'uuid/v1';

export default class ItemsList extends Component {
  constructor(props) {
    super(props);

    this.renderItems = this.renderItems.bind(this);
  }

  renderItems() {
    const items = this.props.items;
    
    if (!items || items.items.length === 0) return;

    const goods = items.items;
    return goods.map(item => {
      return (
        <div className="item" key={uuidV1()}>
          <img src={`https://steamcommunity-a.akamaihd.net/economy/image/class/570/${item.classId}/48fx32f`} alt={item.name} />
          <div className="item-price">${item.price / 100}</div>
        </div>  
      );
    });
  }

  render() {
    return (
      <div className="items-list">
        {this.renderItems()}
      </div>
    );
  }
}