import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
// import axios from 'axios';

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Crags from './components/Crags';
import Create from './components/Create';
import Login from './components/Login';
import Register from './components/Register';
import Blog from './components/Blog';
import EditCrag from './components/EditCrag';
import ShowCrag from './components/ShowCrag';
import WrongURL from './components/WrongURL';
import Dashboard from './components/Dashboard';

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
	return (
		<Route
			path={path}
			render={(props) => {
				return localStorage.getItem('loggedIn') ? (
					<Comp {...rest} {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/',
							state: {
								prevLocation: path,
								msg: 'You need to login first!',
							},
						}}
					/>
				);
			}}
		/>
	);
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			user: {
				name: '',
				_id: '',
				emailHash: '',
			},
			loggedIn: false,
		};
	}

	componentDidMount() {
		if (
			localStorage.getItem('name') &&
			localStorage.getItem('_id') &&
			localStorage.getItem('emailHash') &&
			localStorage.getItem('loggedIn')
		) {
			const user = { ...this.state.user };
			user.name = localStorage.getItem('name');
			user._id = localStorage.getItem('_id');
			user.emailHash = localStorage.getItem('emailHash');
			this.setState({
				user,
				loggedIn: true,
			});
		}
	}

	updateUser = (name, _id, emailHash) => {
		if (name) {
			const userData = { ...this.state.user };
			userData.name = name;
			userData._id = _id;
			userData.emailHash = emailHash;
			this.setState({
				user: userData,
				loggedIn: true,
			});
		} else {
			const userData = { ...this.state.user };
			userData.name = '';
			userData._id = '';
			userData.emailHash = '';
			this.setState({
				user: userData,
				loggedIn: false,
			});
		}
	};

	render() {
		const { user } = this.state;

		return (
			<Router>
				<Header user={user} />
				<Route
					path='/'
					exact
					render={(props) => <Home {...props} user={user} />}
				/>
				<Route path='/about' component={About} />
				<Route path='/crags' component={Crags} />
				<ProtectedRoute path='/create' user={user} component={Create} />
				<ProtectedRoute
					path='/dashboard'
					user={user}
					component={Dashboard}
				/>
				<Route
					path='/login'
					render={(props) => (
						<Login {...props} updateUser={this.updateUser} />
					)}
				/>
				<Route
					path='/register'
					render={(props) => (
						<Register {...props} updateUser={this.updateUser} />
					)}
				/>
				<Route path='/blog' component={Blog} />
				<Route path='/crags/:id/edit' component={EditCrag} />
				<Route path='/crag/:slug' component={ShowCrag} />
				<Route path='/404' component={WrongURL} />
			</Router>
		);
	}
}

export default App;
