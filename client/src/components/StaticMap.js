import React, { Component } from 'react';

export default class StaticMap extends Component {
	constructor() {
		super();
		this.state = {
			zoom: 14,
			size: '800x150',
			scale: 2,
			loaded: false,
		};
	}

	componentDidMount() {
		this.setState({
			lng: this.props.coordinates[1],
			lat: this.props.coordinates[0],
		});
	}

	render() {
		return (
			<div>
				<p>Something Here...</p>
				<img
					src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lng},${this.state.lat}&zoom=${this.state.zoom}&size=${this.state.size}&key=${process.env.REACT_APP_MAP_KEY}&markers=${this.state.lng},${this.state.lat}&scale=${this.state.scale}`}
					alt='location'
				/>
			</div>
		);
	}
}
