import React, { Component } from 'react';
import styled from 'styled-components';

const Button = styled.button`
	border-radius: 20px;
	border: none;
	width: 20px;
	height: 20px;
	margin-left: 5px;
`;

const Text = styled.p`
	position: absolute;
	color: orange;
	margin: 0px;
	display: inline;
	background-color: #02263d;
	padding: 10px;
	border-radius: 20px;
`;

class Tooltip extends Component {
	constructor() {
		super();
		this.state = {
			show: false,
		};
	}
	render() {
		return (
			<div>
				<Button
					onMouseOver={() => {
						this.setState({ show: true });
					}}
					onMouseLeave={() => {
						this.setState({ show: false });
					}}
				>
					?
				</Button>
				{this.state.show && <Text>{this.props.text}</Text>}
			</div>
		);
	}
}
export default Tooltip;
