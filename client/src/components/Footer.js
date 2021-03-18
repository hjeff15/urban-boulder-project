import React from 'react';
import styled from 'styled-components';

const Title = styled.p`
	color: white;
	justify-self: center;
	font-size: 1.2rem;
	@media (max-width: 512px) {
		font-size: 0.9rem;
		text-align: center;
	}
`;
const Link = styled.a`
	color: orange;
`;

function Footer() {
	return (
		<Title>
			Want to get in touch? You can reach us{' '}
			<Link href='mailto:info@urbanboulderproject.com'>here</Link>
		</Title>
	);
}

export default Footer;
