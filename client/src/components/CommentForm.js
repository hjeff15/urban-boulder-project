import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';

const CommentFormDiv = styled.div`
	grid-area: commentForm;
	box-sizing: border-box;
	display: grid;
	grid-template-rows: repeat(2, auto);
	grid-template-areas:
		'title'
		'form';
`;

const FormTitle = styled.p`
	grid-area: title;
	color: #d9b92e;
	font-size: 1.5rem;
	justify-self: center;
`;

const Form = styled.form`
	grid-area: form;
	display: grid;
	grid-template-rows: repeat(3, auto);
	grid-template-areas:
		'textArea'
		'grades'
		'button';
	margin-bottom: 1rem;
`;

const ReviewTextArea = styled.textarea`
	grid-area: textArea;
`;

const GradeContainer = styled.div`
	grid-area: grades;
	justify-self: center;
	margin: 1rem;
`;

const GradeInput = styled.input`
	display: none;
`;

const GradeLabel = styled.label`
	cursor: pointer;
	font-size: 1.2rem;
	:hover {
		color: #d9b92e;
		font-size: 1.6rem;
	}
`;

const SubmitButton = styled.button`
	grid-area: button;
	background-color: #d9b92e;
	color: white;
	border-radius: 10px;
	border: none;
	justify-self: center;
	width: 15rem;
	height: 2rem;
	font-size: 1.2rem;
	cursor: pointer;
	margin-top: 10px;
`;

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

class CommentForm extends Component {
	constructor() {
		super();
		this.state = {
			text: '',
			difficulty: '',
		};
	}

	submitForm = async (e) => {
		e.preventDefault(e);
		const user = this.props.user;
		const review = {
			author: user,
			text: this.state.text,
			difficulty: this.state.difficulty,
		};

		const response = await axios
			.post(
				`http://localhost:4000/comments/${this.props.cragInfo.data._id}`,
				{
					review,
					user,
				}
			)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	};

	handleClick = (e) => {
		this.setState({
			difficulty: e.target.value,
		});
	};

	handleTextChange = (e) => {
		this.setState({
			text: e.target.value,
		});
	};

	render() {
		return (
			<CommentFormDiv>
				<FormTitle>CRAG COMMENT FORM</FormTitle>
				<Form onSubmit={this.submitForm}>
					<ReviewTextArea
						name='text'
						placeholder='Climbed this? Have something to say? Think the grading needs correcting? Leave a comment here...'
						cols='30'
						rows='10'
						required
						onChange={this.handleTextChange}
					/>
					<GradeContainer>
						{grades.map((grade, index) => {
							return (
								<GradeLabel
									htmlFor={`v${grade}`}
									key={index}
									onClick={this.handleClick}
								>
									{' '}
									{`v${grade}`}
									<GradeInput
										type='radio'
										required
										id={`v${grade}`}
										name='difficulty'
										value={`v${grade}`}
									/>
								</GradeLabel>
							);
						})}
					</GradeContainer>
					<SubmitButton type='submit'>Sumbit</SubmitButton>
				</Form>
			</CommentFormDiv>
		);
	}
}

export default CommentForm;
