import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Table } from "react-bootstrap";
import TableBorder from "./components/TableBorder";
import Container from "react-bootstrap/Container";

import TableDataBorder from "./components/TableDataBorder";
import LoadingSpinner from "./components/LoadingSpinner";
import Error from "./components/Error";


const GET_STATION = gql`
    query Query($getStationId: Int!) {
        getStation(id: $getStationId) {
            stationId
            name
            address
            city
            capacity
            longitude
            latitude
            numOfJourneysStartingFrom
            numOfJourneysReturningTo
            averageDistanceStartingFrom
            averageDistanceReturnedTo
            mostPopularReturnStationsForJourneysStartingFrom {
                stationId
                name
            }
            mostPopularDepartureStationsForJourneysReturnedTo {
                stationId
                name
            }
        }
    }
`;

function Station () {
	const { id } = useParams();
	
	const { loading, error, data } = useQuery( GET_STATION, {
		variables : { getStationId : Number( id ) }, // From params it is String, but we need Number
	} );
	
	if ( loading ) return <LoadingSpinner/>;
	if ( error ) return <Error error={ error }/>;
	
	const station = data.getStation;
	const position = [station.latitude, station.longitude];
	
	return (
		<Container>
			
			<h1 className="text-center">{ station.stationId }, { station.name }</h1>
			<Row className="border mt-4 ">
				<Col className="" xs={ { span : 12, order : 2 } } md={ { span : 6, order : 1 } }>
					<StationBasicInfo station={ station }/>
				</Col>
				<Col className="border" xs={ { span : 12, order : 1 } } md={ { span : 6, order : 2 } }>
					<MapContainer center={ position } zoom={ 14 } scrollWheelZoom={ false }>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={ position }>
							<Popup>
								<span>{ station.stationId }, { station.name }<br/>{ station.address }</span>
							</Popup>
						</Marker>
					</MapContainer>
				</Col>
			</Row>
			
			<Row className="mt-5 mb-5 text-center">
				<h4 className="mb-3">Top 5 most popular...</h4>
				<Col md>
					<p className="info-header mb-2">Departure stations for journeys <em>ending</em> at { station.name }
					</p>
					<MostPopularStationTable stations={ station.mostPopularDepartureStationsForJourneysReturnedTo }/>
				</Col>
				<Col>
					<p className="info-header mb-2">Return stations for journeys <em>starting</em> from { station.name }:
					</p>
					<MostPopularStationTable stations={ station.mostPopularReturnStationsForJourneysStartingFrom }/>
				</Col>
			</Row>
		</Container>
	)
}

function MostPopularStationTable ({ stations }) {
	
	return (
		<Container>
			<TableBorder>
				<Table striped borderless className="mb-0">
					<thead className="border-bottom border-2 bg-warning">
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{ stations.map( station => (
						<tr key={ station.stationId }>
							<TableDataBorder>{ station.stationId }</TableDataBorder>
							<td>{ station.name }</td>
							<td className="border-start border-2 border-warning">
								<a href={ "/station/" + station.stationId } className="btn__link">&#8594;</a>
							</td>
						</tr>
					) ) }
					</tbody>
				</Table>
			</TableBorder>
		</Container>
	
	)
}

function StationBasicInfo ({ station }) {
	return (
		<Container className="text-center station__container">
			<Row className="border border-2 border-warning rounded box-shadow">
				<Col sm={ 5 } className="border-end border-warning">
					<p className="info-header">Address</p>
					<p>{ station.address }</p>
				</Col>
				<Col xs className="border-end border-warning">
					<p className="info-header">City</p>
					<p>{ station.city }</p>
				</Col>
				<Col xs className="">
					<p className="info-header">Capacity</p>
					<p>{ station.capacity }</p>
				</Col>
			</Row>
			<Row className="border border-2 border-warning rounded mt-2 box-shadow">
				<h4 className="pt-2 pb-2">Total number of...</h4>
				<Col className="border-end border-warning">
					<p className="info-header"><em>Departing</em> journeys</p>
					<p>{ station.numOfJourneysStartingFrom }</p>
				</Col>
				<Col>
					<p className="info-header"><em>Returning</em> journeys</p>
					<p>{ station.numOfJourneysReturningTo }</p>
				</Col>
			
			</Row>
			<Row className="border border-2 border-warning rounded pt-2 mt-2 box-shadow">
				<h4 className="pt-2 pb-2">Average distance travelled...</h4>
				<Col className="border-end border-warning">
					<p className="info-header">From here</p>
					<p>{ station.averageDistanceStartingFrom }km</p>
				</Col>
				<Col>
					<p className="info-header">To here</p>
					<p>{ station.averageDistanceReturnedTo }km</p>
				</Col>
			</Row>
		</Container>
	);
}


export default Station;
