import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaPencilAlt } from 'react-icons/fa';
import { IoThumbsUp, IoThumbsUpOutline } from 'react-icons/io5';
import StaticMap from './StaticMap';
import CommentForm from './CommentForm';
import CommentBox from './CommentBox';

const ShowCragPage = styled.div`
	background-color: #08304b;
	color: white;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(5, 20%);
	grid-template-rows: 6rem 19rem 19rem minmax(300px, auto) auto;
	grid-template-areas:
		' title title edit likes diff'
		' img img img desc desc'
		' map map map map map'
		' . comments comments comments .'
		' . commentForm commentForm commentForm .';
`;

const CragTitleATag = styled.a`
	text-decoration: none;
	color: #d9b92e;
	grid-area: title;
`;

const CragTitle = styled.h2`
	font-size: 50px;
	margin: 0px;
`;

const EditButton = styled.a`
	grid-area: edit;
`;

const CragImage = styled.img`
	grid-area: img;
	object-fit: cover;
	width: 100%;
	height: 100%;
`;

const CragDiff = styled.h3`
	grid-area: diff;
	color: #d9b92e;
	justify-self: center;
	font-size: 50px;
	margin: 0px;
	width: 80px;
	height: 80px;
	text-align: center;
	border: 1px solid #d9b92e;
`;

const CragLikes = styled.div`
	grid-area: likes;
	display: grid;
	grid-template-columns: repeat(2, 50%);
	grid-template-areas: 'thumbs numbers';
`;

const CragDesc = styled.h3`
	grid-area: desc;
`;

const CragIcons = styled.p`
	grid-area: desc;
`;

const CommentBoxGrid = styled.div`
	grid-area: comments;
`;

const LeaveAComment = styled.p`
	grid-area: commentForm;
`;

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
					console.log(result);
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
					<ShowCragPage>
						<CragTitleATag
							href={`/crag/${this.state.crag.data.slug}`}
							alt={`${this.state.crag.data.cragName}`}
						>
							<CragTitle>
								{this.state.crag.data.cragName}
							</CragTitle>
						</CragTitleATag>
						{this.state.crag.data.author === localStorage._id ? (
							<EditButton
								href={`/crags/${this.state.crag.data._id}/edit`}
								alt='edit'
								style={{
									border: 'solid 1px brown',
									borderRadius: '50px',
									padding: '2em',
									justifySelf: 'center',
								}}
							>
								<FaPencilAlt
									style={{
										color: 'brown',
										width: '2em',
										height: '2em',
									}}
								/>
							</EditButton>
						) : null}

						<StaticMap
							coordinates={
								this.state.crag.data.location.coordinates
							}
						/>
						<CragImage
							src={`/images/${this.state.crag.data.photo}`}
							alt='crag'
						/>
						<CragLikes>
							{this.state.crag.data.likes.length < 1 ? (
								<div>
									<IoThumbsUpOutline
										style={{
											width: '50px',
											height: '50px',
										}}
									/>
									<p>X {this.state.crag.data.likes.length}</p>
								</div>
							) : (
								<div>
									<IoThumbsUp
										style={{
											width: '50px',
											height: '50px',
											color: '#d9b92e',
										}}
									/>
									<p>X {this.state.crag.data.likes.length}</p>
								</div>
							)}
						</CragLikes>
						<CragDiff>{this.state.crag.data.difficulty}</CragDiff>
						<CragDesc>
							<h3>{this.state.crag.data.cragDescription}</h3>
							{this.state.crag.data.busyWeekend ? (
								<CragIcons>Busy At The Weekend</CragIcons>
							) : null}
							{this.state.crag.data.avoidRush ? (
								<CragIcons>Avoid During Rush Hour</CragIcons>
							) : null}
							{this.state.crag.data.freeAllDay ? (
								<CragIcons>Free All Day Long</CragIcons>
							) : null}
						</CragDesc>

						{localStorage._id ? (
							<CommentForm
								cragInfo={this.state.crag}
								user={this.props.user._id}
							/>
						) : (
							<LeaveAComment>
								Want to leave a comment or thing the grading is
								off? <a href='/login'>Login</a> or{' '}
								<a href='/register'>Register</a> to create, edit
								and leave comments...
							</LeaveAComment>
						)}
						<CommentBoxGrid>
							{this.state.crag.data.comments.length
								? this.state.crag.data.comments.map(
										(comment, index) => {
											return (
												<CommentBox
													key={index}
													comment={comment}
												/>
											);
										}
								  )
								: null}
						</CommentBoxGrid>
					</ShowCragPage>
				)}
			</div>
		);
	}
}

export default withRouter(ShowCrag);
