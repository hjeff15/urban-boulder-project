import React, { Component } from 'react';
import PicPlaceholder from '../assets/images/crack.jpeg';
import { FaPencilAlt } from 'react-icons/fa';

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

	passIdToSingleCrag(e) {
		console.log(e);
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

				{!this.state.loaded && (
					<img src={PicPlaceholder} alt='crack climber' width='150' />
				)}
				{this.state.loaded && (
					<img
						src={`uploads/${this.props.cragInfo.photo}`}
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
				<div>
					<a href={`/crags/${this.props.cragInfo._id}/edit`}>
						<FaPencilAlt
							onClick={this.passIdToSingleCrag}
							style={{ color: 'black' }}
						/>
					</a>
				</div>
			</div>
		);
	}
}
