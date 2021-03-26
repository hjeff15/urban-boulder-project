import React from 'react';

export function Handle({
	handle: { id, value, percent },
	getHandleProps,
	changeSliderValues,
}) {
	return (
		<div
			style={{
				left: `${percent}%`,
				position: 'absolute',
				marginLeft: -15,
				marginTop: 25,
				zIndex: 2,
				width: 30,
				height: 30,
				border: '1px solid #d9b92e',
				textAlign: 'center',
				cursor: 'pointer',
				borderRadius: '50%',
				backgroundColor: '#2C4870',
				color: '#d9b92e',
			}}
			{...getHandleProps(id)}
		>
			<div
				style={{
					fontFamily: 'Roboto',
					fontSize: '1.1rem',
					marginTop: -35,
				}}
			>
				V{value}
			</div>
		</div>
	);
}
