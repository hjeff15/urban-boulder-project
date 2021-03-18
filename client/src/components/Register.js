import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';

// const Container = styled.div`
// 	display: grid;
// `;

const ContainerForm = styled.form`
	display: grid;
	grid-template-columns: 15% repeat(3, 1fr) 15%;
	grid-template-rows: repeat(5, 4rem);
	grid-template-areas:
		'. title title title .'
		'. name-label name-input name-input .'
		'. email-label email-input email-input .'
		'. password-label password-input password-input .'
		'. confirm-password-label confirm-password-input confirm-password-input .'
		'. . register-button register-button .';
	justify-items: center;
	@media (max-width: 830px) {
		grid-template-columns: 10% repeat(3, 1fr) auto;
	}
	@media (max-width: 680px) {
		grid-template-columns: 20vw auto 20vw;
		grid-template-rows: repeat(10, auto);
		grid-template-areas:
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

const Submit = styled.input`
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

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			// photo: null,
			// photoPreviewURL: {},
			// photoLoaded: false,
			password: '',
			passwordConfirm: '',
			data: '',
			errors: [],
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

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			passwordConfirm: this.state.passwordConfirm,
		};
		axios
			.post('http://localhost:4000/register', newUser)
			.then((res) => {
				console.log(res.data);
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
			}) // re-direct to login on successful register
			.catch(function (error) {
				console.log('Error on Authentication:', error);
			});
	};

	logout = (e) => {
		axios.get('http://localhost:4000/logout').then((res) => {
			console.log(res);
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
				{this.state.loadedError
					? this.state.errors.map((err, i) => (
							<p className='error-msg' key={i}>
								{err}
							</p>
					  ))
					: null}
				<ContainerForm onSubmit={this.onSubmit}>
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

					<Submit type='submit' value='Register' />
				</ContainerForm>
				{/* <button onClick={this.logout}>Logout</button> */}
			</div>
		);
	}
}
