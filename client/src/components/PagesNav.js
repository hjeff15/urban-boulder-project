import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	grid-template-columns: repeat(3, auto);
`;

const NavText = styled.p`
	color: #d9b92e;
	margin-top: 10px;
	font-size: 1.1rem;
`;
const Arrows = styled.a`
	color: white;
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	font-size: 1.5rem;
`;

export function PagesNav(props) {
	return (
		<Container>
			{props.page > 1 ? (
				<Arrows href={`/pages/${props.page - 1}`}> &#60;&#60; </Arrows>
			) : null}
			<NavText>
				Page {props.page} of {props.pages}
			</NavText>
			{props.page < props.count ? (
				<Arrows href={`/pages/${parseInt(props.page) + 1}`}>
					{' '}
					&#62;&#62;{' '}
				</Arrows>
			) : null}
		</Container>
	);
}
