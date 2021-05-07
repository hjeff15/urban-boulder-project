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
	grid-template-columns: repeat(3, minmax(auto, 270px)) minmax(200px, 500px) repeat(
			2,
			10vw
		);
	grid-template-rows:
		4rem 4rem max-content minmax(30px, auto)
		auto;
	grid-template-areas:
		' img img img title title edit'
		' img img img likes diff diff'
		' img img img desc desc desc'
		' map map map map map map'
		' comments comments comments comments comments comments'
		' . commentForm commentForm commentForm commentForm .';
	@media (max-width: 900px) {
		grid-template-columns:
			10vw repeat(4, auto) minmax(15vw, 20vw)
			10vw;
		grid-template-rows: repeat(3, auto) minmax(30px, auto) repeat(3, auto);
		grid-template-areas:
			' . title edit likes diff diff .'
			' . img img img img img .'
			' . img img img img img .'
			' . map map map map map .'
			' . desc desc desc desc desc .'
			' . comments comments comments comments comments .'
			' . commentForm commentForm commentForm commentForm commentForm .';
	}
	@media (max-width: 512px) {
		grid-template-columns: 5vw repeat(4, auto) 5vw;
		grid-template-rows: repeat(4, auto) minmax(30px, auto) repeat(3, auto);
		grid-template-areas:
			' . title title title edit .'
			' . diff diff likes likes .'
			' . img img img img .'
			' . img img img img .'
			' . map map map map .'
			' . desc desc desc desc .'
			' . comments comments comments comments .'
			' . commentForm commentForm commentForm commentForm .';
	}
	@media (max-width: 270px) {
		grid-template-columns: repeat(4, auto);
		grid-template-rows: repeat(4, auto) minmax(30px, auto) repeat(3, auto);
		grid-template-areas:
			'title title title edit'
			'diff diff likes likes'
			'img img img img'
			'img img img img'
			'map map map map'
			'desc desc desc desc'
			'comments comments comments comments'
			'commentForm commentForm commentForm commentForm';
	}
`;

const CragTitleATag = styled.a`
	text-decoration: none;
	color: #d9b92e;
	grid-area: title;
	justify-self: start;
	margin-left: 5px;
	@media (max-width: 900px) {
		margin-left: 0px;
	}
`;

const CragTitle = styled.h2`
	font-size: 2.5rem;
	margin: 0px;
	@media (max-width: 900px) {
		margin-top: 0.5rem;
		font-size: 2rem;
	}
	@media (max-width: 400px) {
		/* margin-top: 0.5rem; */
		font-size: 1.5rem;
	}
`;

const EditButton = styled.a`
	grid-area: edit;
	border: 1px solid brown;
	border-radius: 50px;
	padding: 0.5em;
	margin-right: 2rem;
	justify-self: end;
	align-self: start;
	@media (max-width: 900px) {
		/* margin-top: 1rem; */
		align-self: center;
		padding: 0.2em;
		margin: 0px;
		justify-self: start;
	}
	@media (max-width: 590px) {
		margin: 0px;
	}
	@media (max-width: 512px) {
		justify-self: end;
	}
	@media (max-width: 270px) {
		margin-right: 5px;
		margin-top: 5px;
	}
`;

const CragImage = styled.img`
	grid-area: img;
	object-fit: contain;
	width: 100%;
	height: 100%;
	border-radius: 5px;
	@media (max-width: 900px) {
		object-fit: fill;
	}
	@media (max-width: 700px) {
		object-fit: contain;
	}
	@media (max-width: 400px) {
		height: 40vh;
	}
`;

const CragDiff = styled.p`
	grid-area: diff;
	color: #d9b92e;
	font-size: 2rem;
	width: 90%;
	text-align: center;
	border: 1px solid #d9b92e;
	justify-self: start;
	align-self: center;
	@media (max-width: 900px) {
		font-size: 1.7rem;
		justify-self: end;
		margin: 0px;
	}
	@media (max-width: 540px) {
		font-size: 1.5rem;
	}
	@media (max-width: 512px) {
		font-size: 1.7rem;
		justify-self: start;
	}
`;

const CragLikes = styled.div`
	grid-area: likes;
	display: grid;
	place-self: center stretch;
	grid-template-columns: 30% 70%;
	grid-template-areas: 'thumbs numbers';
	/* justify-items: center; */
	align-items: center;
	@media (max-width: 512px) {
		justify-self: end;
	}
`;

const CragLikeCount = styled.p`
	grid-area: numbers;
	font-size: 1rem;
	place-self: normal;
`;

const CragLikeX = styled.span`
	margin-right: 0.5rem;
`;

const CragDesc = styled.div`
	grid-area: desc;
	justify-items: center;
	align-content: flex-start;
	margin-top: 2rem;
	margin-left: 5px;
	overflow: auto;
`;
const CragDescText = styled.p`
	font-size: 1.7rem;
	margin: 0px;
	@media (max-width: 900px) {
		font-size: 1.5rem;
	}
	@media (max-width: 400px) {
		font-size: 1.3rem;
	}
	@media (max-width: 400px) {
		font-size: 1.1rem;
	}
`;

const CragIcons = styled.p`
	grid-area: desc;
	color: orange;
	@media (max-width: 300px) {
		text-align: center;
	}
`;

const CommentBoxGrid = styled.div`
	grid-area: comments;
	justify-self: stretch;
	margin: 1rem;
`;

const LeaveAComment = styled.p`
	grid-area: commentForm;
	@media (max-width: 510px) {
		text-align: center;
	}
`;

const LoginRegisterLinks = styled.a`
	color: orange;
	text-decoration: none;
`;

const NoCommentsYet = styled.h4`
	display: flex;
	justify-content: center;
`;

const SuccessMsg = styled.h2`
	display: grid;
	color: green;
	justify-content: center;
	background-color: #08304b;
	margin: 0px;
	padding-bottom: 0.5rem;
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
			// console.log('component has been updated');
		}
		if (
			this.props.location.pathname.state !==
			prevProp.location.pathname.state
		) {
			console.log('component has been updated');
		}
	}
	// This function used to be async/await, but caused 'Warning: Can’t perform a React state update on an unmounted component.' error.
	fetchData() {
		const response = axios
			.get(
				`${process.env.REACT_APP_SERVER}${this.props.location.pathname}`
			)
			.then((result) => {
				if (!result.data) {
					this.props.history.push('/404');
				} else {
					// console.log(result);
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
				{this.state.msg && <SuccessMsg>{this.state.msg}</SuccessMsg>}
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
							src={`https://urban-boulder-project.s3.eu-west-2.amazonaws.com/${this.state.crag.data.s3photo}`}
							alt='crag'
						/>
						{/* <CragLikes> */}
						{this.state.crag.data.likes.length < 1 ? (
							<CragLikes>
								<IoThumbsUpOutline
									style={{
										width: '30px',
										height: '30px',
										gridArea: 'thumbs',
										justifySelf: 'end',
										marginRight: '10px',
									}}
								/>
								<CragLikeCount>
									<CragLikeX>x</CragLikeX>{' '}
									{this.state.crag.data.likes.length}
								</CragLikeCount>
							</CragLikes>
						) : (
							<CragLikes>
								<IoThumbsUp
									style={{
										width: '30px',
										height: '30px',
										color: '#d9b92e',
										gridArea: 'thumbs',
										justifySelf: 'end',
										marginRight: '10px',
									}}
								/>
								<CragLikeCount>
									<CragLikeX>x</CragLikeX>{' '}
									{this.state.crag.data.likes.length}
								</CragLikeCount>
							</CragLikes>
						)}
						{/* </CragLikes> */}
						<CragDiff>
							v{this.state.crag.data.minDifficulty} - v
							{this.state.crag.data.maxDifficulty}
						</CragDiff>
						<CragDesc>
							<CragDescText>
								{this.state.crag.data.cragDescription}
							</CragDescText>
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
								off?{' '}
								<LoginRegisterLinks href='/login'>
									Login
								</LoginRegisterLinks>{' '}
								or{' '}
								<LoginRegisterLinks href='/register'>
									Register
								</LoginRegisterLinks>{' '}
								to create, edit and leave comments...
							</LeaveAComment>
						)}
						<CommentBoxGrid>
							{this.state.crag.data.comments.length ? (
								this.state.crag.data.comments.map(
									(comment, index) => {
										return (
											<CommentBox
												key={index}
												comment={comment}
											/>
										);
									}
								)
							) : (
								<NoCommentsYet>
									No Comments written yet...
								</NoCommentsYet>
							)}
						</CommentBoxGrid>
					</ShowCragPage>
				)}
			</div>
		);
	}
}

export default withRouter(ShowCrag);
