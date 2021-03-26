import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { striptags } from 'striptags';
// Components
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { Handle } from './sliderComponents/Handle';
import { Track } from './sliderComponents/Track';
import { Tick } from './sliderComponents/Tick';

const CommentFormDiv = styled.div`
	grid-area: commentForm;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(220px, auto);
	grid-template-rows: repeat(2, auto);
	grid-template-areas:
		'title'
		'form';
`;

const FormTitle = styled.p`
	grid-area: title;
	color: #d9b92e;
	font-size: 1.5rem;
	justify-self: center;
	text-align: center;
`;

const Form = styled.form`
	grid-area: form;
	display: grid;
	grid-template-rows: repeat(3, auto);
	grid-template-areas:
		'textArea'
		'grades'
		'button';
	margin-bottom: 1rem;
`;

const ReviewTextArea = styled.textarea`
	grid-area: textArea;
	@media (max-width: 270px) {
		width: 85vw;
		justify-self: center;
	}
`;

const CommentAddedMsg = styled.p`
	grid-area: title;
	align-self: end;
	justify-self: center;
	color: green;
	background-color: lightgreen;
	border: 1px green solid;
	border-radius: 20px;
	padding: 2px 4rem 2px 4rem;
	margin: 1px;
	@media (max-width: 300px) {
		padding: 2px 1rem 2px 1rem;
	}
`;

const RangeSlider = styled.div`
	grid-area: grades;
	display: grid;
	grid-template-columns: repeat(4, 25%);
	grid-template-areas: 'slider slider slider slider';
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

const SubmitButton = styled.button`
	grid-area: button;
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: center;
	width: 15rem;
	height: 2rem;
	font-size: 1.2rem;
	cursor: pointer;
	margin-top: 10px;
	@media (max-width: 270px) {
		/* justify-self: start; */
		width: 90vw;
	}
`;

const sliderStyle = {
	position: 'relative',
	width: 'auto',
	height: 80,
	gridArea: 'slider',
};

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

class CommentForm extends Component {
	constructor() {
		super();
		this.state = {
			text: '',
			difficulty: '',
			dummyDifficulty: 6,
			commentAddedMsg: false,
		};
	}

	submitForm = async (e) => {
		e.preventDefault(e);
		const user = this.props.user;
		const review = {
			author: user,
			text: striptags(this.state.text),
			difficulty: striptags(this.state.difficulty),
		};
		const response = await axios
			.post(
				`http://localhost:4000/comments/${this.props.cragInfo.data._id}`,
				{
					review,
					user,
				}
			)
			.then((res) => {
				console.log(res);
				this.setState({
					commentAddedMsg: true,
				});
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	};

	handleTextChange = (e) => {
		this.setState({
			text: e.target.value,
		});
	};

	changeSliderValues = (values) => {
		this.setState({
			difficulty: `v${values[0]}`,
		});
	};

	render() {
		return (
			<CommentFormDiv>
				<FormTitle>CRAG COMMENT FORM</FormTitle>
				{this.state.commentAddedMsg && (
					<CommentAddedMsg>Comment Added!</CommentAddedMsg>
				)}
				<Form onSubmit={this.submitForm}>
					<ReviewTextArea
						name='text'
						placeholder='Climbed this? Have something to say? Think the grading needs correcting? Leave a comment here...'
						cols='30'
						rows='10'
						required
						onChange={this.handleTextChange}
					/>
					<RangeSlider>
						<Slider
							rootStyle={sliderStyle}
							domain={[0, 16]}
							step={1}
							mode={2}
							values={[this.state.dummyDifficulty]}
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
					<SubmitButton type='submit'>Sumbit</SubmitButton>
				</Form>
			</CommentFormDiv>
		);
	}
}

export default CommentForm;
