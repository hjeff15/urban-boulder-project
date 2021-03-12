import React, { Component } from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';

const CommentDiv = styled.div`
	font-family: 'Roboto', sans-serif;
	color: white;
	box-sizing: border-box;
	display: grid;
	border: 1px solid grey;
	margin-bottom: 5px;
	grid-template-columns: 10vw 1fr 30vw;
	grid-template-rows: auto auto;
	grid-template-areas:
		'top-left top-middle top-right'
		'review review review';
	overflow: auto;
`;

const Gravatar = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 40px;
	grid-area: top-left;
	justify-self: center;
	align-self: center;
	@media (max-width: 512px) {
		width: 30px;
		height: 30px;
	}
`;

const AuthorName = styled.h4`
	font-size: 1.5rem;
	grid-area: top-middle;
	justify-self: start;
	align-self: end;
	margin: 10px;
	@media (max-width: 512px) {
		font-size: 1rem;
	}
`;

const AuthorTime = styled.p`
	grid-area: top-right;
	@media (max-width: 512px) {
		font-size: 0.7em;
	}
`;

const CommentText = styled.p`
	font-size: 1.4em;
	grid-area: review;
	margin: auto auto 10px 10px;
	@media (max-width: 512px) {
		font-size: 0.9em;
	}
`;

export default class CommentBox extends Component {
	constructor() {
		super();
		this.state = {
			data: '',
		};
	}

	render() {
		return (
			<CommentDiv>
				<Gravatar
					src={`https://www.gravatar.com/avatar/${this.props.comment.author.emailHash}?s=120&d=retro`}
					alt='gravatar'
				/>
				<AuthorName>{this.props.comment.author.name}</AuthorName>
				<AuthorTime>
					Created{' '}
					<time>
						<Moment fromNow ago>
							{this.props.comment.created}
						</Moment>
					</time>{' '}
					ago
				</AuthorTime>

				<CommentText>{this.props.comment.text}</CommentText>
			</CommentDiv>
		);
	}
}
