import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import ForgotForm from './ForgotForm';

const Container = styled.div`
	display: grid;
	grid-template-rows: 1fr 3rem 15rem;
	grid-template-areas:
		'loginForm'
		'loginButton'
		'forgotForm';
`;

const FormContainer = styled.form`
	display: grid;
	/* justify-self: center; */
	grid-template-columns: 20vw auto 20vw;
	grid-template-rows: 4rem repeat(4, auto);
	grid-template-areas:
		'. title .'
		'. email-label .'
		'. email-input .'
		'. password-label .'
		'. password-input .';
	justify-items: center;
	@media (max-width: 380px) {
		grid-template-columns: 5vw auto 5vw;
	}
`;

const Title = styled.h2`
	grid-area: title;
	font-size: 2rem;
	margin: 0px;
	align-self: center;
	@media (max-width: 380px) {
		font-size: 1.7rem;
	}
`;

const Email = styled.label`
	grid-area: email-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 380px) {
		font-size: 1.2rem;
	}
`;

const EmailBox = styled.input`
	grid-area: email-input;
	height: 2rem;
	font-size: 0.8rem;
	width: auto;
	justify-self: stretch;
`;

const PasswordBox = styled.input`
	grid-area: password-input;
	height: 2rem;
	font-size: 0.8rem;
	width: auto;
	justify-self: stretch;
`;

const Password = styled.label`
	grid-area: password-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 380px) {
		font-size: 1.2rem;
	}
`;

const Submit = styled.button`
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: center;
	width: 15rem;
	height: 2rem;
	font-size: 1.2rem;
	cursor: pointer;
	margin-top: auto;
`;

export default class Login extends Component {
	constructor() {
		super();
		this.state = {
			data: '',
			email: '',
			password: '',
		};
	}

	changeEmail = (e) => {
		this.setState({
			email: e.target.value,
		});
	};

	changePassword = (e) => {
		this.setState({
			password: e.target.value,
		});
	};

	loginUser = (e) => {
		e.preventDefault();
		const loginDetails = {
			email: this.state.email,
			password: this.state.password,
		};
		axios
			.post('http://localhost:4000/login', loginDetails)
			.then((res) => {
				// console.log(res.data);
				if (res.data === 'Not Logged In...') {
					this.props.history.push('/', {
						msg:
							'Sorry, either the username or password was not correct.',
					});
					localStorage.clear();
					return;
				}
				localStorage.clear();
				localStorage.setItem('name', res.data.name);
				localStorage.setItem('_id', res.data._id);
				localStorage.setItem('emailHash', res.data.emailHash);
				localStorage.setItem('likes', JSON.stringify(res.data.likes));
				localStorage.setItem('loggedIn', true);
				this.props.updateUser(
					res.data.name,
					res.data._id,
					res.data.emailHash,
					res.data.likes
				);
				this.props.history.push('/', {
					user: res.data,
					msg: `Welcome Back ${res.data.name}`,
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<Container>
				<FormContainer>
					<Title>Login</Title>
					<Email htmlFor='email'>Email: </Email>
					<EmailBox
						type='email'
						name='email'
						placeholder='Enter your email...'
						required
						defaultValue={this.state.email}
						onChange={this.changeEmail}
					/>

					<Password htmlFor='password'>Password:</Password>
					<PasswordBox
						type='password'
						name='password'
						placeholder='Enter your password...'
						required
						defaultValue={this.state.password}
						onChange={this.changePassword}
					/>
				</FormContainer>
				<Submit onClick={this.loginUser}>Login</Submit>
				<ForgotForm />
			</Container>
		);
	}
}
