import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	grid-area: forgotForm;
`;

const FormContainer = styled.form`
	display: grid;
	/* margin-top: 2rem; */
	grid-template-columns: 20vw auto 20vw;
	grid-template-rows: 4rem repeat(3, auto);
	grid-template-areas:
		'. title .'
		'. email-label .'
		'. email-input .'
		'. button .';
	@media (max-width: 380px) {
		grid-template-columns: 5vw auto 5vw;
	}
`;

const Title = styled.h2`
	font-size: 1.7rem;
	grid-area: title;
	justify-self: center;
	@media (max-width: 380px) {
		font-size: 1.5rem;
	}
`;

const EmailLabel = styled.label`
	font-size: 1.4rem;
	grid-area: email-label;
	justify-self: start;
	@media (max-width: 380px) {
		font-size: 1.2rem;
	}
`;

const EmailInput = styled.input`
	height: 2rem;
	grid-area: email-input;
	justify-self: center;
	font-size: 1rem;
	width: auto;
	justify-self: stretch;
`;

const ErrorMsg = styled.p`
	justify-self: center;
	color: red;
	background-color: #ffe3f1;
	border-radius: 20px;
	padding: 5px;
`;

const Submit = styled.input`
	grid-area: button;
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: center;
	width: 15rem;
	height: 2rem;
	font-size: 1.2rem;
	cursor: pointer;
	margin-top: 10px;
`;

export default class ForgotForm extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			msg: '',
		};
	}

	onEmailChange = (e) => {
		this.setState({
			email: e.target.value,
		});
	};

	submitForm = async (e) => {
		e.preventDefault();
		const user = { email: this.state.email };
		const response = axios
			.post('http://localhost:4000/forgot', user)
			.then((res) => {
				console.log(res);
				this.setState({
					msg: res.data.msg,
				});
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	};

	render() {
		return (
			<Container>
				{this.state.msg && <ErrorMsg>{this.state.msg}</ErrorMsg>}
				<FormContainer onSubmit={this.submitForm}>
					<Title>Forgot Password?</Title>
					<EmailLabel htmlFor='email'>Email:</EmailLabel>
					<EmailInput
						type='email'
						name='email'
						placeholder='Enter registered email...'
						onChange={this.onEmailChange}
					/>
					<Submit type='submit' value='Send a reset &raquo;' />
				</FormContainer>
			</Container>
		);
	}
}
