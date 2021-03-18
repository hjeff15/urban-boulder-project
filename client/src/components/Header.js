import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SearchBox from './Searchbox';
//Copmponents
import HamburgerNav from './HamburgerNav';
import Navigator from './Navigator';

//STYLES
const PageHeader = styled.header`
	font-family: 'Roboto', sans-serif;
	background-color: #02263d;
	color: white;
	display: grid;
	grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
	border-bottom: solid 2px #fff;
	@media (max-width: 512px) {
		grid-template-columns: 100vw;
		grid-grid-template-rows: repeat(2, auto);
	}
`;

const Title = styled.h1`
	color: white;
	border: white solid 1px;
	padding: 1.2rem;
	margin: 0.5rem;
	border-radius: 20px 0 0 20px;
	a {
		color: #d9b92e;
		text-decoration: none;
		cursor: pointer;
	}
	@media (max-width: 790px) {
		font-size: 1.5rem;
	}
`;

const Navigators = styled.a`
	color: #d9b92e;
	font-size: 1.7rem;
	text-decoration: none;
	justify-self: center;
	align-self: center;
	&:hover {
		text-decoration: underline;
	}
	@media (max-width: 790px) {
		font-size: 1.3rem;
	}
	@media (max-width: 512px) {
		display: none;
	}
`;

const Logout = styled.p`
	color: #d9b92e;
	font-size: 1.4rem;
	justify-self: center;
	align-self: center;
	cursor: pointer;
	@media (max-width: 512px) {
		display: none;
	}
	@media (max-width: 790px) {
		font-size: 1.2rem;
	}
`;

const LoginNav = styled.div`
	color: #d9b92e;
	margin: 0.5rem;
	display: grid;
	grid-template-rows: 80% 1fr;
	text-decoration: none;
	cursor: pointer;
	@media (max-width: 512px) {
		grid-column: 5;
	}
`;

const Gravatar = styled.img`
	width: 70px;
	border-radius: 40px;
	place-self: center;
	@media (max-width: 790px) {
		width: 50px;
	}
	@media (max-width: 512px) {
		display: none;
	}
`;

const DashboardText = styled.p`
	margin: 0px;
	place-self: center;
	text-decoration: none;
	@media (max-width: 790px) {
		font-size: 0.9rem;
	}
	@media (max-width: 512px) {
		display: none;
	}
`;

const HamburgerContainer = styled.div`
	display: none;
	@media (max-width: 512px) {
		display: grid;
		grid-template-columns: 100vw;
		justify-items: center;
		grid-row: 2;
	}
`;

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			userLoaded: false,
			collapseBurger: false,
		};
	}

	logout = async (e) => {
		await axios.get('http://localhost:4000/logout').then((res) => {
			localStorage.clear();
			this.props.updateUser();
		});
		this.props.history.push('/', { msg: 'Logged out!' });
	};

	checkMsg = () => {
		this.setState({
			msg: this.props.location.state.msg,
		});
	};

	render() {
		return (
			<React.Fragment>
				<PageHeader>
					<Title>
						<a href='/'>
							Urban <br />
							Boulder Project
						</a>
					</Title>
					<Navigator path='/about' name='About' />
					<Navigator path='/map' name='Map' />
					<Navigator path='/create' name='Create' />
					{localStorage.getItem('emailHash') ? (
						<LoginNav
							onClick={() =>
								this.props.history.push(
									`/dashboard/${this.props.user._id}`
								)
							}
						>
							<Gravatar
								src={`https://www.gravatar.com/avatar/${localStorage.getItem(
									'emailHash'
								)}?s=120&d=retro`}
								alt='gravatar'
							/>
							<DashboardText>Dashboard</DashboardText>
						</LoginNav>
					) : (
						<Navigator path='/login' name='Login' />
					)}
					{localStorage.getItem('name') ? (
						<Logout onClick={this.logout}>Logout</Logout>
					) : (
						<Navigator path='/register' name='Register' />
					)}
					<HamburgerContainer>
						<HamburgerNav
							user={this.props.user}
							logout={this.logout}
							collapseBurger={this.state.collapseBurger}
						/>
					</HamburgerContainer>
				</PageHeader>
				<SearchBox />
			</React.Fragment>
		);
	}
}

export default withRouter(Header);
