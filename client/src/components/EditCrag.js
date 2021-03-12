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
			msg: '',
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
				console.log(result);
				if (result.data.author !== localStorage._id) {
					this.setState({
						msg: `I'm afraid you must be the author of ${result.data.cragName} in order to edit it`,
					});
				} else {
					this.setState({ crag: result, loaded: true });
				}
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
				this.props.history.push(`/crag/${res.data.slug}`, {
					msg: 'Crag successfully updated!',
				});
			})
			.catch((err) => {
				console.log(err);
			});
		return request;
	}

	render() {
		return (
			<React.Fragment>
				{/* <h1>Edit Form</h1> */}
				{this.state.msg && <h2>{this.state.msg}</h2>}
				{/* {this.state.loaded && <h2>{this.state.crag.data.cragName}</h2>} */}
				{this.state.loaded && (
					<Create
						cragCardInfo={this.state.crag}
						postData={this.postData}
						user={localStorage}
					/>
				)}
			</React.Fragment>
		);
	}
}
