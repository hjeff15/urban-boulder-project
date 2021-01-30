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
			loaded: false,
			crags: {},
		};
	}

	componentDidMount() {
		this.fetchData();
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
				<p>Home Component!!</p>
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
