import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PicPlaceholder from '../assets/images/crack.jpeg';
import styled from 'styled-components';
import { IoThumbsUp, IoThumbsUpOutline } from 'react-icons/io5';
import axios from 'axios';

const CragCardStyle = styled.div`
	font-family: 'Roboto', sans-serif;
	margin-bottom: 10px;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 20% 30% 15% 35%;
	grid-template-rows: 3.5rem 7rem 5rem auto;
	grid-template-areas:
		'header header header header'
		'image image image likes'
		'image image image diff'
		'desc desc desc desc';
	align-items: stretch;
	@media (max-width: 790px) {
		grid-template-rows: 3.5rem 7rem 3rem auto;
	}
`;

const CardTitle = styled.h2`
	color: white;
	font-size: 1.3rem;
	text-decoration: none;
	border: 1px solid #d9b92e;
	border-radius: 20px;
	place-self: center;
	grid-area: header;
	@media (max-width: 790px) {
		font-size: 1rem;
	}
`;

const CardATag = styled.p`
	color: white;
	text-decoration: none;
	padding-left: 1rem;
	padding-right: 1rem;
	cursor: pointer;
	margin-top: 5px;
	margin-bottom: 5px;
	&:hover {
		color: #d9b92e;
	}
`;

const CragDescription = styled.h4`
	color: white;
	font-weight: normal;
	grid-area: desc;
	padding-left: 1rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	@media (max-width: 790px) {
		margin-top: 10px;
	}
`;

const CragDifficulty = styled.h4`
	color: #d9b92e;
	grid-area: diff;
	justify-self: center;
	font-size: 1.1rem;
	margin: 0px;
	width: 80%;
	height: 70px;
	line-height: 70px;
	text-align: center;
	border: 1px solid #d9b92e;
	@media (max-width: 960px) {
		font-size: 1rem;
	}
	@media (max-width: 805px) {
		font-size: 0.8rem;
		width: 80%;
		height: 40px;
		line-height: 40px;
	}
	@media (max-width: 670px) {
		font-size: 1rem;
	}
	@media (max-width: 545px) {
		font-size: 0.7rem;
	}
	@media (max-width: 414px) {
		font-size: 0.6rem;
	}
	@media (max-width: 400px) {
		font-size: 1rem;
	}
	@media (max-width: 280px) {
		font-size: 0.9rem;
	}
	@media (max-width: 260px) {
		font-size: 0.7rem;
	}
`;

const CragImage = styled.img`
	grid-area: image;
	margin-left: 0.5em;
	border-radius: 10px 0 0 10px;
	justify-self: center;
	object-fit: cover;
	width: 100%;
	max-height: 100%;
	@media (max-width: 790px) {
	}
`;

const LikeButton = styled.form`
	grid-area: likes;
	justify-self: center;
`;

const LikeNumber = styled.p`
	width: 30px;
	height: 30px;
	line-height: 30px;
	text-align: center;
	border: 1px solid #d9b92e;
	color: white;
	border-radius: 50%;
`;

class CragCard extends Component {
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

	submitLike = async (e) => {
		e.preventDefault();
		if (this.props.user._id === '') {
			this.props.addMsg('You gotta be logged in to do that...');
			return;
		}
		const userId = this.props.user._id;
		const response = await axios
			.post(
				`${process.env.REACT_APP_SERVER}/api/crags/${this.props.cragInfo._id}/like`,
				{ userId }
			)
			.then((res) => {
				this.props.updateLikes(res.data.likes);
				localStorage.setItem('likes', JSON.stringify(res.data.likes));
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	};

	render() {
		return (
			<CragCardStyle>
				<CardTitle>
					<CardATag
						onClick={() => {
							this.props.history.push(
								`/crag/${this.props.cragInfo.slug}`
							);
						}}
					>
						{this.props.cragInfo.cragName.split('').length < 12
							? this.props.cragInfo.cragName.toUpperCase()
							: this.props.cragInfo.cragName
									.split('')
									.slice(0, 11)
									.join('')
									.toUpperCase() + '...'}
						{/* {this.props.cragInfo.cragName
							.split(' ')
							.splice(0, 2)
							.join(' ')
							.toUpperCase()} */}
					</CardATag>
				</CardTitle>

				{!this.props.cragInfo.photo && (
					<CragImage
						src={PicPlaceholder}
						alt='crack climber'
						width='300'
					/>
				)}
				{this.props.cragInfo.photo && (
					<CragImage
						// src={`../assets/images/${this.props.cragInfo.photo}`}
						src={`https://urban-boulder-project.s3.eu-west-2.amazonaws.com/${this.props.cragInfo.s3photo}`}
						width={300}
						alt='cragImage'
					/>
				)}
				<CragDescription>
					{this.props.cragInfo.cragDescription.split('').length < 25
						? this.props.cragInfo.cragDescription
						: this.props.cragInfo.cragDescription
								.split('')
								.slice(0, 25)
								.join('') + '...'}
				</CragDescription>
				<CragDifficulty>
					V{this.props.cragInfo.minDifficulty} - V
					{this.props.cragInfo.maxDifficulty}
				</CragDifficulty>
				<LikeButton onSubmit={this.submitLike}>
					<button
						type='submit'
						name='like'
						style={{
							cursor: 'pointer',
							backgroundColor: 'transparent',
							border: 'none',
							outline: 'none',
						}}
					>
						{this.props.user.likes.includes(
							this.props.cragInfo._id
						) ? (
							<IoThumbsUp
								style={{
									width: '40px',
									height: '40px',
									color: '#d9b92e',
								}}
							/>
						) : (
							<IoThumbsUpOutline
								style={{
									width: '40px',
									height: '40px',
									color: '#d9b92e',
								}}
							/>
						)}
						<LikeNumber>
							{this.props.cragInfo.likes.length}
						</LikeNumber>
					</button>
				</LikeButton>
			</CragCardStyle>
		);
	}
}

export default withRouter(CragCard);
