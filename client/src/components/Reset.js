import axios from 'axios';
import React, { Component } from 'react';

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
			<div>
				<h1>Reset Your Password</h1>
				{this.state.msg && <h3>{this.state.msg}</h3>}
				{!this.state.msg && (
					<form action='post' onSubmit={this.submitNewPassword}>
						<label>
							New Password:
							<input
								type='text'
								name='password'
								defaultValue={this.state.newPassword}
								onChange={this.passwordInput}
							/>
						</label>
						<label>
							Confirm New Password:
							<input
								type='text'
								name='confirm-password'
								defaultValue={this.state.newPasswordConfirm}
								onChange={this.passwordConfirmInput}
							/>
						</label>
						{this.state.matchPasswordMessage && (
							<h2>
								Looks like your passwords don't match. Please
								check and try again.
							</h2>
						)}
						<input type='submit' />
					</form>
				)}
			</div>
		);
	}
}
