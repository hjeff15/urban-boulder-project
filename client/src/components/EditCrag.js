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
		console.log(this);
		const request = await axios
			.post(`http://localhost:4000/crags/${id}/edit`, crag)
			.then(this.props.history.push(`/crag/${this.state.crag.data.slug}`))
			.then((res) => {
				return res.data;
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
						updatedPage={this.updatedPage}
						postData={this.postData}
					/>
				)}
			</div>
		);
	}
}
