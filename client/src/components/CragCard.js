import React, { Component } from 'react';
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
	grid-template-rows: 3.5rem 7rem 5rem 3.5rem;
	grid-template-areas:
		'header header header header'
		'image image image likes'
		'image image image diff'
		'desc desc desc desc';
	align-items: stretch;
`;

const CardTitle = styled.h2`
	color: white;
	text-decoration: none;
	border: 1px solid #d9b92e;
	border-radius: 20px;
	place-self: center;
	grid-area: header;
`;

const CardATag = styled.a`
	color: white;
	text-decoration: none;
	padding-left: 1rem;
	padding-right: 1rem;
	cursor: pointer;
`;

const CragDescription = styled.h4`
	color: white;
	grid-area: desc;
	padding-left: 1rem;
`;

const CragDifficulty = styled.h3`
	color: #d9b92e;
	grid-area: diff;
	justify-self: center;
	font-size: 50px;
	margin: 30px;
	width: 80px;
	height: 80px;
	line-height: 80px;
	text-align: center;
	border: 1px solid #d9b92e;
`;

const CragImage = styled.img`
	grid-area: image;
	margin-left: 0.5em;
	border-radius: 10px 0 0 10px;
	justify-self: center;
	object-fit: cover;
	width: 100%;
	max-height: 100%;
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
	margin-left: 0.5rem;
`;

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

	submitLike = async (e) => {
		e.preventDefault();
		// const currentLocalStorage = JSON.parse(localStorage.getItem('likes'));
		// const newString = this.props.cragInfo._id;
		// currentLocalStorage.push(newString);
		// console.log(currentLocalStorage);
		if (this.props.user._id === '') {
			this.props.addMsg('You gotta be logged in to do that...');
			return;
		}
		const userId = this.props.user._id;
		const response = await axios
			.post(
				`http://localhost:4000/api/crags/${this.props.cragInfo._id}/like`,
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
					<CardATag href={`/crag/${this.props.cragInfo.slug}`}>
						{this.props.cragInfo.cragName
							.split(' ')
							.splice(0, 4)
							.join(' ')
							.toUpperCase()}
						...
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
						src={`/images/${this.props.cragInfo.photo}`}
						width={300}
						alt='cragImage'
					/>
				)}
				<CragDescription>
					{this.props.cragInfo.cragDescription
						.split(' ')
						.splice(0, 7)
						.join(' ')}
					...
				</CragDescription>
				<CragDifficulty>
					{this.props.cragInfo.difficulty}
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
									width: '50px',
									height: '50px',
									color: '#d9b92e',
								}}
							/>
						) : (
							<IoThumbsUpOutline
								style={{ width: '50px', height: '50px' }}
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
