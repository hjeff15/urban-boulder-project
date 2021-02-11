import React, { Component } from 'react';
import axios from 'axios';
import StaticMap from './StaticMap';
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
			.get(`http://localhost:4000${this.props.location.pathname}`)
			.then((result) => {
				if (!result.data) {
					this.props.history.push('/404');
				} else {
					this.setState({ crag: result, loaded: true });
				}
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
				{this.state.loaded && (
					<div>
						<a
							href={`/crag/${this.state.crag.data.slug}`}
							alt={`${this.state.crag.data.cragName}`}
						>
							<h2>{this.state.crag.data.cragName}</h2>
						</a>
						<StaticMap
							coordinates={
								this.state.crag.data.location.coordinates
							}
						/>
						<img
							src={`/images/${this.state.crag.data.photo}`}
							alt='crag'
							width={400}
						/>
						<h3>{this.state.crag.data.difficulty}</h3>
						<p>{this.state.crag.data.cragDescription}</p>
						{this.state.crag.data.busyWeekend ? (
							<p>Busy At The Weekend</p>
						) : null}
						{this.state.crag.data.avoidRush ? (
							<p>Avoid During Rush Hour</p>
						) : null}
						{this.state.crag.data.freeAllDay ? (
							<p>Free All Day Long</p>
						) : null}
					</div>
				)}
			</div>
		);
	}
}
