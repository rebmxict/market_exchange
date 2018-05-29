import React, { Component } from 'react';
import { Link, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Trade from './Trade';
import Wallet from './Wallet';
import Profile from './Profile';

export default class BoardBody extends Component {
    constructor(props) {
        super(props);

        this.state = {
            interval: null,
            coin2usd: {
                btcusd: 0,
                ethusd: 0,
                xrpusd: 0,
                bchusd: 0,
                btc_volume_24h: 0,
                eth_volume_24h: 0,
                xrp_volume_24h: 0,
                bch_volume_24h: 0
            },
            selected_coin: "btcusd"
        }

        this.handleMenuChange = this.handleMenuChange.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);
        this.handleCoinSelect = this.handleCoinSelect.bind(this);
    }

    handleMenuChange(menu) {
        this.props.handleMenuChange(menu);
    }

    handleCoinChange(coin2usd) {
        this.setState({coin2usd: coin2usd});
    }

    handleCoinSelect(selected) {
        this.setState({selected_coin: selected});
    }

    componentDidMount() {
        if(window.location.href.includes('trade')) {
            this.props.handleMenuChange(1);
        } else if(window.location.href.includes('wallet')) {
            this.props.handleMenuChange(2);
        } else if(window.location.href.includes('profile')) {
            this.props.handleMenuChange(4);
        }
    }

	render() {
        const arrow_up_template = (<i className="material-icons">arrow_drop_up</i>);
        const arrow_down_template = (<i className="material-icons">arrow_drop_down</i>);
		return(
            <section>
                <div className="pull-left tabs_area top_exchange_items">
                    <ul>
                        <li onClick={() => this.handleCoinSelect("btcusd")}>
                            <div className="item1">
                                <span className="text bold-font ng-binding">BTC/USD</span><br />
                                <span className="increment-value ng-binding">{this.state.coin2usd.btcusd}</span>
                            </div>
                            <div className="item2">
                                <small className="increment-percent medium-font ng-binding"> 
                                    {this.state.selected_coin == "btcusd" ? arrow_down_template : arrow_up_template}
                                    <span>{this.state.coin2usd.btc_volume_24h}</span>
                                </small>
                            </div>
                        </li>
                        <li onClick={() => this.handleCoinSelect("ethusd")}>
                            <div className="item1">
                                <span className="text bold-font ng-binding">ETH/USD</span><br />
                                <span className="increment-value ng-binding">{this.state.coin2usd.ethusd}</span>
                            </div>
                            <div className="item2">
                                <small className="increment-percent medium-font ng-binding"> 
                                    {this.state.selected_coin == "ethusd" ? arrow_down_template : arrow_up_template}
                                    <span>{this.state.coin2usd.eth_volume_24h}</span>
                                </small>
                            </div>
                        </li>
                        <li onClick={() => this.handleCoinSelect("xrpusd")}>
                             <div className="item1">
                                <span className="text bold-font ng-binding">XRP/USD</span><br />
                                <span className="increment-value ng-binding">{this.state.coin2usd.xrpusd}</span>
                            </div>
                            <div className="item2">
                                <small className="increment-percent medium-font ng-binding"> 
                                    {this.state.selected_coin == "xrpusd" ? arrow_down_template : arrow_up_template}
                                    <span>{this.state.coin2usd.xrp_volume_24h}</span>
                                </small>
                            </div>
                        </li>
                        <li onClick={() => this.handleCoinSelect("bchusd")}>
                            <div className="item1">
                                <span className="text bold-font ng-binding">BCH/USD</span><br />
                                <span className="increment-value ng-binding">{this.state.coin2usd.bchusd}</span>
                            </div>
                            <div className="item2">
                                <small className="increment-percent medium-font ng-binding"> 
                                    {this.state.selected_coin == "bchusd" ? arrow_down_template : arrow_up_template}
                                    <span>{this.state.coin2usd.bch_volume_24h}</span>
                                </small>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="page-wrapper" className="rightside">
                    <div className="leftside">
                        <div className="leftside_inner">
                            <ul className="nav navbar-nav side-nav">
                                <li onClick={() => this.handleMenuChange(1)}
                                    className={this.props.selected_menu == 1 ? "leftside_active" : ""}>
                                    <Link to="/dashboard/trade"><i className="material-icons">perm_media</i><br />
                                        <span> Trade </span></Link> 
                                </li>
                                <li onClick={() => this.handleMenuChange(2)}
                                    className={this.props.selected_menu == 2 ? "leftside_active" : ""}>
                                    <Link to="/dashboard/wallet"><i className="material-icons">developer_board</i><br />
                                        <span> Wallet </span></Link> 
                                </li>
                                <li onClick={() => this.handleMenuChange(4)}
                                    className={this.props.selected_menu == 4 ? "leftside_active" : ""}>
                                    <Link to="/dashboard/profile"><i className="material-icons">perm_identity</i><br />
                                        <span> Profile </span></Link> 
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <Route 
                            path="/dashboard/trade" 
                            render={() => (<Trade 
                                                coin2usd={this.state.coin2usd} 
                                                handleCoinChange={this.handleCoinChange} 
                                                user_id={this.props.user_id}
                                                selected_coin={this.state.selected_coin}
                                            />)}
                        />
                        <Route path="/dashboard/wallet" render={() => (<Wallet coin2usd={this.state.coin2usd} />)} />
                        <Route path="/dashboard/profile" render={() => (<Profile />)} />
                    </div>
                </div>
            </section>
		);
	}
}

BoardBody.defaltProps = {
    selected_menu: 0,
    user_id: 0
};