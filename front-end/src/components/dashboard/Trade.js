import React, { Component } from 'react';
import OrderBook from './OrderBook';
import TradingViewWidget from 'react-tradingview-widget';
import ReactInterval from 'react-interval';
import axios from 'axios';
import Loading from '../functions/Loading';
import { API_SERVER } from '../../constants';

export default class Trade extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_market: 1,
            coinamount: 0,
            usdamount: 0,
            deposit_cn: "deposit_container",
            deposit_type: "btc",
            dialog_cn: "dialog_container",
            orderowner: null,
            btcaddr: "",
            loaded: true,
            orders: []
        }

        this.handleMarketChange = this.handleMarketChange.bind(this);
        this.interval_func = this.interval_func.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleTrade = this.handleTrade.bind(this);
    }

    handleMarketChange(market) {
        this.setState({selected_market: market});
    }

    handleAmountChange(amount, type) {
        if(type == "coin") {
            if(this.state.selected_market == 1) {
                this.setState({coinamount: amount});
                this.setState({usdamount: (amount * this.props.coin2usd[this.props.selected_coin]).toFixed(2)});            
            } else if(this.state.selected_market == 2) {
                this.setState({coinamount: amount});
            }
        } else if(type == "usd") {
            if(this.state.selected_market == 2) {
                this.setState({usdamount: amount});
                this.setState({coinamount: (amount / this.props.coin2usd[this.props.selected_coin]).toFixed(5)});                
            } else if(this.state.selected_market == 1) {
                this.setState({usdamount: amount});
            }
        }
    }

    handleTrade() {
        let symbol = "";
        if(this.state.selected_market == 1) {
            this.setState({
                deposit_cn: "deposit_container active",
                deposit_type: "usd"
            });
            symbol = "USD" + this.props.selected_coin.substring(0, 3).toUpperCase();
        } else if(this.state.selected_market == 2) {
            this.setState({
                deposit_cn: "deposit_container active",
                deposit_type: "btc"
            });
            symbol = this.props.selected_coin.substring(0, 3).toUpperCase() + "USD";
        }

        this.setState({loaded: false});
        let playload = {
            symbol: symbol,
            coinamount: this.state.coinamount,
            usdamount: this.state.usdamount
        };
        axios.post(API_SERVER + '/api/v1/neworder', playload)
        .then((data) => {
            let results = data.data;
            alert(results.status);
            axios.get(API_SERVER + '/api/v1/orders')
            .then((data) => {
                let results = data.data;
                this.setState({orders: results});
                this.setState({loaded: true});
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    interval_func(coin) {
        axios.get("https://api.coinmarketcap.com/v1/ticker/")
            .then(response => {
                var data = response.data;
                var coin2usd = {
                    btcusd: data[0].price_usd,
                    btc_volume_24h: data[0].percent_change_24h,
                    ethusd: data[1].price_usd,
                    eth_volume_24h: data[1].percent_change_24h,
                    xrpusd: data[2].price_usd,
                    xrp_volume_24h: data[2].percent_change_24h,
                    bchusd: data[3].price_usd,
                    bch_volume_24h: data[3].percent_change_24h
                };
                this.props.handleCoinChange(coin2usd);
            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.interval_func()
        this.setState({loaded: false});
        axios.get(API_SERVER + '/api/v1/get/btc/addr')
            .then((data) => {
                this.setState({btcaddr: data.data.address});
                axios.get(API_SERVER + '/api/v1/orders')
                    .then((data) => {
                        let results = data.data;
                        this.setState({
                            orders: results,
                            loaded: true
                        });
                    })
                    .catch(err => console.log(err));
            })
            .catch((err) => {console.log(err)});
    }

	render() {
		return(
            <div>
                <div className="row" id="main" >
                    <div className="row">
                        <div className="col-sm-7 col-md-7 col-xm-12 contentdiv">
                            <div className="graph_section">
                                <TradingViewWidget symbol={"BITFINEX:" + this.props.selected_coin.substring(0, 3).toUpperCase() + "USD"} />
                            </div>
                        </div>
                        <div className="col-sm-5 col-md-5 col-xm-12 contentdiv">
                            <div className="price_section">
                                <div className="row">
                                    <div className="price_area">
                                        <div className="col-lg-6 col-md-6">
                                            <div id="price_area_post">
                                                <h1>{this.props.coin2usd[this.props.selected_coin]} USD</h1>
                                                <p>{this.props.selected_coin.substring(0, 3).toUpperCase()} Price</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <h1>{this.props.coin2usd[this.props.selected_coin.substring(0, 3) + "_volume_24h"]} %</h1>
                                            <p>24 Hr Volume</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="buysell_section">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12">
                                        <div id='cssmenu'>
                                            <ul>
                                                <li className={this.state.selected_market == 1 ? "active" : ""}
                                                    onClick={() => this.handleMarketChange(1)}>
                                                    <a href='javascript:(0);'>Buy</a></li>
                                                <li className={this.state.selected_market == 2 ? "active" : ""}
                                                    onClick={() => this.handleMarketChange(2)}>
                                                    <a href='javascript:(0);'>Sell</a></li>
                                            </ul>
                                        </div>
                                        <div className="marketform">
                                            <div className="">
                                                <label className="marketcurtl">Amount of {this.props.selected_coin.substring(0, 3).toUpperCase()}</label>
                                                <input 
                                                    className="bitcoinform" 
                                                    type="number" 
                                                    nmaxlength="30"
                                                    value={this.state.coinamount} 
                                                    onChange={(e) => this.handleAmountChange(e.target.value, "coin")}
                                                />
                                                <span className="curtitle">{this.props.selected_coin.substring(0, 3)}</span>
                                            </div>
                                            <div className="">
                                                <label className="marketcurtl">USD</label>
                                                <input 
                                                    className="bitcoinform" 
                                                    type="number" 
                                                    nmaxlength="30" 
                                                    value={this.state.usdamount} 
                                                    onChange={(e) => this.handleAmountChange(e.target.value, "usd")}
                                                />
                                                <span className="curtitle">usd</span>
                                            </div>
                                            <button type="submit" className="btn marketbutton" onClick={() => this.handleTrade()}>
                                                {this.state.selected_market == 1 ? "Buy" : "Sell"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <OrderBook 
                    orders={this.state.orders}
                    user_id={this.props.user_id}
                />
                <ReactInterval timeout={36000} enabled={true} callback={() => this.interval_func()} />
                <Loading loaded={this.state.loaded} />
            </div>
		);
	}
}

Trade.defaultProps = {
    selected_coin: "btcusd"
}