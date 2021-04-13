import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { striptags } from 'striptags';

const ContainerForm = styled.form`
	display: grid;
	grid-template-columns: 15% repeat(3, 1fr) 15%;
	grid-template-rows: auto repeat(5, 4rem) auto;
	grid-template-areas:
		'. . error error .'
		'. title title title .'
		'. name-label name-input name-input .'
		'. email-label email-input email-input .'
		'. password-label password-input password-input .'
		'. confirm-password-label confirm-password-input confirm-password-input .'
		'. . register-button register-button .';
	justify-items: center;
	@media (max-width: 830px) {
		grid-template-columns: 10vw repeat(3, 1fr) 10vw;
	}
	@media (max-width: 680px) {
		grid-template-columns: 20vw auto 20vw;
		grid-template-rows: auto repeat(10, auto);
		grid-template-areas:
			'.error .'
			'.title .'
			'.name-label .'
			'.name-input .'
			'.email-label .'
			'.email-input .'
			'.password-label .'
			'.password-input .'
			'.confirm-password-label .'
			'.confirm-password-input .'
			'.register-button .';
	}
	@media (max-width: 450px) {
		grid-template-columns: minmax(255px, auto);
		grid-template-areas:
			'error '
			'title '
			'name-label '
			'name-input '
			'email-label '
			'email-input '
			'password-label '
			'password-input '
			'confirm-password-label '
			'confirm-password-input '
			'register-button ';
		margin-left: 5px;
		margin-right: 5px;
	}
`;

const Title = styled.h2`
	grid-area: title;
	font-size: 1.7rem;
	margin: 0px;
	@media (max-width: 680px) {
		margin: 15px;
	}
	@media (max-width: 500px) {
		font-size: 1.3rem;
	}
`;

const NameLabel = styled.label`
	grid-area: name-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 2px;
	}
	@media (max-width: 500px) {
		font-size: 1.2rem;
	}
`;

const NameInput = styled.input`
	grid-area: name-input;
	width: 22rem;
	height: 1.4rem;
	font-size: 1rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 10px;
		width: auto;
		justify-self: stretch;
	}
`;
const EmailLabel = styled.label`
	grid-area: email-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 2px;
	}
	@media (max-width: 500px) {
		font-size: 1.2rem;
	}
`;

const EmailInput = styled.input`
	grid-area: email-input;
	width: 22rem;
	height: 1.4rem;
	font-size: 1rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 10px;
		width: auto;
		justify-self: stretch;
	}
`;
const PasswordLabel = styled.label`
	grid-area: password-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 5px;
	}
	@media (max-width: 500px) {
		font-size: 1.2rem;
	}
`;

const PasswordInput = styled.input`
	grid-area: password-input;
	width: 22rem;
	height: 1.4rem;
	font-size: 1.4rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 10px;
		width: auto;
		justify-self: stretch;
	}
`;

const ConfirmLabel = styled.label`
	grid-area: confirm-password-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 5px;
	}
	@media (max-width: 500px) {
		font-size: 1.2rem;
	}
`;

const ConfirmInput = styled.input`
	grid-area: confirm-password-input;
	width: 22rem;
	height: 1.4rem;
	font-size: 1rem;
	justify-self: start;
	@media (max-width: 680px) {
		margin-bottom: 10px;
		width: auto;
		justify-self: stretch;
	}
`;

const Submit = styled.button`
	grid-area: register-button;
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: start;
	width: 16rem;
	height: 2rem;
	/* margin-left: 6.5rem; */
	font-size: 1.2rem;
	cursor: pointer;
	@media (max-width: 680px) {
		justify-self: center;
	}
`;

const ErrorMsg = styled.p`
	grid-area: error;
	justify-self: start;
	color: red;
	background-color: pink;
	text-align: center;
	word-break: keep-all;
	border-radius: 5px;
	padding: 0.5rem;
	@media (max-width: 680px) {
		justify-self: center;
	}
`;

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			passwordConfirm: '',
			data: '',
			errors: '',
			loadedError: false,
		};
	}

	onChangeName = (e) => {
		this.setState({
			name: e.target.value,
		});
	};
	onChangeEmail = (e) => {
		this.setState({
			email: e.target.value,
		});
	};
	onChangePassword = (e) => {
		this.setState({
			password: e.target.value,
		});
	};
	onChangePasswordConfirm = (e) => {
		this.setState({
			passwordConfirm: e.target.value,
		});
	};

	onSubmit = async (e) => {
		e.preventDefault();
		const regEx = new RegExp(
			'^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$'
		);
		if (
			regEx.test(this.state.password) ||
			this.state.password !== this.state.passwordConfirm
		) {
			if (regEx.test(this.state.password)) {
				this.setState({
					loadedError: true,
					errors:
						'Password must have at least 8 characters, one letter, one uppercase letter, one number and one special character',
				});
			}
			if (this.state.password !== this.state.passwordConfirm) {
				this.setState({
					loadedError: true,
					errors: 'Passwords must match',
				});
			}
			return;
		} else {
			const newUser = {
				name: striptags(this.state.name),
				email: striptags(this.state.email),
				password: striptags(this.state.password),
				passwordConfirm: striptags(this.state.passwordConfirm),
			};
			axios
				.post(`${process.env.REACT_APP_SERVER}/register`, newUser)
				.then((res) => {
					if (res.data === 'User Found') {
						this.setState({
							loadedError: true,
							errors:
								'Sorry, that username or email already exists in our database',
						});
						return;
					} else {
						localStorage.clear();
						localStorage.setItem('name', res.data.name);
						localStorage.setItem('_id', res.data._id);
						localStorage.setItem('emailHash', res.data.emailHash);
						localStorage.setItem('loggedIn', true);
						this.props.updateUser(
							res.data.name,
							res.data._id,
							res.data.emailHash,
							res.data.likes
						);
						this.props.history.push({
							pathname: '/',
							state: {
								msg: `Welcome to your new account ${res.data.name}!`,
							},
						});
					}
				}) // re-direct to login on successful register
				.catch((errors) => {
					console.log('Error on Authentication:', errors);
					this.setState({
						loadedError: true,
						errors: errors,
					});
				});
		}
	};

	logout = (e) => {
		axios.get(`${process.env.REACT_APP_SERVER}/logout`).then((res) => {
			// console.log(res);
			localStorage.clear();
			this.props.updateUser();
			this.props.history.push(
				{
					pathname: '/',
					state: { logoutMsg: 'See you later!!!' },
				}.catch((err) => {
					console.log(err);
				})
			);
		});
	};

	render() {
		return (
			<div>
				<ContainerForm onSubmit={this.onSubmit}>
					{this.state.loadedError ? (
						<ErrorMsg>{this.state.errors}</ErrorMsg>
					) : null}
					<Title>Register your details:</Title>
					<NameLabel htmlFor='name'>Name: </NameLabel>
					<NameInput
						type='text'
						name='name'
						required
						placeholder='Username...'
						defaultValue={this.state.name}
						onChange={this.onChangeName}
					/>

					<EmailLabel htmlFor='email'>Email: </EmailLabel>
					<EmailInput
						type='email'
						name='email'
						placeholder='Email...'
						required
						defaultValue={this.state.email}
						onChange={this.onChangeEmail}
					/>

					<PasswordLabel htmlFor='password'>Password:</PasswordLabel>
					<PasswordInput
						type='password'
						name='password'
						required
						defaultValue={this.state.password}
						onChange={this.onChangePassword}
					/>

					<ConfirmLabel htmlFor='password-confirm'>
						Password confirm:
					</ConfirmLabel>
					<ConfirmInput
						type='password'
						name='passwordConfirm'
						required
						defaultValue={this.state.passwordConfirm}
						onChange={this.onChangePasswordConfirm}
					/>

					<Submit type='submit'>Register</Submit>
				</ContainerForm>
			</div>
		);
	}
}
