import React, { Component } from 'react';
import axios from 'axios';
// import styled from 'styled-components';
import Create from './Create';

export default class EditCrag extends Component {
	constructor() {
		super();
		this.state = {
			crag: '',
			loaded: false,
		};
		this.postData = this.postData.bind(this);
	}
	componentDidMount() {
		const cragId = Object.values(this.props.match.params).toString();
		this.fetchData(cragId);
	}

	async fetchData(id) {
		const response = await axios
			.get(`http://localhost:4000/crags/${id}/edit`)
			.then((result) => {
				this.setState({ crag: result, loaded: true });
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		return response;
	}

	async postData(crag, id) {
		const request = await axios
			.post(`http://localhost:4000/crags/${id}/edit`, crag)
			.then((res) => {
				console.log(res);
				this.props.history.push(`/crag/${res.data.slug}`);
			})
			.catch((err) => {
				console.log(err);
			});
		return request;
	}

	render() {
		return (
			<div>
				<h1>Edit Form</h1>
				{this.state.loaded && <h2>{this.state.crag.data.cragName}</h2>}
				{this.state.loaded && (
					<Create
						cragCardInfo={this.state.crag}
						postData={this.postData}
					/>
				)}
			</div>
		);
	}
}
