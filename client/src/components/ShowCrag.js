import React, { Component } from 'react';
import axios from 'axios';
import PicPlaceholder from '../assets/images/crack.jpeg';
// import { FaPencilAlt } from 'react-icons/fa';

export default class ShowCrag extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	async fetchData() {
		const response = await axios
			.get('http://localhost:4000/')
			.then((result) => {
				this.setState({ crags: result, loaded: true });
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		return response;
	}

	render() {
		return (
			<div>
				<h2>Title Goes Here</h2>

				{!this.state.loaded && (
					<img src={PicPlaceholder} alt='crack climber' width='150' />
				)}
				{this.state.loaded && (
					<img
						// src={`uploads/${this.props.cragInfo.photo}`}
						alt='cragImage'
					/>
				)}
				<h4>Crag Description Goes Here</h4>
				<h3>Difficulty</h3>
				{/* <div>
					<a href={`/crags/${this.props.cragInfo._id}/edit`}>
						<FaPencilAlt
							onClick={this.passIdToSingleCrag}
							style={{ color: 'black' }}
						/>
					</a>
				</div> */}
			</div>
		);
	}
}
