import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
`;
const Msg = styled.p`
	justify-self: center;
	color: red;
	background-color: #ffe3f1;
	border-radius: 20px;
	padding: 5px;
`;

export default class FormError extends Component {
	render() {
		return (
			<Container>
				<Msg>
					I'm Sorry! There seems to have been an error with your
					data...
				</Msg>
			</Container>
		);
	}
}
