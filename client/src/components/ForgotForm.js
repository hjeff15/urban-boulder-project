import axios from 'axios';
import React, { Component } from 'react';

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
			<div>
				{this.state.msg && <h2>{this.state.msg}</h2>}
				<h2>Forgot Password?</h2>
				<form onSubmit={this.submitForm}>
					<label htmlFor='email'>
						Email:
						<input
							type='email'
							name='email'
							onChange={this.onEmailChange}
						/>
						<input type='submit' value='Send a reset &raquo;' />
					</label>
				</form>
			</div>
		);
	}
}
