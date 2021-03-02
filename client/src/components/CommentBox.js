import React, { Component } from 'react';
import styled from 'styled-components';
import Moment from 'react-moment';

const CommentDiv = styled.div`
	font-family: 'Roboto', sans-serif;
	color: white;
	box-sizing: border-box;
	display: grid;
	border: 1px solid grey;
	margin-left: 5rem;
	margin-right: 5rem;
	margin-bottom: 5px;
	grid-template-columns: 10% 60% 30%;
	grid-template-rows: 3rem 4rem;
	grid-template-areas:
		'top-left top-middle top-right'
		'review review review';
`;

const Gravatar = styled.img`
	width: 70px;
	width: 40px;
	height: 40px;
	border-radius: 40px;
	grid-area: top-left;
`;

const AuthorName = styled.h4`
	font-size: 20px;
	grid-area: top-middle;
`;

const AuthorTime = styled.time`
	grid-area: top-right;
`;

const CommentText = styled.p`
	font-size: 20px;
	grid-area: review;
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
				<p>
					Created{' '}
					<AuthorTime>
						<Moment fromNow ago>
							{this.props.comment.created}
						</Moment>
					</AuthorTime>{' '}
					ago
				</p>

				<CommentText>{this.props.comment.text}</CommentText>
			</CommentDiv>
		);
	}
}
