import React, { Component } from 'react';
import axios from 'axios';

export default class OrderBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected_ordertype: 1
        }

        this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
    }

    handleOrderTypeChange(ordertype) {
        this.setState({
            selected_ordertype: ordertype
        });
    }

	render() {
        const my_orders = (orders) => {
            let my_orders = [];
            orders.map((order, i) => {
                if(order.user_id == this.props.user_id)
                    my_orders.push(order);
            });
            return my_orders;
        }

        const date_converter = (epoch) => {
            let date = new Date(epoch);
            return date.toString();
        };

        const m_a_buy_orders = (orders) => {
            return orders.map((order, i) => {
                if(order.user_id == this.props.user_id && order.symbol.substring(0, 3) == "USD") {
                    return (
                        <tr key={i}>
                            <td>{order.created_at}</td>
                            <td>{order.symbol}</td>
                            <td>{(order.usdamount * (1 / order.coinamount)).toFixed(2)}</td>
                            <td>{order.coinamount}</td>
                            <td>{order.usdamount}</td>
                            <td>{date_converter(order.created_at)}</td>
                            <td>{order.status}</td>
                        </tr>
                    );
                }       
            });
        }

        const m_a_sell_orders = (orders) => {
            return orders.map((order, i) => {
                if(order.user_id == this.props.user_id && order.symbol.substring(3, 6) == "USD") {
                    return (
                        <tr key={i}>
                            <td>{order.created_at}</td>
                            <td>{order.symbol}</td>
                            <td>{((order.usdamount / order.usdamount) * order.coinamount).toFixed(8)}</td>
                            <td>{order.usdamount}</td>
                            <td>{order.coinamount}</td>
                            <td>{date_converter(order.created_at)}</td>
                            <td>{order.status}</td>
                        </tr>       
                    );
                }       
            });
        }

        const o_b_buy_orders = (orders) => {
            return orders.map((order, i) => {
                if(order.symbol.substring(0, 3) == "USD") {
                    return (
                        <tr key={i}>
                            <td>{order.symbol}</td>
                            <td>{(order.usdamount * (1 / order.coinamount)).toFixed(2)}</td>
                            <td>{order.coinamount}</td>
                            <td>{order.usdamount}</td>
                        </tr>       
                    );
                }       
            });
        }

        const o_b_sell_orders = (orders) => {
            return orders.map((order, i) => {
                if(order.symbol.substring(3, 6) == "USD") {
                    return (
                        <tr key={i}>
                            <td>{order.symbol}</td>
                            <td>{((1 / order.usdamount) * order.coinamount).toFixed(8)}</td>
                            <td>{order.usdamount}</td>
                            <td>{order.coinamount}</td>
                        </tr>       
                    );
                }       
            });
        }

		return(
            <div>
                <div className="row orderbook" id="main">
                    <div className="row rowdiv">
                        <div className="card-header">My Active Orders</div>
                        <div id='cssmenu'>
                            <ul>
                                <li className={this.state.selected_ordertype == 1 ? "active" : ""}
                                    onClick={() => this.handleOrderTypeChange(1)}>
                                    <a href='javascript:(0);'>Buy Orders</a>
                                </li>
                                <li className={this.state.selected_ordertype == 2 ? "active" : ""}
                                    onClick={() => this.handleOrderTypeChange(2)}>
                                    <a href='javascript:(0);'>Sell Orders</a>
                                </li>
                            </ul>
                        </div>
                        <div className="orderbookcover">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Pair</th>
                                        <th>
                                            {this.state.selected_ordertype == 1 ? "Price per COIN" : "Price per USD"}
                                        </th>
                                        <th>
                                            {this.state.selected_ordertype == 1 ? "COIN quantity" : "USD quantity"}
                                        </th>
                                        <th>
                                            {this.state.selected_ordertype == 1 ? "USD quantity" : "COIN quantity"}
                                        </th>
                                        <th>Issued Date</th>
                                        <th>Status</th>
                                    </tr>
                                    {this.state.selected_ordertype == 1 ? 
                                        m_a_buy_orders(this.props.orders) : 
                                        m_a_sell_orders(this.props.orders)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="row orderbook" id="main">
                    <div className="row rowdiv">
                        <div className="card-header">Order Book</div>
                        <div>
                            <div className="col-md-6 col-xm-12">
                                <p className="caption">Buy Orders</p>
                                <div className="orderbookcover">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Pair</th>
                                                <th>Price per COIN</th>
                                                <th>COIN quantity</th>
                                                <th>Total USD</th>
                                            </tr>
                                            {o_b_buy_orders(this.props.orders)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-md-6 col-xm-12">
                                <p className="caption">Sell Orders</p>
                                <div className="orderbookcover">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>Pair</th>
                                                <th>Price per USD</th>
                                                <th>USD quantity</th>
                                                <th>Total COIN</th>
                                            </tr>
                                            {o_b_sell_orders(this.props.orders)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}

OrderBook.defaultProps = {
    orders: [],
    user_id: 0
}