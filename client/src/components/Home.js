import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CragCard from './CragCard';

const CragCardList = styled.ul`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
`;

export default class Home extends Component {
	constructor() {
		super();
		this.state = {
			loggedIn: false,
			loaded: false,
			crags: {},
			user: {},
			msg: '',
		};
	}

	componentDidMount() {
		this.fetchData();
		this.checkMsg();
		this.updateUserState();
	}

	updateUserState() {
		this.setState({
			user: this.props.user,
		});
	}

	checkMsg() {
		return this.props.location.state
			? this.setState({ msg: this.props.location.state.msg })
			: this.setState({ msg: '' });
	}

	async fetchData() {
		const response = await axios
			.get('http://localhost:4000/')
			.then((result) => {
				this.setState({ crags: result, loaded: true });
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		return response;
	}

	render() {
		return (
			<div>
				{this.state.msg && <h2>{this.state.msg}</h2>}
				{localStorage.getItem('name') ? (
					<h3>{`Currently Logged In as:  ${localStorage.getItem(
						'name'
					)}`}</h3>
				) : null}
				{!this.state.loaded && <p>Loading...</p>}
				{this.state.loaded && (
					<CragCardList className='crag-cards'>
						{Object.keys(this.state.crags.data).map(
							(key, index) => (
								<CragCard
									key={index}
									cragInfo={this.state.crags.data[key]}
								>
									Crag Name:{' '}
									{this.state.crags.data[key].cragName}
								</CragCard>
							)
						)}
					</CragCardList>
				)}
			</div>
		);
	}
}
