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
			photo: null,
			photoPreviewURL: {},
			photoLoaded: false,
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
				photo: this.props.cragCardInfo.data.photo,
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
		if (e.target.id === 'lat') {
			let location = { ...this.state.location };
			let lat = parseFloat(e.target.value);
			location.coordinates[1] = lat;
			this.setState({ location });
		} else {
			let location = { ...this.state.location };
			let lng = parseFloat(e.target.value);
			location.coordinates[0] = lng;
			this.setState({ location });
		}
	};

	onChangePhoto = (e) => {
		// const photoFile = new FormData();
		// photoFile.append('photo', e.target.files[0]);
		this.setState({
			photo: e.target.files[0],
			photoPreviewURL: URL.createObjectURL(e.target.files[0]),
			photoLoaded: true,
		});
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

		const photoData = new FormData();
		photoData.append('photo', this.state.photo);
		photoData.append('cragName', this.state.cragName);
		photoData.append('cragDescription', this.state.cragDescription);
		photoData.append('difficulty', this.state.difficulty);
		photoData.append(
			'location[coordinates]',
			this.state.location.coordinates
		);
		photoData.append('freeAllDay', this.state.freeAllDay);
		photoData.append('busyWeekend', this.state.busyWeekend);
		photoData.append('avoidRush', this.state.avoidRush);
		photoData.append('author', this.props.user._id);

		if (this.props.postData) {
			photoData.append('_id', this.props.cragCardInfo.data._id);
			const id = this.props.cragCardInfo.data._id;
			this.props.postData(photoData, id);
		} else {
			axios
				.post('http://localhost:4000/createCrag', photoData)
				.then((res) => {
					console.log(res);
					this.props.history.push(`/crag/${res.data.slug}`, {
						msg: 'Crag successfully created!',
					});
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
				photo: null,
				photoPreviewURL: {},
				photoLoaded: false,
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
				<form
					formEncType='multipart/form-data'
					onSubmit={this.onSubmit}
				>
					<div className='form-group'>
						<label>Crag Name: </label>
						<input
							type='text'
							name='cragName'
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
							name='cragDescription'
							required
							className='form-control'
							defaultValue={this.state.cragDescription}
							onChange={this.onChangeCragDescription}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='location'>Location: </label>
						<div>
							<label htmlFor='lat'>Latitude: </label>
							<input
								type='number'
								required
								id='lat'
								name='lat'
								defaultValue={
									this.state.location.coordinates[1]
										? this.state.location.coordinates[1]
										: []
								}
								onChange={this.onChangeLocation}
							/>
							<label htmlFor='lng'>Longitude: </label>
							<input
								type='number'
								required
								id='lng'
								name='lng'
								defaultValue={
									this.state.location.coordinates[0]
										? this.state.location.coordinates[0]
										: []
								}
								onChange={this.onChangeLocation}
							/>
						</div>
						<div className='form-group files'>
							<label htmlFor='photo'>Upload Your File </label>
							<input
								type='file'
								name='photo'
								className='form-control'
								accept='image/gif, image/png, image/jpeg'
								onChange={this.onChangePhoto}
							/>
							{this.state.photoLoaded && (
								<img
									src={this.state.photoPreviewURL}
									alt='crag'
									width={200}
								/>
							)}
						</div>
						<label htmlFor='difficulty'>Difficulty: </label>
						<select
							id='difficulty'
							name='difficulty'
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
