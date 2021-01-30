import React, { Component } from 'react';
import axios from 'axios';
import FormError from './FormError';

export default class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cragName: '',
			cragDescription: '',
			difficulty: '',
			location: {
				coordinates: [],
			},
			freeAllDay: false,
			busyWeekend: false,
			avoidRush: false,
			formError: false,
		};
	}

	componentDidMount() {
		if (this.props.cragCardInfo) {
			this.setState({
				cragName: this.props.cragCardInfo.data.cragName,
				cragDescription: this.props.cragCardInfo.data.cragDescription,
				difficulty: this.props.cragCardInfo.data.difficulty,
				location: {
					coordinates: this.props.cragCardInfo.data.location
						.coordinates,
				},
				freeAllDay: this.props.cragCardInfo.data.freeAllDay,
				busyWeekend: this.props.cragCardInfo.data.busyWeekend,
				avoidRush: this.props.cragCardInfo.data.avoidRush,
			});
		} else {
			return;
		}
	}

	onChangeCragName = (e) => {
		this.setState({
			cragName: e.target.value,
		});
	};

	onChangeCragDescription = (e) => {
		this.setState({
			cragDescription: e.target.value,
		});
	};

	onChangeDifficulty = (e) => {
		this.setState({
			difficulty: e.target.value,
		});
	};

	onChangeLocation = (e) => {
		if (e.target.id === 'lng') {
			let location = { ...this.state.location };
			let lng = e.target.value;
			location.coordinates[0] = lng;
			this.setState({ location });
			console.log(this.state.location.coordinates);
		} else {
			let location = { ...this.state.location };
			let lng = e.target.value;
			location.coordinates[1] = lng;
			this.setState({ location });
			console.log(this.state.location.coordinates);
		}
	};

	toggle = (e) => {
		const checkBox = e.target.name;
		if (checkBox === 'allDay') {
			this.setState({
				freeAllDay: !this.state.freeAllDay,
			});
		}
		if (checkBox === 'busyWeekend') {
			this.setState({
				busyWeekend: !this.state.busyWeekend,
			});
		}
		if (checkBox === 'avoidRush') {
			this.setState({
				avoidRush: !this.state.avoidRush,
			});
		}
	};

	onSubmit = (e) => {
		e.preventDefault();

		console.log(`Form submitted:`);
		console.log(`Crag Name: ${this.state.cragName}`);
		console.log(`Crag Description: ${this.state.cragDescription}`);
		console.log(`Difficulty: ${this.state.difficulty}`);
		console.log(`Location: ${this.state.location.coordinates}`);
		console.log(`Free all day? ${this.state.freeAllDay}`);

		const newCrag = {
			cragName: this.state.cragName,
			cragDescription: this.state.cragDescription,
			difficulty: this.state.difficulty,
			location: {
				coordinates: this.state.location.coordinates,
			},
			freeAllDay: this.state.freeAllDay,
			busyWeekend: this.state.busyWeekend,
			avoidRush: this.state.avoidRush,
		};

		if (this.props.postData) {
			const id = this.props.cragCardInfo.data._id;
			this.props.postData(newCrag, id);
		} else {
			axios
				.post('http://localhost:4000/createCrag', newCrag)
				.then((res) => {
					console.log('Slug = ' + res.data.slug);
					this.props.history.push(`/crag/${res.data.slug}`);
					return res.data;
				})
				.catch((err) => {
					console.log(err);
					this.setState({
						formError: true,
					});
				});

			this.setState({
				cragName: '',
				cragDescription: '',
				difficulty: '',
				location: {
					coordinates: [],
				},
				freeAllDay: false,
				busyWeekend: false,
				avoidRush: false,
			});
		}
	};

	render() {
		return (
			<div>
				{this.state.formError && <FormError />}
				<h3>Create a new Crage here!!</h3>
				<form onSubmit={this.onSubmit}>
					<div className='form-group'>
						<label>Crag Name: </label>
						<input
							type='text'
							className='form-control'
							required
							defaultValue={this.state.cragName}
							onChange={this.onChangeCragName}
						/>
					</div>
					<div className='form-group'>
						<label>Crag Description: </label>
						<textarea
							type='text'
							required
							className='form-control'
							defaultValue={this.state.cragDescription}
							onChange={this.onChangeCragDescription}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='location'>Location: </label>
						<div>
							<label htmlFor='lng'>Lng: </label>
							<input
								type='number'
								required
								id='lng'
								defaultValue={
									this.state.location
										? this.state.location.coordinates[0]
										: []
								}
								onChange={this.onChangeLocation}
							/>
							<label htmlFor='lng'>Lat: </label>
							<input
								type='number'
								required
								id='lat'
								defaultValue={
									this.state.location
										? this.state.location.coordinates[1]
										: []
								}
								onChange={this.onChangeLocation}
							/>
						</div>
					</div>
					<div>
						<label htmlFor='grade'>Difficulty: </label>
						<select
							name='grade'
							id='grade'
							required
							value={this.state.difficulty}
							onChange={this.onChangeDifficulty}
						>
							<option>V0</option>
							<option>V1</option>
							<option>V2</option>
							<option>V3</option>
							<option>V4</option>
							<option>V5</option>
							<option>V6</option>
							<option>V7</option>
							<option>V8</option>
							<option>V9</option>
							<option>V10</option>
							<option>V11</option>
							<option>V12</option>
							<option>V13</option>
							<option>V14</option>
							<option>V15</option>
							<option>V16</option>
						</select>
					</div>
					<label htmlFor='allDay'>Free all day and night</label>
					<input
						type='checkbox'
						name='allDay'
						checked={this.state.freeAllDay}
						onChange={this.toggle}
					/>
					<label htmlFor='busyWeekend'>
						Busy at evening and weekends
					</label>
					<input
						type='checkbox'
						name='busyWeekend'
						checked={this.state.busyWeekend}
						onChange={this.toggle}
					/>
					<label htmlFor='avoidRush'>Avoid at the rush hour</label>
					<input
						type='checkbox'
						name='avoidRush'
						checked={this.state.avoidRush}
						onChange={this.toggle}
					/>
					<div className='form-group'>
						<input
							type='submit'
							value={
								this.props.cragCardInfo
									? 'Edit Crag'
									: 'Create Crag'
							}
						/>
					</div>
				</form>
			</div>
		);
	}
}

// See this link for help on photo upload:-
//  https://codepen.io/hartzis/pen/VvNGZP?editors=1010
