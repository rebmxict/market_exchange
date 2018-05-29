import React, { Component } from 'react';

export default class Footer extends Component {
	render() {
		return(
            <div className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12">
                            <a href="#" style={{"font-size": "30px", "color": "#e0e0e0", "font-weight": "bold"}}>M.Exchange</a>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer_post">
                                <h4>Menu</h4>
                                <ul>
                                    <li><a ui-sref="trading" target="_blank" href="#">Trading</a></li>
                                    <li><a href="#">How</a></li>
                                    <li><a ui-sref="about" target="_blank" href="#">About Us</a></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Contact us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer_post">
                                <h4>Information</h4>
                                <ul>
                                    <li><a href="#">Payment Options</a></li>
                                    <li><a href="#">Fee Schedule</a></li>
                                    <li><a href="#">Getting Started</a></li>
                                    <li><a href="#">Identity Verification Guide</a></li>
                                    <li><a href="#">Card Verification Guide</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3">
                            <div className="footer_post">
                                <h4>Social Network</h4>
                                <ul className="social-icons">
                                    <li><a href="#" className="social-icon fa fa-facebook"></a></li>
                                    <li><a href="#" className="social-icon fa fa-google-plus"></a></li>
                                    <li><a href="#" className="social-icon fa fa-twitter"></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="col-lg-12">
                            <p className="text-center copyright-text">© 2018 MarketExchange owners. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}