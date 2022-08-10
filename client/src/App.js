import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import Station from "./pages/Station";
import Navigation from "./pages/components/Navigation";
import Container from "react-bootstrap/Container";

function App () {
	return (
		<BrowserRouter>
			<Navigation/>
			<Container>
				<Routes>
					<Route path="/" element={ <Home/> }/>
					<Route path="/journey" element={ <Journey/> }>
						<Route path=":id" element={ <Journey/> }/>
					</Route>
					<Route path="station" element={ <Station/> }>
						<Route path=":id" element={ <Station/> }/>
					</Route>
				</Routes>
			</Container>
		</BrowserRouter>
	);
}

export default App;