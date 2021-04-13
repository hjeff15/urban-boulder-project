import React, { useEffect, useState } from 'react';
import {
	GoogleMap,
	useLoadScript,
	Marker,
	InfoWindow,
} from '@react-google-maps/api';
import usePlacesAutocomplete, {
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete';
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from '@reach/combobox';
import '@reach/combobox/styles.css';
import styled from 'styled-components';
import mapStyles from './mapStyles';
import axios from 'axios';
import { FaLocationArrow } from 'react-icons/fa';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

const containerStyle = {
	width: '100vw',
	height: '76vh',
};

const SearchBoxStyle = styled.div`
	position: absolute;
	display: grid;
	left: 25vw;
	height: 2rem;
	width: 45vw;
	z-index: 10;
	grid-template-columns: auto 3.5rem 3rem;
	grid-template-areas: 'search dropdown button';
	@media (max-width: 512px) {
		grid-template-columns: 70vw 15vw 15vw;
		margin-top: 20px;
		margin-left: 0px;
		width: auto;
		left: 0;
	}
	@media (max-width: 375px) {
		grid-template-columns: 65vw 25vw 10vw;
	}
`;

const ComboInput = styled.div`
	justify-self: start;
	grid-area: search;
	grid-column: 1 / 2;
`;

const GetLocationButton = styled.button`
	position: absolute;
	height: 100%;
	width: 100%;
	border: none;
	border-radius: 8px;
	z-index: 10;
	background-color: #d9b92e;
	justify-self: end;
	cursor: pointer;
	grid-area: button;
`;

const RadiusSelect = styled.select`
	grid-area: dropdown;
	border: 1px solid #d9b92e;
	font-size: 0.7rem;
	font-weight: bold;
	padding-left: 12px;
	color: #d9b92e;
	background-color: #08304b;
	-webkit-appearance: none;
	-moz-appearance: none;
	@media (max-width: 375px) {
		-webkit-appearance: none;
		-moz-appearance: none;
		text-overflow: '';
		margin-right: 0px;
		padding-left: 32%;
	}
`;

const InfoWindowGrid = styled.div`
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: auto;
	justify-items: center;
	background-color: #08304b;
	width: 165px;
	@media (max-width: 375px) {
		min-width: 150px;
	}
`;

const InfoWindowTitle = styled.a`
	text-decoration: none;
	color: #d9b92e;
	&:hover {
		text-decoration: underline;
	}
`;

const InfoWindowDiff = styled.h3`
	border: 1px solid #d9b92e;
	color: #d9b92e;
	padding: 0.2em;
`;
const InfoWindowImg = styled.img`
	border-radius: 10px;
	object-fit: contain;
	width: 100%;
	max-height: 10rem;
	justify-self: stretch;
	max-width: 160px;
`;

const center = {
	lat: 51.512519725218894,
	lng: -0.11610419428800553,
};

const radius = 5000; //km (I think...) could change dynamically???
// const zoomLevel = 14;

const options = {
	styles: mapStyles,
	mapTypeControl: false,
	fullscreenControl: false,
};

export default function Map() {
	const [crags, setCrags] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [selected, setSelected] = useState(null);
	const [userRadius, setUserRadius] = useState(radius);
	const [libraries] = useState(['places']);

	useEffect(() => {
		const response = axios
			.get(
				`${process.env.REACT_APP_SERVER}/api/crags/near?lat=${center.lat}&lng=${center.lng}&radius=${userRadius}`
			)
			.then((res) => {
				// console.log(res.data);
				setCrags(res.data);
				setLoaded(true);
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	}, [userRadius]);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
		libraries,
	});

	const mapRef = React.useRef();
	const onMapLoad = React.useCallback((map) => {
		mapRef.current = map;
	}, []);

	const panTo = React.useCallback(
		async ({ lat, lng }) => {
			mapRef.current.panTo({ lat, lng });
			mapRef.current.setZoom(14);
			// Get a new location to query API
			const response = await axios
				.get(
					`${process.env.REACT_APP_SERVER}/api/crags/near?lat=${lat}&lng=${lng}&radius=${userRadius}`
				)
				.then((res) => {
					setCrags(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
			return response;
		},
		[userRadius]
	);

	if (loadError) return 'Error Loading Maps';
	if (!isLoaded)
		return (
			<Loader
				type='TailSpin'
				color='#d9b92e'
				height={100}
				width={100}
				style={{
					display: 'grid',
					justifyContent: 'center',
					backgroundColor: '#08304b',
				}}
			/>
		);

	return (
		<React.Fragment>
			{!loaded && (
				<Loader
					type='TailSpin'
					color='#d9b92e'
					height={100}
					width={100}
					style={{
						display: 'grid',
						justifyContent: 'center',
						backgroundColor: '#08304b',
					}}
				/>
			)}
			<Search panTo={panTo} setUserRadius={setUserRadius} />
			<GoogleMap
				mapContainerStyle={containerStyle}
				zoom={13}
				center={center}
				options={options}
				onLoad={onMapLoad}
			>
				{crags.map((crag) => (
					<Marker
						key={crag._id}
						position={{
							lat: crag.location.coordinates[1],
							lng: crag.location.coordinates[0],
						}}
						onClick={() => {
							setSelected(crag);
						}}
					/>
				))}

				{selected ? (
					<InfoWindow
						position={{
							lat: selected.location.coordinates[1],
							lng: selected.location.coordinates[0],
						}}
						onCloseClick={() => {
							setSelected(null);
						}}
						style={{
							display: 'grid',
							justifyContent: 'center',
							backgroundColor: '#08304b',
						}}
					>
						<InfoWindowGrid>
							<h2>
								<InfoWindowTitle
									href={`/crag/${selected.slug}`}
								>
									{selected.cragName}
								</InfoWindowTitle>
							</h2>
							<InfoWindowImg
								src={`/images/${selected.photo}`}
								width={150}
								alt='cragImage'
							/>
							<InfoWindowDiff>
								v{selected.minDifficulty} - v
								{selected.maxDifficulty}
							</InfoWindowDiff>
						</InfoWindowGrid>
					</InfoWindow>
				) : null}
			</GoogleMap>
		</React.Fragment>
	);
}

function Locate({ panTo }) {
	return (
		<GetLocationButton
			onClick={() => {
				navigator.geolocation.getCurrentPosition(
					(position) =>
						panTo({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						}),
					() => null,
					options
				);
			}}
		>
			<FaLocationArrow
				style={{
					color: 'white',
					width: '1.2em',
					height: '1.2em',
				}}
			/>
		</GetLocationButton>
	);
}

function Search({ panTo, setUserRadius }) {
	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: {
			location: {
				lat: () => 51.512519725218894,
				lng: () => -0.11610419428800553,
			},
			radius: radius, //This can be user-dynamic at some point...
		},
	});

	return (
		<SearchBoxStyle>
			<RadiusSelect
				name='distance'
				id='distance'
				defaultValue='5000'
				onChange={(e) => {
					setUserRadius(e.target.value);
					// console.log(e.target.value);
				}}
			>
				<option value='1000'>1km</option>
				<option value='2000'>2km</option>
				<option value='5000'>5km</option>
				<option value='10000'>10km</option>
				<option value='20000'>20km</option>
				<option value='30000'>30km</option>
			</RadiusSelect>
			<Combobox
				onSelect={async (address) => {
					setValue(address, false);
					clearSuggestions();
					try {
						const results = await getGeocode({ address });
						const { lat, lng } = await getLatLng(results[0]);
						panTo({ lat, lng });
					} catch (error) {
						console.log('Error!', error);
					}
				}}
			>
				<ComboInput>
					<ComboboxInput
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
						}}
						disabled={!ready}
						placeholder='Enter a location...'
						style={{
							height: '2rem',
							width: '100%',
						}}
					/>
				</ComboInput>
				<ComboboxPopover>
					<ComboboxList>
						{status === 'OK' &&
							data.map(({ place_id, description }) => (
								<ComboboxOption
									key={place_id}
									value={description}
								/>
							))}
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
			<Locate panTo={panTo} />
		</SearchBoxStyle>
	);
}

// See this link for info
// https://www.youtube.com/watch?v=WZcxJGmLbSo

// See the docs
// https://react-google-maps-api-docs.netlify.app/
