import React, { Component } from 'react';
import StartPage from './StartPage';
import Dashboard from '../dashboard/Dashboard';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import { API_SERVER } from '../../constants';

export default class LandPage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
	  			<Route exact path="/" component={StartPage} />
	  			<Route path="/dashboard" component={Dashboard} />
  			</div>
		);
	}
}
