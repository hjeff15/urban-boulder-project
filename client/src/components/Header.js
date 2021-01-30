import React, { Component } from 'react';
import styled from 'styled-components';

const PageHeader = styled.header`
	font-family: 'Stardos Stencil', cursive;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	background-color: white;
`;

const Title = styled.h1`
	color: black;
	border: black solid 1px;
	padding: 1.2rem;
	margin: 2px;
	border-radius: 20px 0 0 20px;
	a {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
`;

const Navigators = styled.a`
	color: black;
	font-size: 1.4rem;
	margin-top: 0.8rem;
	border: black solid 1px;
	padding: 10px;
	padding-top: 2.2rem;
`;

const LoginNav = styled.a`
	color: black;
	font-size: 1.4rem;
	margin-top: 0.8rem;
	border: black solid 1px;
	padding: 10px;
	padding-top: 2.2rem;
`;
const SearchBox = styled.input`
	font-family: 'Stardos Stencil', cursive;
	display: flex;
	width: 99vw;
	color: black;
	font-size: 1.3rem;
	background-color: white;
	height: 2rem;
	border-color: white;
	border-radius: 10px;
`;

export default class Header extends Component {
	render() {
		return (
			<div>
				<PageHeader>
					<div>
						<Title>
							<a href='/'>
								Urban <br />
								Boulder Project
							</a>
						</Title>
					</div>
					<Navigators href='/about'>About</Navigators>
					<Navigators href='/crags'>View Crags</Navigators>
					<Navigators href='/blog'>Blogs</Navigators>
					<Navigators href='/create'>Create</Navigators>
					<LoginNav href='/login'>Register/Login</LoginNav>
				</PageHeader>
				<SearchBox type='text' defaultValue='...Search for crags...' />
			</div>
		);
	}
}
