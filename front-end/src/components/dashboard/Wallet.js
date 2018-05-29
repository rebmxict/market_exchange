import React, { Component } from 'react';
import Loading from '../functions/Loading';
import axios from 'axios';
import { API_SERVER } from '../../constants';

export default class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_cur: 1,
            selected_edit: 0,
            loaded: true,
            wallet: {
                bank: 0,
                btc: 0,
                eth: 0,
                xrp: 0,
                bch: 0,
                available_coins: []
            },
        }

        this.getWallet = this.getWallet.bind(this);
    }

    getWallet() {
        this.setState({loaded: false});
        axios.get(API_SERVER + '/api/v1/get/wallet')
        .then((data) => {
            let results = data.data;
            this.setState({
                wallet: results,
                loaded: true
            });
        })
        .catch(err => console.log(err));
    }

    componentDidMount() {
        this.getWallet();
    }

	render() {
        const coin_wallets = (coins) => {
            return coins.map((coin, i) => {
                return (
                    <tr>
                        <td>
                            <div className="currency-cell">
                                <img className="cell-icon" src={"/img/" + coin + ".png"} alt="Bitcoin" width="20px" height="20px" />
                                <span>{coin.toUpperCase()}</span>
                            </div>
                        </td>
                        <td>
                            <h5 className="card-text-big">
                                {this.state.wallet ? this.state.wallet[coin] : 0} {" " + coin.toUpperCase()}
                            </h5>
                        </td>
                        <td>
                            <h5 className="card-text-big">
                                {this.state.wallet ? (this.state.wallet[coin] * this.props.coin2usd[coin + "usd"]).toFixed(2) : 0} USD
                            </h5>
                        </td>
                        <td className="deposit-btn-cell">
                            <i className="material-icons">cloud_upload</i>
                            <span>Withdraw</span>
                        </td>
                    </tr>
                );
            });
        }

		return(
            <div className="walletpage">
                <div className="row orderbook" id="main">
                    <div className="row rowdiv">
                        <div className="card-header">USD Wallet</div>
                        <div className="card-body-cover">
                            <div className="card-body col-md-6">
                                <h6 className="card-body-heading marB5">Wallet Balance</h6>
                                <ul className="row card-text-list">
                                    <li className="col-md-6 marT10">
                                        <h5 className="card-text-list-heading ng-binding">{"$" + this.state.wallet.bank}</h5>
                                    </li>
                                    <li className="col-md-6 marT10">
                                    </li>
                                </ul>
                                <div className="row">
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <button className="btn marketbutton">Withdraw Money </button>
                                    </div>
                                    <div className="col-lg-6 col-md-12 col-sm-12">
                                        <button className="btn marketbutton">Deposit Money</button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body col-md-6">
                                <ul className="card-text-list">
                                    <li className="row marT20 align-items-center">
                                        <p className="col-xl-5 col-sm-4 marB0">Company Name</p>
                                        <div className="editdivcover">
                                            <input 
                                                className={this.state.selected_edit == 2 ? "active" : ""}
                                                type="text" 
                                                value={"MarketExchange. Ltd"}
                                            />
                                            <i className="material-icons">
                                                {this.state.selected_edit == 2 ? "done" : "mode_edit"}
                                            </i>
                                        </div>
                                    </li>
                                    <li className="row marT20 align-items-center">
                                        <p className="col-xl-5 col-sm-4 marB0">Bank Name</p>
                                        <div className="editdivcover">
                                            <input 
                                                className={this.state.selected_edit == 3 ? "active" : ""}
                                                type="text" 
                                                value={"Bank of San Francisco"}
                                            />
                                            <i className="material-icons">
                                                {this.state.selected_edit == 3 ? "done" : "mode_edit"}
                                            </i>
                                        </div>
                                    </li>
                                    <li className="row marT20 align-items-center">
                                        <p className="col-xl-5 col-sm-4 marB0">Account Number</p>
                                        <div className="editdivcover">
                                            <input 
                                                className={this.state.selected_edit == 4 ? "active" : ""}
                                                type="text" 
                                                value={"405786394685"}
                                            />
                                            <i className="material-icons">
                                                {this.state.selected_edit == 4 ? "done" : "mode_edit"}
                                            </i>
                                        </div>
                                    </li>
                                    <li className="row marT20 align-items-center">
                                        <p className="col-xl-5 col-sm-4 marB0">Swift Code</p>
                                        <div className="editdivcover">
                                            <input 
                                                className={this.state.selected_edit == 5 ? "active" : ""}
                                                type="text" 
                                                value={"BOFAUS6S"}
                                            />
                                            <i className="material-icons">
                                                {this.state.selected_edit == 5 ? "done" : "mode_edit"}
                                            </i>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row orderbook" id="main">
                    <div className="row rowdiv">
                        <div className="card-header">COIN Wallet</div>
                        <table className="full-width btcwallet">
                            <tbody>
                                { coin_wallets(this.state.wallet.available_coins) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Loading loaded={this.state.loaded} />
            </div>
		);
	}
}

Wallet.defaultProps = {
    btcusd: 0
}