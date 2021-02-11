import React, { Component } from 'react';

export default class ForgotForm extends Component {
	render() {
		return (
			<div>
				<h2>Forgot Password?</h2>
				<form action=''>
					<label htmlFor='email'>
						Email:
						<input type='email' name='email' />
						<input type='submit' value='Send a reset &raquo;' />
					</label>
				</form>
			</div>
		);
	}
}
