import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Squash as Hamburger } from 'hamburger-react';
import styled from 'styled-components';

const HamburgerItems = styled.p`
	font-size: 2rem;
	color: #d9b92e;
	text-decoration: none;
	border-bottom: white solid 1px;
	width: 100vw;
	margin: 0px;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;
const HamburgerLogout = styled.p`
	font-size: 2rem;
	color: #d9b92e;
	text-decoration: none;
	border-bottom: white solid 1px;
	width: 100vw;
	margin: 0px;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;

const menuItems = [
	{
		name: 'home',
		path: '/',
	},
	{
		name: 'about',
		path: '/about',
	},
	{
		name: 'map',
		path: '/map',
	},
	{
		name: 'create',
		path: '/create',
	},
	{
		name: 'login',
		path: '/login',
		showIfLoggedIn: false,
	},
	{
		name: 'register',
		path: '/register',
		showIfLoggedIn: false,
	},
];

function HamburgerNav(props) {
	const [isOpen, setOpen] = useState(false);
	const history = useHistory();
	return (
		<React.Fragment>
			<Hamburger
				color='#d9b92e'
				size={80}
				rounded
				label='Show menu'
				duration={0.3}
				distance='sm'
				toggled={isOpen}
				toggle={setOpen}
			/>
			{isOpen &&
				Object.entries(menuItems).map((item, index) => {
					if (props.user._id && item[1].name === 'login') {
						return (
							<HamburgerItems
								key={index}
								// href={`/dashboard/${props.user._id}`}
								onClick={() => {
									history.push(
										`/dashboard/${props.user._id}`
									);
									setOpen(false);
								}}
							>
								dashboard
							</HamburgerItems>
						);
					}
					if (props.user._id && item[1].name === 'register') {
						return (
							<HamburgerLogout
								key={index}
								onClick={() => {
									props.logout();
									setOpen(false);
								}}
							>
								logout
							</HamburgerLogout>
						);
					} else {
						return (
							<HamburgerItems
								key={index}
								onClick={() => {
									history.push(item[1].path);
									setOpen(false);
								}}
							>
								{item[1].name}
							</HamburgerItems>
						);
					}
				})}
		</React.Fragment>
	);
}
export default HamburgerNav;
