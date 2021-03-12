import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: auto;
	grid-template-areas: 'form';
	justify-items: center;
	margin-top: 5rem;
`;

const FormContainer = styled.form`
	background-color: #08304b;
	display: grid;
	grid-template-columns: auto repeat(2, 12rem);
	grid-template-rows: repeat(2, 3rem) repeat(3, 3rem);
	grid-template-areas:
		'title title title'
		'subtitle subtitle subtitle'
		'name-label name name'
		'email-label email email'
		'. submit submit';
	border-radius: 5px;
`;

const Title = styled.h2`
	color: #d9b92e;
	grid-area: title;
	justify-self: center;
	margin-top: 15px;
`;
const Subtitle = styled.h3`
	color: #d9b92e;
	grid-area: subtitle;
	justify-self: center;
	margin: auto;
`;

const NameLabel = styled.label`
	color: #d9b92e;
	grid-area: name-label;
	font-size: 1.4rem;
	align-self: center;
	margin: 5px;
`;
const EmailLabel = styled.label`
	color: #d9b92e;
	grid-area: email-label;
	font-size: 1.4rem;
	align-self: center;
	justify-self: end;
	margin: 5px;
`;

const Name = styled.input`
	grid-area: name;
	margin: 10px 15px 5px 5px;
`;

const Email = styled.input`
	grid-area: email;
	margin: 10px 15px 5px 5px;
`;

const Submit = styled.input`
	grid-area: submit;
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	width: 22rem;
	height: 2rem;
	font-size: 1.2rem;
	cursor: pointer;
	justify-self: start;
	margin: 5px;
`;

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

	submitUserUpdate = async (e) => {
		e.preventDefault();
		const userId = localStorage.getItem('_id');
		const updateInfo = {
			name: this.state.name,
			email: this.state.email,
		};
		const response = await axios
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
		this.checkMsg();
		return response;
	};

	render() {
		return (
			<Container>
				{/* <Title>Welcome to the dashboard</Title> */}
				{this.state.msg && <h3>{this.state.msg}</h3>}
				{/* <Subtitle>Edit your info: </Subtitle> */}
				<FormContainer onSubmit={this.submitUserUpdate}>
					<Title>Welcome to the dashboard</Title>
					{this.state.msg && <h3>{this.state.msg}</h3>}
					<Subtitle>Edit your info: </Subtitle>
					<NameLabel htmlFor='name'>Name:</NameLabel>
					<Name
						type='text'
						name='name'
						defaultValue={this.state.name}
						onChange={this.onChangeName}
					/>

					<EmailLabel htmlFor='email'>Email:</EmailLabel>
					<Email
						type='email'
						name='email'
						defaultValue={this.state.email}
						onChange={this.onChangeEmail}
					/>
					<Submit type='submit' value='Update &raquo;' />
				</FormContainer>
			</Container>
		);
	}
}
