import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const SearchInput = styled.input`
	font-family: 'Stardos Stencil', cursive;
	display: flex;
	width: 99vw;
	color: black;
	font-size: 1.3rem;
	background-color: white;
	height: 2rem;
	border-color: gray;
	border-radius: 10px;
`;

const SearchResult = styled.a`
	/* background-color: rgba(125, 125, 124, 0.2); */
	background-color: rgba(214, 214, 214, 0.2);
	border-bottom: solid grey 1px;
	display: flex;
	width: 99vw;
	opacity: 0.7;
	color: grey;
	&:hover {
		color: black;
	}
	&.active {
		color: black;
	}
`;

class SearchBox extends Component {
	constructor() {
		super();
		this.state = {
			search: '',
			cursor: 0,
			crags: [],
		};
	}

	changeSearch = (e) => {
		this.setState({
			search: e.target.value,
		});
		this.search(e.target.value);
	};

	search = (query) => {
		const response = axios
			.get(`http://localhost:4000/api/search?q=${query}`)
			.then((res) => {
				if (res.data.length) {
					console.log(res.data);
					this.setState({
						crags: res.data,
					});
				} else {
					this.setState({
						crags: [],
					});
				}
			})
			.catch((err) => console.log(err));
		return response;
	};

	handleKeyDown = (e) => {
		const { cursor, crags } = this.state;
		// arrow up/down button should select next/previous list element
		if (e.keyCode === 38 && cursor > 0) {
			this.setState((prevState) => ({
				cursor: prevState.cursor - 1,
			}));
		}
		if (e.keyCode === 40 && cursor < crags.length - 1) {
			this.setState((prevState) => ({
				cursor: prevState.cursor + 1,
			}));
		}
		if (e.keyCode === 13 && crags.length) {
			const cragSlug = this.state.crags[this.state.cursor].slug;
			this.props.history.push(`/crag/${cragSlug}`);
			this.setState({
				search: '',
				cursor: 0,
				crags: [],
			});
		} else {
			return null;
		}
	};

	render() {
		return (
			<div>
				<SearchInput
					type='text'
					placeholder='Search...'
					value={this.state.search}
					onChange={this.changeSearch}
					onKeyUp={this.handleKeyDown}
				/>
				{this.state.crags.map((crag, index) => (
					<SearchResult
						key={index}
						href={`/crag/${crag.slug}`}
						className={
							this.state.cursor === index ? 'active' : null
						}
						// onKeyUp={this.goToPage}
					>
						<strong>{crag.cragName}</strong>
					</SearchResult>
				))}
			</div>
		);
	}
}
export default withRouter(SearchBox);
