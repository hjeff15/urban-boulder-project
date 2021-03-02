import axios from 'axios';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import SearchBox from './Searchbox';

//STYLES

const PageHeader = styled.header`
	font-family: 'Roboto', sans-serif;
	background-color: #02263d;
	color: white;
	display: grid;
	grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr;
	border-bottom: solid 2px #fff;
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
`;

const Navigators = styled.a`
	color: #d9b92e;
	font-size: 1.4rem;
	text-decoration: none;
	/* margin-top: 0.8rem; */
	margin: 0.5rem;
	/* border: white solid 1px; */
	/* border-radius: 5px 20px 20px 5px; */
	padding: 10px;
	padding-top: 2.2rem;
`;

const Logout = styled.p`
	color: white;
	font-size: 1.4rem;
	/* margin-top: 0.8rem; */
	margin: 0.5rem;
	/* border: white solid 1px;
	border-radius: 5px 20px 20px 5px; */
	padding: 10px;
	padding-top: 2.2rem;
	cursor: pointer;
`;

const LoginNav = styled.a`
	color: white;
	/* border: white solid 1px;
	border-radius: 5px 20px 20px 5px; */
	margin: 0.5rem;
	display: grid;
	grid-template-rows: 80% 1fr;
	text-decoration: none;
`;

const Gravatar = styled.img`
	width: 70px;
	border-radius: 40px;
	place-self: center;
`;

const DashboardText = styled.p`
	margin: 0px;
	place-self: center;
	text-decoration: none;
`;

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			userLoaded: false,
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
			<div>
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
				</PageHeader>
				<SearchBox />
			</div>
		);
	}
}

export default withRouter(Header);
