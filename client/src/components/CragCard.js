import React, { Component } from 'react';
import PicPlaceholder from '../assets/images/crack.jpeg';

export default class CragCard extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		if (this.props.cragInfo.photo) {
			this.setState({
				loaded: true,
			});
		}
	}

	render() {
		return (
			<div>
				<h2>
					<a href={`/crag/${this.props.cragInfo.slug}`}>
						{this.props.cragInfo.cragName
							.split(' ')
							.splice(0, 4)
							.join(' ')}
						...
					</a>
				</h2>

				{!this.props.cragInfo.photo && (
					<img src={PicPlaceholder} alt='crack climber' width='300' />
				)}
				{this.props.cragInfo.photo && (
					<img
						// src={`../assets/images/${this.props.cragInfo.photo}`}
						src={`/images/${this.props.cragInfo.photo}`}
						width={300}
						alt='cragImage'
					/>
				)}
				<h4>
					{this.props.cragInfo.cragDescription
						.split(' ')
						.splice(0, 7)
						.join(' ')}
					...
				</h4>
				<h3>{this.props.cragInfo.difficulty}</h3>
			</div>
		);
	}
}
