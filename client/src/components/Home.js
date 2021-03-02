import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CragCard from './CragCard';

const HomeDiv = styled.div`
	background-color: #08304b;
`;

const CragCardList = styled.ul`
	box-sizing: border-box;
	display: grid;
	grid-template-columns: 50% 50%;
	grid-template-rows: auto;
	grid-gap: 10px;
	margin: 15px;
	margin-top: 0px;
	padding: 10px;
`;

const ListItem = styled.li`
	list-style: none;
	border: 1px solid #d9b92e;
	border-radius: 10px;
`;

const Msg = styled.h2`
	color: white;
	margin-top: 0px;
`;

const LoginMsg = styled.h3`
	color: white;
	margin-top: 0px;
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
		return this.props.location.state
			? this.setState({ msg: this.props.location.state.msg })
			: this.setState({ msg: '' });
	}

	async fetchData() {
		const response = await axios
			.get('http://localhost:4000/')
			.then((result) => {
				this.setState({ crags: result, loaded: true });
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
				{localStorage.getItem('name') ? (
					<LoginMsg>{`Currently Logged In as:  ${localStorage.getItem(
						'name'
					)}`}</LoginMsg>
				) : null}
				{!this.state.loaded && <p>Loading...</p>}
				{this.state.loaded && (
					<CragCardList className='crag-cards'>
						{Object.keys(this.state.crags.data).map(
							(key, index) => (
								<ListItem key={index}>
									<CragCard
										cragInfo={this.state.crags.data[key]}
										user={
											this.props.user
												? this.props.user
												: null
										}
										addMsg={this.addMsg}
										updateLikes={this.props.updateLikes}
									>
										Crag Name:{' '}
										{this.state.crags.data[key].cragName}
									</CragCard>
								</ListItem>
							)
						)}
					</CragCardList>
				)}
			</HomeDiv>
		);
	}
}
