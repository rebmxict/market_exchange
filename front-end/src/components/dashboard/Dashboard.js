import React, { Component } from 'react';
import axios from 'axios';
import { API_SERVER } from '../../constants';
import { Link } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import BoardBody from './BoardBody';
import '../../css/stylesheet.css';

export default class LandPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			user_id: 0,
			selected_menu: 0
		};

		this.handleMenuChange = this.handleMenuChange.bind(this);
	}

	componentDidMount() {
	    axios
	    .get(API_SERVER + '/api/v1/userself')
	    .then((data) => {
			var results = data.data;
			if(results.email == "") {
				alert("Unauthorized");
				window.location.href = "/";
			} else {
				this.setState({
					email: results.email,
					user_id: results.user_id
				});
			}
		})
		.catch(error => {
		    alert("Something wrong in userself");
	    });
	}

	handleMenuChange(val) {
		this.setState({
			selected_menu: val
		});
	}

	render() {
		return (
	        <div id="wrapper" className="dashboard_container">
	        	<Header 
	        		email={this.state.email}
	        		handleMenuChange={this.handleMenuChange} 
	        		selected_menu={this.state.selected_menu}
	        	/>
	            <BoardBody
	            	handleMenuChange={this.handleMenuChange}
	            	selected_menu={this.state.selected_menu}
	            	user_id={this.state.user_id}
	            />
	            <Footer />
	        </div>
		);
	}
}
