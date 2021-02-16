import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import StaticMap from './StaticMap';
import { FaPencilAlt } from 'react-icons/fa';

class ShowCrag extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			msg: '',
		};
	}

	componentDidMount() {
		this.fetchData();
		this.checkMsg();
	}

	// Updates checks to see if a new location has been passed from the SearchBox Component
	componentDidUpdate(prevProp, prevState) {
		console.log('previous Prop:' + prevProp.location.pathname);
		console.log('new prop' + this.props.location.pathname);
		if (this.props.location.pathname !== prevProp.location.pathname) {
			this.fetchData();
		}
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

	checkMsg() {
		return this.props.location.state
			? this.setState({ msg: this.props.location.state.msg })
			: this.setState({ msg: '' });
	}

	render() {
		return (
			<div>
				{this.state.msg && <h2>{this.state.msg}</h2>}
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
						{this.state.crag.data.author === localStorage._id ? (
							<div>
								<a
									href={`/crags/${this.state.crag.data._id}/edit`}
								>
									<FaPencilAlt
										style={{
											color: 'black',
											width: '3em',
											height: '3em',
										}}
									/>
								</a>
							</div>
						) : null}
					</div>
				)}
			</div>
		);
	}
}

export default withRouter(ShowCrag);
