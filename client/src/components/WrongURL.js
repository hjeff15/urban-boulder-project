import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
`;

const Msg = styled.h1`
	justify-self: center;
	color: red;
	background-color: #ffe3f1;
	border-radius: 20px;
	padding: 5px;
`;

export default class WrongURL extends Component {
	render() {
		return (
			<Container>
				<Msg>That url doesn't exist</Msg>
			</Container>
		);
	}
}
