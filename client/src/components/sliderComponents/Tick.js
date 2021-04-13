import React, { useEffect, useState } from 'react';

export function Tick({ tick, count }) {
	const winWidth = window.innerWidth < 600 ? true : false;
	const [width, setWidth] = useState(winWidth);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 600) {
				setWidth(true);
			} else {
				setWidth(false);
			}
		};
		window.addEventListener('resize', handleResize);
	});

	return (
		<div>
			<div
				style={{
					position: 'absolute',
					marginTop: 52,
					marginLeft: -0.5,
					width: 1,
					height: 8,
					backgroundColor: 'silver',
					left: `${tick.percent}%`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					marginTop: 60,
					fontSize: width ? '0.5rem' : '1rem',
					textAlign: 'center',
					marginLeft: `${-(100 / count) / 2}%`,
					width: `${100 / count}%`,
					left: `${tick.percent}%`,
					color: '#d9b92e',
				}}
			>
				v{tick.value}
			</div>
		</div>
	);
}
