import React, { Component } from "react";
import { connect } from "react-redux";
import { selectExchange } from "../store/actions/exchangeActions";

import ExchangeList from "./ExchangeList";
import firebase from "../config/fbConfig";

class Exchanges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedExchange: "",
      updatedAt: null
    };

    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    // const db = firebase.firestore();
    const db = firebase.database();

    const mentionsPromise = new Promise((resolve, reject) => {
      // db.collection("mentions")
      //   .orderBy("timestamp", "desc")
      //   .get()
      db.ref("mentions")
        .orderByChild("timestamp")
        .limitToLast(1)
        .once("value")
        .then(snapshot => {
          // let latestMention = snapshot.docs[0];
          resolve(snapshot.val()[Object.keys(snapshot.val())[0]]);
        })
        .catch(err => {
          reject(err);
        });
    });

    const mention = await mentionsPromise;
    const date = await new Date(mention.timestamp);
    const yr = await date.getFullYear();
    const month = (await date.getMonth()) + 1;
    const day = await date.getDate();
    const hr = await date
      .getHours()
      .toString()
      .padStart(2, "0");
    const min = await date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    await this.setState({
      ...this.state,
      updatedAt: `${yr}-${month}-${day} ${hr}:${min}(UTC+09)`
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedCoin !== this.props.selectedCoin) {
      this.props.selectExchange(this.props.exchanges[0].name);
    }
  }
  handleClick(e, data) {
    this.setState(
      {
        selectedExchange: data.content
      },
      () => {
        this.props.selectExchange(this.state.selectedExchange);
      }
    );
  }
  render() {
    const { exchanges, selectedExchange, selectedCoinNameKo } = this.props;
    const announcementLink = (function(exchange) {
      switch (exchange) {
        case "Upbit":
          return "https://upbit.com/service_center/notice";
        case "Bitsonic":
          return "https://bitsonic.co.kr/cs/notice";
        case "Coinbit":
          return "https://www.coinbit.co.kr/customer/main";
        case "Bithumb":
          return "https://cafe.bithumb.com/view/boards/43";
        default:
          return null;
      }
    })(this.props.selectedExchange);
    const coinpanLink = `https://coinpan.com/?error_return_url=%2Ffree&vid=&mid=free&act=IS&is_keyword=${selectedCoinNameKo}`;
    return (
      <div className="exchanges">
        <ExchangeList
          exchanges={exchanges}
          selectedExchange={selectedExchange}
          handleClick={this.handleClick}
        />
        <div className="exchanges-lower-section">
          <a
            className="announcement-link"
            href={`${announcementLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/icon_announcement.svg" alt="announcement" />
          </a>
          <a
            className="community-link"
            href={coinpanLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/icon_document.svg" alt="community" />
          </a>
          <a className="refresh-link" href=".">
            <img src="/images/icon_refresh.svg" alt="refresh" />
          </a>
          <span className="recent-update">
            {this.state.updatedAt !== null
              ? `최근 업데이트 ${this.state.updatedAt}`
              : "-"}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedExchange: state.exchange.selectedExchange,
    exchanges: state.coin.exchanges,
    selectedCoin: state.coin.selectedCoin,
    selectedCoinNameKo: state.coin.selectedCoinNameKo
  };
};

const mapDispatch = dispatch => {
  return {
    selectExchange: exchange => dispatch(selectExchange(exchange))
  };
};

export default connect(
  mapStateToProps,
  mapDispatch
)(Exchanges);
