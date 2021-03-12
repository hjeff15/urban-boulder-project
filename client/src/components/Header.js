import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SearchBox from './Searchbox';
import { Squash as Hamburger } from 'hamburger-react';

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

const LoginNav = styled.a`
	color: #d9b92e;
	margin: 0.5rem;
	display: grid;
	grid-template-rows: 80% 1fr;
	text-decoration: none;
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
		/* justify-self: center;
		align-self: center; */
		justify-items: center;
		grid-row: 2;
	}
`;

const HamburgerItems = styled.a`
	font-size: 2rem;
	color: #d9b92e;
	text-decoration: none;
	border-bottom: white solid 1px;
	width: 100vw;
	&:hover {
		text-decoration: underline;
	}
`;

const menuItems = [
	{
		link: {
			name: 'home',
			path: '/',
		},
	},
	{
		link: {
			name: 'about',
			path: '/about',
		},
	},
	{
		link: {
			name: 'map',
			path: '/map',
		},
	},
	{
		link: {
			name: 'create',
			path: '/create',
		},
	},
	{
		link: {
			name: 'login',
			path: '/login',
		},
	},
	{
		link: {
			name: 'logout',
			path: '/logout',
		},
	},
];

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			userLoaded: false,
			showNavigators: false,
		};
	}

	logout = (e) => {
		axios.get('http://localhost:4000/logout').then((res) => {
			console.log(res);
			localStorage.clear();
			this.props.updateUser();
			this.props.history.push('/', { msg: 'Logged out!' });
		});
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
					<Navigators href='/about'>About</Navigators>
					<Navigators href='/map'>Map</Navigators>
					<Navigators href='/create'>Create</Navigators>
					{localStorage.getItem('emailHash') ? (
						<LoginNav href={`/dashboard/${this.props.user._id}`}>
							<Gravatar
								src={`https://www.gravatar.com/avatar/${localStorage.getItem(
									'emailHash'
								)}?s=120&d=retro`}
								alt='gravatar'
							/>
							<DashboardText>Dashboard</DashboardText>
						</LoginNav>
					) : (
						<Navigators href='/login'>Login</Navigators>
					)}
					{localStorage.getItem('name') ? (
						<Logout onClick={this.logout}>Logout</Logout>
					) : (
						<Navigators href='/register'>Register</Navigators>
					)}
					<HamburgerContainer>
						<Hamburger
							color='#d9b92e'
							size={80}
							rounded
							label='Show menu'
							duration={0.3}
							distance='sm'
							onToggle={(toggled) => {
								if (toggled) {
									this.setState({ showNavigators: true });
								} else {
									this.setState({ showNavigators: false });
								}
							}}
						/>
						{this.state.showNavigators &&
							Object.entries(menuItems).map((item, index) => {
								return (
									<HamburgerItems
										key={index}
										href={item[1].link.path}
									>
										{item[1].link.name}
									</HamburgerItems>
								);
							})}
					</HamburgerContainer>
				</PageHeader>
				<SearchBox />
			</React.Fragment>
		);
	}
}

export default withRouter(Header);
