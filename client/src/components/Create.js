import React, { Component } from 'react';
import axios from 'axios';
import FormError from './FormError';
import styled from 'styled-components';
//Components
import { striptags } from 'striptags';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import Tooltip from './Tooltip';
import { Handle } from './sliderComponents/Handle';
import { Track } from './sliderComponents/Track';
import { Tick } from './sliderComponents/Tick';

const Container = styled.div`
	display: grid;
	grid-auto-columns: minmax(260px, auto);
`;
const FormContainer = styled.form`
	display: grid;
	background-color: #08304b;
	grid-template-rows: repeat(11, auto);
	grid-template-areas:
		'title'
		'name'
		'description'
		'lat-lng'
		'photo'
		'difficulty'
		'newDifficulty'
		'option1'
		'option2'
		'option3'
		'create-btn';
	/* justify-items: center; */
	margin: 1rem 4rem 1rem 4rem;
	border-radius: 10px;
	@media (max-width: 740px) {
		margin: 1rem 1rem 1rem 1rem;
		border-radius: 10px;
		grid-auto-columns: minmax(230px, auto);
	}
	@media (max-width: 270px) {
		margin: 2px;
	}
`;
const Title = styled.h3`
	grid-area: title;
	color: #d9b92e;
	font-size: 2.5rem;
	justify-self: center;
	margin: 1rem;
	@media (max-width: 600px) {
		font-size: 1.7rem;
	}
`;
const Name = styled.div`
	grid-area: name;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-areas: '. label label-input label-input';
	color: #d9b92e;
	margin-bottom: 0.3rem;
	@media (max-width: 740px) {
		grid-template-areas: 'label label-input label-input label-input';
		margin-left: 1rem;
	}
	@media (max-width: 430px) {
		grid-template-columns: minmax(215px, auto);
		grid-template-rows: repeat(2, auto);
		grid-template-areas:
			'label'
			'label-input';
	}
`;
const NameLabel = styled.label`
	grid-area: label;
	font-size: 1.3rem;
	@media (max-width: 600px) {
		font-size: 1rem;
	}
`;
const NameInput = styled.input`
	grid-area: label-input;
	margin-right: 3rem;
	@media (max-width: 430px) {
		margin-right: 1rem;
	}
`;

const Description = styled.div`
	grid-area: description;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-areas: '. label label-input label-input';
	color: #d9b92e;
	margin-bottom: 0.3rem;
	@media (max-width: 740px) {
		grid-template-areas: 'label label-input label-input label-input';
		margin-left: 1rem;
	}
	@media (max-width: 430px) {
		grid-template-columns: auto;
		grid-template-rows: repeat(2, auto);
		grid-template-areas:
			'label'
			'label-input';
	}
`;
const DescriptionLabel = styled.label`
	grid-area: label;
	font-size: 1.3rem;
	@media (max-width: 600px) {
		font-size: 1rem;
	}
`;
const DescriptionInput = styled.textarea`
	grid-area: label-input;
	margin-right: 3rem;
	@media (max-width: 430px) {
		margin-right: 1rem;
	}
`;
const LatLng = styled.div`
	grid-area: lat-lng;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-rows: repeat(3, auto);
	grid-template-areas:
		'. title title title'
		'. lat-title lat-input lat-input'
		'. lng-title lng-input lng-input';
	color: #d9b92e;
	margin-bottom: 0.6rem;
	@media (max-width: 740px) {
		grid-template-areas:
			'title title title title'
			'lat-title lat-input lat-input lat-input'
			'lng-title lng-input lng-input lng-input';
		margin-left: 1rem;
		grid-gap: 10px;
	}
	@media (max-width: 600px) {
		grid-gap: 0px;
	}
	@media (max-width: 430px) {
		grid-template-columns: auto;
		grid-template-rows: repeat(5, auto);
		grid-template-areas:
			'title'
			'lat-title'
			'lat-input'
			'lng-title'
			'lng-input';
	}
`;

const LocationLabel = styled.label`
	grid-area: title;
	font-size: 1.3rem;
	display: flex;
	@media (max-width: 600px) {
		font-size: 1rem;
	}
`;
const LatTitle = styled.label`
	grid-area: lat-title;
	margin-left: 3rem;
	font-size: 1.3rem;
	@media (max-width: 600px) {
		font-size: 1rem;
		margin-left: 0.5rem;
	}
`;
const LngTitle = styled.label`
	grid-area: lng-title;
	margin-left: 3rem;
	font-size: 1.3rem;
	@media (max-width: 600px) {
		font-size: 1rem;
		margin-left: 0.5rem;
	}
`;
const LatInput = styled.input`
	grid-area: lat-input;
	margin-bottom: 0.3rem;
	margin-right: 3rem;
	@media (max-width: 430px) {
		margin-right: 1rem;
	}
`;
const LngInput = styled.input`
	grid-area: lng-input;
	margin-right: 3rem;
	@media (max-width: 430px) {
		margin-right: 1rem;
	}
`;

const Photo = styled.div`
	grid-area: photo;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	color: #d9b92e;
	margin-bottom: 0.3rem;
	@media (max-width: 740px) {
		margin-left: 1rem;
	}
`;
const PhotoLabel = styled.label`
	grid-column: 2;
	font-size: 1.3rem;
	@media (max-width: 740px) {
		grid-column: 1;
	}
	@media (max-width: 600px) {
		font-size: 1rem;
	}
`;

const PhotoInput = styled.input`
	@media (max-width: 600px) {
		grid-column: 2 / span 2;
	}
`;

const PhotoLoaded = styled.img`
	width: 20vw;
`;

const RangeSlider = styled.div`
	grid-area: newDifficulty;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-areas: '. slider slider slider';
	margin-right: 3rem;
	margin-top: 1rem;
	margin-bottom: 1rem;
	font-size: 1rem;
	@media (max-width: 750px) {
		grid-template-columns: repeat(3, auto);
		grid-template-areas: 'slider slider slider';
		margin-left: 2rem;
		margin-right: 2rem;
	}
	@media (max-width: 412px) {
		margin-left: 0.5rem;
		margin-right: 1rem;
	}
`;

const sliderStyle = {
	position: 'relative',
	width: 'auto',
	height: 80,
	gridArea: 'slider',
};

const Option1 = styled.div`
	grid-area: option1;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	color: #d9b92e;
	@media (max-width: 740px) {
		margin-left: 1rem;
		margin-bottom: 10px;
	}
`;
const Option1Label = styled.label`
	grid-column: 2;
	font-size: 1.3rem;
	@media (max-width: 740px) {
		grid-column: 1 / span 2;
	}
	@media (max-width: 600px) {
		font-size: 1rem;
		grid-column: 1 / span 2;
	}
`;
const Option1Input = styled.input`
	justify-self: start;
	grid-column: 3;
`;
const Option2 = styled.div`
	grid-area: option2;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	color: #d9b92e;
	@media (max-width: 740px) {
		margin-left: 1rem;
		margin-bottom: 10px;
	}
`;
const Option2Label = styled.label`
	grid-column: 2;
	font-size: 1.3rem;
	@media (max-width: 740px) {
		grid-column: 1;
		grid-column: 1 / span 2;
	}
	@media (max-width: 600px) {
		font-size: 1rem;
		grid-column: 1 / span 2;
	}
`;
const Option2Input = styled.input`
	justify-self: start;
	grid-column: 3;
`;
const Option3 = styled.div`
	grid-area: option3;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	color: #d9b92e;
	@media (max-width: 740px) {
		margin-left: 1rem;
		margin-bottom: 10px;
	}
`;
const Option3Label = styled.label`
	grid-column: 2;
	font-size: 1.3rem;
	@media (max-width: 740px) {
		grid-column: 1 / span 2;
	}
	@media (max-width: 600px) {
		font-size: 1rem;
	}
`;
const Option3Input = styled.input`
	justify-self: start;
	grid-column: 3;
`;
const CreateBtnArea = styled.div`
	grid-area: create-btn;
	justify-self: center;
`;
const CreateBtn = styled.input`
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: center;
	width: 22rem;
	height: 2rem;
	font-size: 1.2rem;
	margin: 1rem;
	cursor: pointer;
	@media (max-width: 430px) {
		width: auto;
	}
`;

export default class Create extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cragName: '',
			cragDescription: '',
			// difficulty: '',
			location: {
				coordinates: [],
			},
			photo: null,
			photoPreviewURL: {},
			photoLoaded: false,
			freeAllDay: false,
			busyWeekend: false,
			avoidRush: false,
			minDifficulty: 2,
			maxDifficulty: 9,
			formError: false,
		};
	}

	componentDidMount() {
		if (this.props.cragCardInfo) {
			this.setState({
				cragName: this.props.cragCardInfo.data.cragName,
				cragDescription: this.props.cragCardInfo.data.cragDescription,
				// difficulty: this.props.cragCardInfo.data.difficulty,
				minDifficulty: this.props.cragCardInfo.data.minDifficulty,
				maxDifficulty: this.props.cragCardInfo.data.maxDifficulty,
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

	changeSliderValues = (values) => {
		this.setState({
			minDifficulty: values[0],
			maxDifficulty: values[1],
		});
	};

	onSubmit = (e) => {
		e.preventDefault();

		const photoData = new FormData();
		photoData.append('photo', this.state.photo);
		photoData.append('cragName', striptags(this.state.cragName));
		photoData.append(
			'cragDescription',
			striptags(this.state.cragDescription)
		);
		// photoData.append('difficulty', this.state.difficulty);
		photoData.append('minDifficulty', this.state.minDifficulty);
		photoData.append('maxDifficulty', this.state.maxDifficulty);
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
				.post(`${process.env.REACT_APP_SERVER}/createCrag`, photoData)
				.then((res) => {
					// console.log(res);
					this.props.history.push(`/crag/${res.data.slug}`, {
						msg: 'Crag successfully created!',
					});
					// return res.data;
				})
				.catch((err) => {
					console.log(err);
					this.setState({
						formError: true,
					});
				});
			// Is this code below why there is a double render after create is made?
			this.setState({
				cragName: '',
				cragDescription: '',
				// difficulty: '',
				minDifficulty: 2,
				maxDifficulty: 9,
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
			<Container>
				{this.state.formError && <FormError />}
				<FormContainer
					formEncType='multipart/form-data'
					onSubmit={this.onSubmit}
				>
					{this.props.cragCardInfo ? (
						<Title>Edit Crag</Title>
					) : (
						<Title>New Crag</Title>
					)}
					<Name>
						<NameLabel>Crag Name: </NameLabel>
						<NameInput
							type='text'
							name='cragName'
							placeholder='Name the crag...'
							required
							defaultValue={this.state.cragName}
							onChange={this.onChangeCragName}
						/>
					</Name>
					<Description className='form-group'>
						<DescriptionLabel>Crag Description: </DescriptionLabel>
						<DescriptionInput
							type='text'
							name='cragDescription'
							rows='8'
							required
							placeholder='Describe the crag...'
							defaultValue={this.state.cragDescription}
							onChange={this.onChangeCragDescription}
						/>
					</Description>
					{/* <div className='form-group'> */}
					<LatLng>
						<LocationLabel htmlFor='location'>
							Location:{' '}
							<Tooltip text="The location needs to be in a Lat Lng format as it is more specific, and we don't want to put any private property on the site." />
						</LocationLabel>
						<LatTitle htmlFor='lat'>Latitude: </LatTitle>
						<LatInput
							type='number'
							required
							placeholder='What is the Latitude?'
							id='lat'
							name='lat'
							step='0.01'
							defaultValue={
								this.state.location.coordinates[1]
									? this.state.location.coordinates[1]
									: []
							}
							onChange={this.onChangeLocation}
						/>
						<LngTitle htmlFor='lng'>Longitude: </LngTitle>
						<LngInput
							type='number'
							required
							placeholder='What is the Longitude?'
							id='lng'
							name='lng'
							step='0.01'
							defaultValue={
								this.state.location.coordinates[0]
									? this.state.location.coordinates[0]
									: []
							}
							onChange={this.onChangeLocation}
						/>
					</LatLng>
					<Photo>
						<PhotoLabel htmlFor='photo'>
							Upload Your File{' '}
						</PhotoLabel>
						<PhotoInput
							type='file'
							name='photo'
							accept='image/gif, image/png, image/jpeg'
							onChange={this.onChangePhoto}
						/>
						{this.state.photoLoaded && (
							<PhotoLoaded
								src={this.state.photoPreviewURL}
								alt='crag'
								width={200}
							/>
						)}
					</Photo>
					{/* <Difficulty>
						<DifficultyLabel htmlFor='difficulty'>
							Difficulty:{' '}
						</DifficultyLabel>
						<DifficultySelect
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
						</DifficultySelect>
					</Difficulty> */}
					<RangeSlider>
						<Slider
							rootStyle={sliderStyle}
							domain={[0, 16]}
							step={1}
							mode={2}
							values={[
								this.state.minDifficulty,
								this.state.maxDifficulty,
							]}
							onChange={this.changeSliderValues}
							required
						>
							<Rail>
								{({ getRailProps }) => (
									<div
										style={{
											position: 'absolute',
											width: '100%',
											height: 10,
											marginTop: 35,
											borderRadius: 5,
											backgroundColor: 'white',
										}}
										{...getRailProps()}
									/>
								)}
							</Rail>
							<Handles>
								{({ handles, getHandleProps }) => {
									return (
										<div className='slider-handles'>
											{handles.map((handle) => (
												<Handle
													key={handle.id}
													handle={handle}
													getHandleProps={
														getHandleProps
													}
												/>
											))}
										</div>
									);
								}}
							</Handles>
							<Tracks left={false} right={false}>
								{({ tracks, getTrackProps }) => (
									<div className='slider-tracks'>
										{tracks.map(
											({ id, source, target }) => (
												<Track
													key={id}
													source={source}
													target={target}
													getTrackProps={
														getTrackProps
													}
												/>
											)
										)}
									</div>
								)}
							</Tracks>
							<Ticks
								count={
									15 /* generate approximately 15 ticks within the domain */
								}
							>
								{({ ticks }) => (
									<div className='slider-ticks'>
										{ticks.map((tick) => (
											<Tick
												key={tick.id}
												tick={tick}
												count={ticks.length}
											/>
										))}
									</div>
								)}
							</Ticks>
						</Slider>
					</RangeSlider>

					{/* </div> */}
					<Option1>
						<Option1Label htmlFor='allDay'>
							Free all day and night
						</Option1Label>
						<Option1Input
							type='checkbox'
							name='allDay'
							checked={this.state.freeAllDay}
							onChange={this.toggle}
						/>
					</Option1>
					<Option2>
						<Option2Label htmlFor='busyWeekend'>
							Busy at evening and weekends
						</Option2Label>
						<Option2Input
							type='checkbox'
							name='busyWeekend'
							checked={this.state.busyWeekend}
							onChange={this.toggle}
						/>
					</Option2>
					<Option3>
						<Option3Label htmlFor='avoidRush'>
							Avoid at the rush hour
						</Option3Label>
						<Option3Input
							type='checkbox'
							name='avoidRush'
							checked={this.state.avoidRush}
							onChange={this.toggle}
						/>
					</Option3>

					<CreateBtnArea>
						<CreateBtn
							type='submit'
							value={
								this.props.cragCardInfo
									? 'Edit Crag'
									: 'Create Crag'
							}
						/>
					</CreateBtnArea>
				</FormContainer>
			</Container>
		);
	}
}

// See this link for help on photo upload:-
//  https://codepen.io/hartzis/pen/VvNGZP?editors=1010
