import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Dimmer, Loader } from "semantic-ui-react";

class Orderbook extends Component {
  constructor(props) {
    super(props);
    this.state = { isHidden: false };

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(state => ({
      isHidden: !state.isHidden
    }));
  }
  render() {
    const { orderbookData, tradesData } = this.props;
    let ask = orderbookData ? orderbookData.aggOrders.aggAsks : 1;
    let bid = orderbookData ? orderbookData.aggOrders.aggBids : 1;

    let totalOrders = ask + bid;
    let bidWidth = { width: `${Math.round((bid / totalOrders) * 100)}%` };
    let askWidth = { width: `${Math.round((ask / totalOrders) * 100)}%` };
    let divClass = this.props.selectedExchange === "Coinbit" ? "hidden" : "";

    let askTrades = tradesData ? tradesData.aggAsks : 1;
    let bidTrades = tradesData ? tradesData.aggBids : 1;
    let totalTrades = askTrades + bidTrades;
    let askTradesWidth = {
      width: `${Math.round((askTrades / totalTrades) * 100)}%`
    };
    let bidTradesWidth = {
      width: `${Math.round((bidTrades / totalTrades) * 100)}%`
    };
    let content =
      orderbookData.isFetching || tradesData.isFetching ? (
        <Dimmer active inverted>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
      ) : (
        <div>
          <h4>최근 3분 체결 비율</h4>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidTradesWidth}>
                {bidTrades ? bidTrades.toFixed(4) : null}
              </div>
              <div className="ask bar" style={askTradesWidth}>
                {askTrades ? askTrades.toFixed(4) : null}
              </div>
            </div>
          </div>
          <h4>매수 : 매도</h4>
          <div className="orderbook-chart">
            <div className="bars">
              <div className="bid bar" style={bidWidth}>
                {bid ? bid.toFixed(4) : null}
              </div>
              <div className="ask bar" style={askWidth}>
                {ask ? ask.toFixed(4) : null}
              </div>
            </div>
          </div>
        </div>
      );
    return (
      <div className={`${divClass} orderbook content-wrapper`}>
        <div className="content-header" onClick={this.handleClick}>
          매수/매도 비율
          {this.state.isHidden ? (
            <Icon name="triangle up" />
          ) : (
            <Icon name="triangle down" />
          )}
        </div>
        <div className={this.state.isHidden ? "content hidden" : "content"}>
          {content}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    orderbookData: state.exchange.orderbookData,
    tradesData: state.exchange.tradesData,
    selectedExchange: state.exchange.selectedExchange
  };
};

export default connect(mapStateToProps)(Orderbook);
