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

const containerStyle = {
	width: '100vw',
	height: '100vh',
};

const ComboInput = styled.div`
	display: flex;
	flex-direction: row-reverse;
`;

const SearchBoxStyle = styled.div`
	position: absolute;
	top: 15rem;
	transform: translateX(40%);
	height: 2rem;
	width: 36rem;
	z-index: 10;
`;

const GetLocationButton = styled.button`
	position: absolute;
	top: 0.5em;
	height: 2.5rem;
	z-index: 10;
	background-color: deepskyblue;
	margin-right: -5px;
	cursor: pointer;
`;

const center = {
	lat: 51.512519725218894,
	lng: -0.11610419428800553,
};

const radius = 10 * 1000; //km (I think...) could change dynamically???

const options = {
	styles: mapStyles,
};

const libraries = ['places'];

export default function Map() {
	const [crags, setCrags] = useState([]);
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		const response = axios
			.get(
				`http://localhost:4000/api/crags/near?lat=${center.lat}&lng=${center.lng}&radius=${radius}`
			)
			.then((res) => {
				setCrags(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	}, []);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
		libraries,
	});

	const mapRef = React.useRef();
	const onMapLoad = React.useCallback((map) => {
		mapRef.current = map;
	}, []);

	const panTo = React.useCallback(async ({ lat, lng }) => {
		mapRef.current.panTo({ lat, lng });
		mapRef.current.setZoom(14);
		// Get a new location to query API
		const response = await axios
			.get(
				`http://localhost:4000/api/crags/near?lat=${lat}&lng=${lng}&radius=${radius}`
			)
			.then((res) => {
				setCrags(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
		return response;
	}, []);

	if (loadError) return 'Error Loading Maps';
	if (!isLoaded) return 'Loading Maps';

	return (
		<div>
			<Search panTo={panTo} />

			<GoogleMap
				mapContainerStyle={containerStyle}
				zoom={12}
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
					>
						<div>
							<h2>
								<a href={`/crag/${selected.slug}`}>
									{selected.cragName}
								</a>
							</h2>
							<img
								src={`/images/${selected.photo}`}
								width={150}
								alt='cragImage'
							/>
							<h3>{selected.difficulty}</h3>
						</div>
					</InfoWindow>
				) : null}
			</GoogleMap>
		</div>
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
					width: '2em',
					height: '2em',
				}}
			/>
		</GetLocationButton>
	);
}

function Search({ panTo }) {
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
							position: 'absolute',
							top: '0.5rem',
							left: '50%',
							transform: 'translateX(-50%)',
							height: '2rem',
							width: '100%',
							maxWidth: '100%',
							zIndex: '10',
						}}
					/>
					<Locate panTo={panTo} />
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
		</SearchBoxStyle>
	);
}

// See this link for info
// https://www.youtube.com/watch?v=WZcxJGmLbSo

// See the docs
// https://react-google-maps-api-docs.netlify.app/
