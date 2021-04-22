import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	background-color: #02263d;
	grid-template-columns: 10vw auto 10vw;
	/* justify-content: start; */
`;

const Title = styled.h1`
	color: #d9b92e;
	grid-column: 2 / 3;
`;

const Subtitle = styled.h3`
	color: orange;
	grid-column: 2 / 3;
	margin-bottom: 0.5rem;
`;

const Paragraph = styled.p`
	color: white;
	grid-column: 2 / 3;
`;

const List = styled.ul`
	color: white;
	grid-column: 2 / 3;
`;

const Link = styled.a`
	color: #d9b92e;
	font-size: 1.4rem;
	grid-column: 2 / 3;
	padding-bottom: 2rem;
	justify-self: center;
`;

export default class About extends Component {
	render() {
		return (
			<React.Fragment>
				<Container>
					<Title>Welcome To The Urban Boulder Project</Title>
					<Subtitle>What Is The UBP?</Subtitle>
					<Paragraph>
						The Urban Boulder Project (UBP) is an experimental
						database that has grown out of the need to find crags
						closer to home during the 2020 pandemic. <br />
						As the world shut down its borders many of us struggled
						to find a way of staying fit, motivated and inspired.
						However, many climbers have found that it only took a
						small leap of imagination to see that there where plenty
						of things to climb a mere stones throw from their own
						doorstep.
						<br />
						The term <q>Buildering</q> has been around for a while.
						A pretty esoteric term if ever there was one, but the
						practise has come into its own, and it seems fitting
						that there should be a place where climbers can share it
						all.
					</Paragraph>
					<Subtitle>How Does It Work?</Subtitle>
					<Paragraph>
						This site is currently in its alpha phase, meaning
						functionality is pretty basic at the moment. You are
						free to browse all the crags added and use the map to
						find what is local to you. However, if you feel like you
						have something to share, be it a new crag or make a
						comment and give the your opinion on the grade, or just
						give the place a thumbs-up, then you will need to
						register as a UBP user and login to do so. If there is
						something you feel we could do to improve this please do
						let us know by contacting us using the link at the
						bottom of this page.
					</Paragraph>
					<Subtitle>What's In The Pipeline?</Subtitle>
					<Paragraph>
						This really depends on if this service is being used. If
						there is some enthusiasm about the project then it would
						be great to develop the site to incorporate things like
						in-app messaging, recommended user-circuits, more space
						for photo uploads and individual boulder problems.
					</Paragraph>
					<Subtitle>A Few Ground Rules</Subtitle>
					<Paragraph>
						I know, rules are for chumps, but if we don't mention
						these things now then there could be hell to pay later.
					</Paragraph>
					<List>
						<li>
							Firstly, DON'T do anything ILLEGAL! This is kind of
							a big one. Just like in the outdoors, or life in
							general, please be respectful of other peoples
							property and well-being. Don't go scaling someones
							property just because it looks epic.
						</li>
						<li>DON'T DO ANYTHING ILLEGAL! PLEASE!</li>
						<li>
							With the above in mind, I guess anything goes
							really, so long as it is on public land and can be
							climbed by others too. Posting a climb that is in
							your garden might be asking for trouble.
						</li>
						<li>Climbs do NOT need to be made of stone.</li>
						<li>Climbs do NOT need to be vertical.</li>
						<li>Climbs do NOT need to be hard.</li>
						<li>
							Climbs do NOT need to be dangerous. DO NOT put
							yourself or others in danger! Did we mention about
							the legality thing?
						</li>
						<li>
							Climbs MUST NOT cause distruction or a public
							disturbance.
						</li>
						<li>Lastly, have fun!</li>
					</List>
					<Subtitle>Final Thought</Subtitle>
					<Paragraph>
						Yes, we know the site looks like IKEA. We're working on
						it...
					</Paragraph>
					<Link href='mailto:info@urbanboulderproject.com'>
						Contact Us
					</Link>
				</Container>
			</React.Fragment>
		);
	}
}
