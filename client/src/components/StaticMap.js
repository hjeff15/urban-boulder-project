import React, { Component } from 'react';
import styled from 'styled-components';

const MapImageContainer = styled.div`
	grid-area: map;
	display: grid;
`;

const MapImage = styled.img`
	justify-self: center;
	align-self: center;
	object-fit: cover;
	width: 100%;
	height: 95%;
	border-radius: 5px;
	@media (max-width: 900px) {
		width: 100%;
	}
	@media (max-width: 400px) {
		height: 20vh;
	}
`;

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
			<MapImageContainer>
				<MapImage
					src={`https://maps.googleapis.com/maps/api/staticmap?center=${this.state.lng},${this.state.lat}&zoom=${this.state.zoom}&size=${this.state.size}&key=${process.env.REACT_APP_MAP_KEY}&markers=${this.state.lng},${this.state.lat}&scale=${this.state.scale}`}
					alt='location'
				/>
			</MapImageContainer>
		);
	}
}
