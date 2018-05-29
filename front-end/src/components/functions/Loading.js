import React, { Component } from 'react';
import Loader from 'react-loader';

export default class Loading extends Component {
    constructor(props) {
        super(props);
    }

	render() {
        const options = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 30,
            scale: 1.00,
            corners: 1,
            color: '#fff',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            top: '50%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };

		return(
            <div className={this.props.loaded ? "loading_container" : "loading_container active"}>
                <Loader loaded={this.props.loaded} options={options} className="spinner" />
            </div>
		);
	}
}

Loading.defaultProps = {
    loaded: false
}