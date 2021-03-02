import axios from 'axios';
import React, { Component } from 'react';
import ForgotForm from './ForgotForm';

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
				console.log(res.data);
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
			<div>
				<form>
					<h2>LOGIN PAGE</h2>
					<label htmlFor='email'>
						Email:
						<input
							type='email'
							name='email'
							required
							defaultValue={this.state.email}
							onChange={this.changeEmail}
						/>
					</label>
					<label htmlFor='password'>
						Password:
						<input
							type='password'
							name='password'
							required
							defaultValue={this.state.password}
							onChange={this.changePassword}
						/>
					</label>
				</form>
				<button onClick={this.loginUser}>Login</button>
				<ForgotForm />
			</div>
		);
	}
}
