import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API_SERVER, AUTH0_API_ENDPOINT, AUTH0_API_TOKEN } from '../../constants';
import axios from 'axios';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
            email: this.props.email,
            isCollapsed: 0,
            isminimenuap: 0
		}

        this.handleCollapseChange = this.handleCollapseChange.bind(this);
        this.handleMinmenuClick = this.handleMinmenuClick.bind(this);
	}

    componentDidMount() {
        this.setState({isCollapsed: 0});
    }

    handleCollapseChange() {
        this.setState({
            isCollapsed: (this.state.isCollapsed + 1) % 2
        });
    }

    handleMinmenuClick(val, menu) {
        this.setState({
            isminimenuap: val
        });

        if(menu != 0) {
            this.props.handleMenuChange(menu);
        }
    }

	render() {
		return(
            <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div className="row header_row">
                    <div className="col-lg-4 col-md-4 header_right">
                        <div className=" pull-right header_balance">
                        </div>
                        <div className=" pull-right header_balance">
                            <ul className="nav navbar-right top-nav">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" 
                                        onClick={() => this.handleCollapseChange()}>
                                        My Account <b className={this.state.isCollapsed ? "fa fa-angle-down" : "fa fa-angle-up"}></b>
                                    </a>
                                    <ul className={this.state.isCollapsed ? "dropdown-menu collapse_active" : "dropdown-menu"}>
                                        <li>{this.props.email}</li>
                                        <li><a href='/logout'>Log Out</a></li>
                                    </ul>
                                </li>
                                <li><a href="#" data-placement="bottom" data-original-title="Stats" className="inform_icon">
                                    <i className="material-icons">error_outline</i></a>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i className="material-icons">notifications_active</i></a>
                                    <ul className="dropdown-menu" id="diff_lastchaild">
                                        <li><a href="#">  Your KYC has been approved</a></li>
                                        <li><a href="#">  Your KYC has been disapproved</a></li>
                                        <li><a href="#"> Your KYC has been approved</a></li>
                                        <li><a href="#">  Your KYC has been disapproved</a></li>
                                        <li><a href="#">  View All</a></li>
                                    </ul>
                                </li>
                                <li className="dropdown minmenu">
                                    <i className="material-icons" onClick={() => this.handleMinmenuClick(1, 0)}>menu</i>
                                    <div className={this.state.isminimenuap ? "minimenu active" : "minimenu"}>
                                        <Link to="/dashboard/trade" className=""
                                            onClick={() => this.handleMinmenuClick(0, 1)}>Trade</Link>
                                        <Link to="/dashboard/wallet" className=""
                                            onClick={() => this.handleMinmenuClick(0, 2)}>Wallet</Link>
                                        <Link to="/dashboard/inbox" className=""
                                            onClick={() => this.handleMinmenuClick(0, 3)}>Inbox</Link>
                                        <Link to="/dashboard/profile" className=""
                                            onClick={() => this.handleMinmenuClick(0, 4)}>Profile</Link>
                                        <a href="javascript:(0);" onClick={() => this.handleMinmenuClick(0, 0)}>Close</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-8 header_left">
                        <Link to="/" className="pull-left inner_logo_area"> <img src="/img/logo-icon.png" width="33" height="33"/> </Link>
                    </div>
                </div>
            </nav>
		);
	}
}

Header.defaultProps = {
    email: ""
}