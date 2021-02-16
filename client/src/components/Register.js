import axios from 'axios';
import React, { Component } from 'react';

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
	// onChangePhoto = (e) => {
	// 	this.setState({
	// 		photo: e.target.files[0],
	// 		photoPreviewURL: URL.createObjectURL(e.target.files[0]),
	// 		photoLoaded: true,
	// 	});
	// };
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
			this.props.history.push({
				pathname: '/',
				state: { logoutMsg: 'See you later!!!' },
			});
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
				<form onSubmit={this.onSubmit}>
					<h1>REGISTER PAGE</h1>
					<label htmlFor='name'>
						Name:
						<input
							type='text'
							name='name'
							required
							defaultValue={this.state.name}
							onChange={this.onChangeName}
						/>
					</label>
					<label htmlFor='email'>
						Email:
						<input
							type='email'
							name='email'
							required
							defaultValue={this.state.email}
							onChange={this.onChangeEmail}
						/>
					</label>
					{/* <label htmlFor='photo'>Image(optional) </label> */}
					{/* <input
						type='file'
						name='photo'
						accept='image/gif, image/png, image/jpeg'
						onChange={this.onChangePhoto}
					/>
					{this.state.photoLoaded && (
						<img
							src={this.state.photoPreviewURL}
							alt='crag'
							width={200}
						/>
					)} */}
					<label htmlFor='password'>
						Password:
						<input
							type='password'
							name='password'
							required
							defaultValue={this.state.password}
							onChange={this.onChangePassword}
						/>
					</label>
					<label htmlFor='password-confirm'>
						Password confirm:
						<input
							type='password'
							name='passwordConfirm'
							required
							defaultValue={this.state.passwordConfirm}
							onChange={this.onChangePasswordConfirm}
						/>
					</label>
					<input type='submit' value='Register ->' />
				</form>
				<button onClick={this.logout}>Logout</button>
			</div>
		);
	}
}
