import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const Navigators = styled.p`
	color: #d9b92e;
	font-size: 1.7rem;
	text-decoration: none;
	justify-self: center;
	align-self: center;
	margin: 0px;
	cursor: pointer;
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

function Navigator(props) {
	const history = useHistory();
	return (
		<Navigators onClick={() => history.push(`${props.path}`)}>
			{props.name}
		</Navigators>
	);
}

export default Navigator;
