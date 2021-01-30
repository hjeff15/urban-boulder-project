import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Crags from './components/Crags';
import Create from './components/Create';
import Login from './components/Login';
import Blog from './components/Blog';
import EditCrag from './components/EditCrag';
import ShowCrag from './components/ShowCrag';

class App extends Component {
	render() {
		return (
			<Router>
				<Header />
				<Route path='/' exact component={Home} />
				<Route path='/about' component={About} />
				<Route path='/crags' component={Crags} />
				<Route path='/create' component={Create} />
				<Route path='/login' component={Login} />
				<Route path='/blog' component={Blog} />
				<Route path='/crags/:id/edit' component={EditCrag} />
				<Route path='/crag/:slug' component={ShowCrag} />
			</Router>
		);
	}
}

export default App;
