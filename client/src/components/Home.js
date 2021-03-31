import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
//Components
import Footer from './Footer';

// Components
import CragCard from './CragCard';
import { PagesNav } from './PagesNav';

const HomeDiv = styled.div`
	background-color: #08304b;
	display: grid;
	margin: 0px;
	justify-items: center;
	height: 100vh;
	@media (max-width: 670px) {
		height: auto;
	}
`;

const CragCardList = styled.ul`
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(3, 32vw);
	grid-template-rows: minmax(auto, 305px);
	grid-gap: 10px;
	/* margin: 15px; */
	margin: 0px;
	padding-left: 5px;
	@media (max-width: 790px) {
		grid-template-rows: minmax(auto, 285px);
	}
	@media (max-width: 670px) {
		grid-template-columns: repeat(2, 49vw);
		grid-template-rows: minmax(auto, 265px);
		padding-left: 0px;
		grid-gap: 3px;
	}
	@media (max-width: 400px) {
		grid-template-columns: auto;
		grid-template-rows: minmax(auto, 275px);
		padding: 10px;
		grid-gap: 10px;
	}
`;

const ListItem = styled.li`
	list-style: none;
	border: 1px solid #d9b92e;
	border-radius: 10px;
	/* align-self: center; */
`;

const Msg = styled.h4`
	background-color: #ffe3f1;
	color: red;
	border-radius: 10px;
	margin-top: 0px;
	padding: 2px 10px 2px 10px;
	justify-self: center;
	margin-bottom: auto;
`;

const WelcomeMsg = styled.h4`
	/* background-color: blue; */
	color: orange;
	border-radius: 10px;
	margin-top: 0px;
	padding: 2px 10px 2px 10px;
	justify-self: center;
	margin-bottom: auto;
`;

const LoginMsg = styled.h3`
	color: green;
	margin-top: 0px;
	justify-self: center;
	@media (max-width: 300px) {
		font-size: 0.9rem;
	}
`;

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			loaded: false,
			crags: {},
			user: {},
			msg: '',
			welcomeMsg: '',
			page: null,
			pages: null,
			count: null,
		};
	}

	componentDidMount() {
		this.fetchData();
		this.checkMsg();
		this.updateUserState();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.location.state !== this.props.location.state) {
			this.checkMsg();
		}
	}

	updateUserState() {
		this.setState({
			user: this.props.user,
			loggedIn: true,
		});
	}

	checkMsg() {
		if (this.props.location.state) {
			if (this.props.location.state.msg) {
				this.setState({ msg: this.props.location.state.msg });
			}
			if (this.props.location.state.welcomeMsg) {
				this.setState({
					welcomeMsg: this.props.location.state.welcomeMsg,
				});
			} else {
				this.setState({ welcomeMsg: '' });
			}
		} else {
			this.setState({ msg: '', welcomeMsg: '' });
		}
	}

	async fetchData() {
		const response = await axios
			.get(`http://localhost:4000${this.props.location.pathname}`)
			.then((result) => {
				// console.log(result.data);
				this.setState({
					crags: result.data.crags,
					loaded: true,
					page: result.data.page,
					pages: result.data.pages,
					count: result.data.count,
				});
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		return response;
	}

	addMsg = (msg) => {
		this.setState({
			msg: msg,
		});
	};

	render() {
		return (
			<HomeDiv>
				{this.state.msg && <Msg>{this.state.msg}</Msg>}
				{this.state.welcomeMsg && (
					<WelcomeMsg>{this.state.welcomeMsg}</WelcomeMsg>
				)}
				{localStorage.getItem('name') ? (
					<LoginMsg>{`Currently Logged In as:  ${localStorage.getItem(
						'name'
					)}`}</LoginMsg>
				) : null}
				{!this.state.loaded && (
					<Loader
						type='TailSpin'
						color='#d9b92e'
						height={100}
						width={100}
						style={{
							display: 'grid',
							justifySelf: 'center',
						}}
					/>
				)}
				{this.state.loaded && (
					<CragCardList className='crag-cards'>
						{Object.keys(this.state.crags).map((key, index) => (
							<ListItem key={index}>
								<CragCard
									cragInfo={this.state.crags[key]}
									user={
										this.props.user ? this.props.user : null
									}
									addMsg={this.addMsg}
									updateLikes={this.props.updateLikes}
								>
									Crag Name: {this.state.crags[key].cragName}
								</CragCard>
							</ListItem>
						))}
					</CragCardList>
				)}
				<PagesNav
					page={this.state.page}
					pages={this.state.pages}
					count={this.state.count}
				></PagesNav>
				<Footer />
			</HomeDiv>
		);
	}
}
