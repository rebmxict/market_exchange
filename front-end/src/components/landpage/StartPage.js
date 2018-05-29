import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../css/fonts.css';
import '../../css/main.css';
import { API_SERVER } from '../../constants';
import axios from 'axios';

export default class StartPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selected_menu: 1,
			isAuthenticated: 0
		};

		this.handleMenuClick = this.handleMenuClick.bind(this);
	}

	componentDidMount() {
	    axios
	    .get(API_SERVER + '/api/v1/userself')
	    .then((data) => {
			var results = data.data;
			if(results.email != "") {
				this.setState({isAuthenticated: 1});
			}
		})
		.catch(error => {
		    window.location.href = API_SERVER + "/"
	    });
	}

	handleMenuClick(selected_menu) {
		this.setState({
			selected_menu: selected_menu
		});
	}

	render() {
		const logout = (this.state.isAuthenticated ?
							(<li className="menu_right_item" onClick={() => this.handleMenuClick(7)}>
								<a href="/logout">Log Out</a>
							</li>) : ""
						);

		const register = (!this.state.isAuthenticated ?
							(<li className={this.state.selected_menu == 6 ? "menu_right_item active" : "menu_right_item"}>
								<a href="/login">Register</a>
							</li>) :
							(<li className="menu_right_item">
								<Link to="/dashboard/trade">My Account</Link>
							</li>)
						);

		return (
			<div id="canvas">
				<div id="box_wrapper">
					<header className="page_header header_white">
						<div className="container header_cover">
							<div className="row">
								<div className="col-sm-12 text-center">
									<nav className="mainmenu_wrapper">
										<ul className="mainmenu nav sf-menu">
											<li className={this.state.selected_menu == 1 ? "menu_left_item active" : "menu_left_item"}
												onClick={() => this.handleMenuClick(1)}>
												<a href="#home">Home</a>
											</li>
											<li className={this.state.selected_menu == 2 ? "menu_left_item active" : "menu_left_item"}
												onClick={() => this.handleMenuClick(2)}>
												<a href="#service">Service</a>
											</li>
											<li className={this.state.selected_menu == 3 ? "menu_left_item active" : "menu_left_item"}
												onClick={() => this.handleMenuClick(3)}> 
												<a href="#exchange">Exchange</a> 
											</li>
											<li className={this.state.selected_menu == 4 ? "menu_left_item active" : "menu_left_item"}
												onClick={() => this.handleMenuClick(4)}> 
												<a href="#community">Community</a>
											</li>
											<li className={this.state.selected_menu == 5 ? "menu_left_item active" : "menu_left_item"}
												onClick={() => this.handleMenuClick(5)}>
												<a href="#contact">Contact</a>
											</li>
											{logout}
											{register}
										</ul>
									</nav>
								</div>
							</div>
						</div>
					</header>
					<section className="intro_section page_mainslider ds" id="home">
						<div className="flexslider vertical-nav" data-dots="true" data-nav="false">
							<img src="/img/slide01.jpg" alt="" />
							<div className="container">
								<div className="row">
									<div className="col-sm-12">
										<div className="slide_description_wrapper">
											<div className="slide_description">
												<div className="intro-layer" data-animation="fadeInUp">
													<h2 className="thin"> <span className="grey">Rent,</span><br /> <span className="highlight semibold">Invest</span><br /> <span className="weight-black">&amp; Trade</span> </h2>
												</div>
												<div className="intro-layer" data-animation="fadeInUp">
													<a href="" className="theme_button color2 min_width_button">
														Join us
													</a> 
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section id="service" className="ls ms section_padding_top_150 section_padding_bottom_130 columns_margin_bottom_20">
						<div className="container">
							<div className="row">
								<div className="col-sm-4">
									<div className="teaser text-center step_teaser">
										<div className="teaser_icon hover_scale_icon size_small dashed_border big_wrapper round"> <i className="rt-icon2-user highlight"></i> </div>
										<h4><a href="#0">Verify Your ID</a></h4>
										<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr diam nonumy eirmod tempor invidunt ut labore edolore.</p>
										<div className="canvas-arrow-wrap"> <canvas className="canvas-arrow highlight" width="210" height="23">
									Next step
								</canvas> </div>
									</div>
								</div>
								<div className="col-sm-4">
									<div className="teaser text-center step_teaser">
										<div className="teaser_icon hover_scale_icon size_small dashed_border big_wrapper round"> <i className="rt-icon2-banknote highlight3"></i> </div>
										<h4 className="hover-color3"><a href="#0">Make Payment</a></h4>
										<p>Dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.</p>
										<div className="canvas-arrow-wrap up-side-down"> <canvas className="canvas-arrow highlight3" width="210" height="23">
									Next step
								</canvas> </div>
									</div>
								</div>
								<div className="col-sm-4">
									<div className="teaser text-center step_teaser">
										<div className="teaser_icon hover_scale_icon size_small dashed_border big_wrapper round"> <i className="rt-icon2-paperplane highlight2"></i> </div>
										<h4 className="hover-color2"><a href="#0">Buy or Sell Orders</a></h4>
										<p>At vero eos accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, takimata sanctus est ipsum dolor.</p>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section id="exchange" className="ls section_currency_calculator background_cover section_padding_top_150 section_padding_bottom_150">
						<div className="container">
							<div className="row">
								<div className="col-sm-8 col-md-6 col-lg-5">
									<p className="small-text highlight">Bitcoin</p>
									<h2 className="section_header">Currency Calculator</h2>
									<p className="light">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut laboret dolore magna aliquyam erat, sed diam voluptua.</p>
									<div className="divider_30">
										<script type="text/javascript" src="https://www.cryptonator.com/ui/js/widget/calc_widget.js"></script>
									</div>
									<p> <a href="#0" className="theme_button color1 min_width_button">buy now!</a> </p>
								</div>
							</div>
						</div>
					</section>
					<section id="community" className="ls ms section_advantages background_cover section_padding_top_220 section_padding_bottom_150 columns_margin_bottom_30">
						<div className="container">
							<div className="row">
								<div className="col-md-4 col-sm-6">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight"> <i className="rt-icon2-lock2"></i> </div>
										<h4><a href="">Safe &amp; Secure</a></h4>
										<p>Be sure in your account security and your funds safe.</p>
									</div>
								</div>
								<div className="col-md-4 col-sm-6 col-md-offset-4">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight"> <i className="rt-icon2-bubble"></i> </div>
										<h4><a href="">Experts Support</a></h4>
										<p>Support will answer your questions regarding bitcoins.</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-3 col-sm-6">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight3"> <i className="rt-icon2-phone5"></i> </div>
										<h4 className="hover-color3"><a href="">Mobile Apps</a></h4>
										<p>Perfectly developed mobile apps will open new opportunities.</p>
									</div>
								</div>
								<div className="col-md-3 col-sm-6 col-md-offset-6">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight3"> <i className="rt-icon2-stack4"></i> </div>
										<h4 className="hover-color3"><a href="">Instant Exchange</a></h4>
										<p>Instant Exchange allows you to send bitcoin and pay for it</p>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4 col-sm-6">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight2"> <i className="rt-icon2-wallet2"></i> </div>
										<h4 className="hover-color2"><a href="">Wallet</a></h4>
										<p>Perfectly developed mobile apps will open new opportunities.</p>
									</div>
								</div>
								<div className="col-md-4 col-sm-6 col-md-offset-4">
									<div className="teaser max_width_260 text-center">
										<div className="teaser_icon size_small highlight2"> <i className="rt-icon2-bulb"></i> </div>
										<h4 className="hover-color2"><a href="html/hashcoin/service-single.html">Recuring Buys</a></h4>
										<p>Recurring transaction feature allows you to schedule future</p>
									</div>
								</div>
							</div>
						</div>
					</section>
					<footer id="contact" className="page_footer ds texture_bg section_padding_top_65 section_padding_bottom_65 columns_padding_25 table_section">
					</footer>
					<section className="ls page_copyright section_padding_15">
						<div className="container">
							<div className="row">
								<div className="col-sm-12 text-center">
									<p className="small-text thin">&copy; Copyright 2018. All Rights Reserved.</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}
