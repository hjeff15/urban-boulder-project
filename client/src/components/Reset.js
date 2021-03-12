import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	grid-template-columns: repeat(2, auto);
	grid-template-rows: repeat(2, auto);
	grid-template-areas: 'title title' 'form form';
`;

const Title = styled.h1`
	grid-area: title;
	justify-self: center;
	font-size: 1.8rem;
	@media (max-width: 512px) {
		font-size: 1.5rem;
	}
`;
const Form = styled.form`
	grid-area: form;
	display: grid;
	grid-template-columns: repeat(4, auto);
	grid-template-rows: repeat(5, auto);
	grid-template-areas:
		'. new-label new-label .'
		'. new-input new-input .'
		'. confirm-new-label confirm-new-label .'
		'. confirm-new-input confirm-new-input .'
		'. button button .';
`;
const PasswordLabel = styled.label`
	grid-area: new-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 512px) {
		font-size: 1.2rem;
	}
`;
const PasswordInput = styled.input`
	grid-area: new-input;
	height: 2rem;
	font-size: 0.8rem;
	width: auto;
	justify-self: stretch;
`;
const PasswordConfirmLabel = styled.label`
	grid-area: confirm-new-label;
	font-size: 1.5rem;
	justify-self: start;
	@media (max-width: 512px) {
		font-size: 1.2rem;
	}
`;
const PasswordConfirmInput = styled.input`
	grid-area: confirm-new-input;
	height: 2rem;
	font-size: 0.8rem;
	width: auto;
	justify-self: stretch;
`;

const Button = styled.input`
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

export default class Reset extends Component {
	constructor() {
		super();
		this.state = {
			newPassword: '',
			newPasswordConfirm: '',
			msg: '',
			matchPasswordMessage: false,
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData = async () => {
		const response = await axios
			.get(
				`http://localhost:4000/account/reset/${this.props.match.params.token}`
			)
			.then((res) => {
				if (res.data.msg) {
					this.setState({
						msg: res.data.msg,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	};

	submitNewPassword = (e) => {
		e.preventDefault();
		if (this.state.newPassword !== this.state.newPasswordConfirm) {
			this.setState({
				matchPasswordMessage: true,
			});
			return;
		}
		const newPasswords = {
			password: this.state.newPassword,
			passwordConfirm: this.state.newPasswordConfirm,
		};
		const postData = axios
			.post(
				`http://localhost:4000/account/reset/${this.props.match.params.token}`,
				newPasswords
			)
			.then((res) => {
				console.log(res);
				localStorage.clear();
				localStorage.setItem('name', res.data.updatedUser.name);
				localStorage.setItem('_id', res.data.updatedUser._id);
				localStorage.setItem(
					'emailHash',
					res.data.updatedUser.emailHash
				);
				localStorage.setItem('loggedIn', true);
				this.props.history.push('/', {
					user: res.data,
					msg: `Welcome Back ${res.data.updatedUser.name}! Your password was successfully update!`,
				});
			})
			.catch((err) => {
				console.log(err);
			});
		return postData;
	};

	passwordInput = (e) => {
		this.setState({
			newPassword: e.target.value,
		});
	};

	passwordConfirmInput = (e) => {
		this.setState({
			newPasswordConfirm: e.target.value,
		});
	};

	render() {
		return (
			<Container>
				<Title>Reset Your Password</Title>
				{this.state.msg && <h3>{this.state.msg}</h3>}
				{!this.state.msg && (
					<Form action='post' onSubmit={this.submitNewPassword}>
						<PasswordLabel>New Password:</PasswordLabel>
						<PasswordInput
							type='text'
							name='password'
							defaultValue={this.state.newPassword}
							onChange={this.passwordInput}
						/>

						<PasswordConfirmLabel>
							Confirm New Password:
						</PasswordConfirmLabel>
						<PasswordConfirmInput
							type='text'
							name='confirm-password'
							defaultValue={this.state.newPasswordConfirm}
							onChange={this.passwordConfirmInput}
						/>

						{this.state.matchPasswordMessage && (
							<h2>
								Looks like your passwords don't match. Please
								check and try again.
							</h2>
						)}
						<Button type='submit' value='Reset Password' />
					</Form>
				)}
			</Container>
		);
	}
}
