import axios from 'axios';
import React, { Component } from 'react';

export default class Dashboard extends Component {
	constructor() {
		super();
		this.state = {
			dataLoaded: false,
			name: '',
			email: '',
			msg: '',
		};
	}
	componentDidMount() {
		this.fetchData();
		this.checkMsg();
	}

	async fetchData() {
		const userId = localStorage.getItem('_id');
		const response = await axios
			.get(`http://localhost:4000/account/${userId}`)
			.then((res) => {
				if (res) {
					this.setState({
						dataLoaded: true,
						name: res.data.name,
						email: res.data.email,
					});
				} else {
					return;
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		return response;
	}

	checkMsg() {
		return this.props.location.state
			? this.setState({ msg: this.props.location.state.msg })
			: this.setState({ msg: '' });
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

	submitUserUpdate = (e) => {
		e.preventDefault();
		const userId = localStorage.getItem('_id');
		const updateInfo = {
			name: this.state.name,
			email: this.state.email,
		};
		axios
			.post(`http://localhost:4000/account/${userId}`, updateInfo)
			.then((res) => {
				console.log(res);
				this.props.history.push(`/dashboard/${res.data._id}`, {
					user: res.data,
					msg: `Details updated ${res.data.name}`,
				});
				return res.data;
			})
			.catch((err) => {
				console.log(err);
				this.setState({
					formError: true,
				});
			});
	};

	render() {
		return (
			<div>
				<h2>Welcome to the dashboard</h2>
				{this.state.msg && <h3>{this.state.msg}</h3>}
				<div>
					<h3>Edit your info: </h3>
					<form onSubmit={this.submitUserUpdate}>
						<label htmlFor='name'>
							Name:
							<input
								type='text'
								name='name'
								defaultValue={this.state.name}
								onChange={this.onChangeName}
							/>
						</label>
						<label htmlFor='email'>
							Email:
							<input
								type='email'
								name='email'
								defaultValue={this.state.email}
								onChange={this.onChangeEmail}
							/>
						</label>
						<input type='submit' value='Update &raquo' />
					</form>
				</div>
			</div>
		);
	}
}
