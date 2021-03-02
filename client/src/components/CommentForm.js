import axios from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';

const CommentFormDiv = styled.div`
	grid-area: commentForm;
	box-sizing: border-box;
	display: grid;
	grid-template-rows: 0.7fr 2fr 0.7fr;
	grid-template-areas:
		'title'
		'textArea'
		'grades';
`;

const FormTitle = styled.p`
	grid-area: title;
`;

const ReviewTextArea = styled.textarea`
	grid-area: textArea;
`;

const GradeDiv = styled.div`
	grid-area: grades;
`;

const GradeInput = styled.input`
	display: none;
`;

const GradeLabel = styled.label`
	cursor: pointer;
	:hover {
		color: #d9b92e;
	}
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
				<form onSubmit={this.submitForm}>
					<ReviewTextArea
						name='text'
						placeholder='Climbed this? Have something to say? Think the grading needs correcting? Leave a comment here...'
						cols='30'
						rows='10'
						required
						onChange={this.handleTextChange}
					></ReviewTextArea>
					<GradeDiv>
						{grades.map((grade, index) => {
							return (
								<GradeLabel
									htmlFor={`v${grade}`}
									key={index}
									onClick={this.handleClick}
								>
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
					</GradeDiv>

					<button type='submit'>Sumbit</button>
				</form>
			</CommentFormDiv>
		);
	}
}

export default CommentForm;
