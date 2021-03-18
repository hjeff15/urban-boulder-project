import React, { Component } from 'react';
// import { Router } from 'react-router';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
// import axios from 'axios';

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Create from './components/Create';
import Login from './components/Login';
import Register from './components/Register';
import EditCrag from './components/EditCrag';
import ShowCrag from './components/ShowCrag';
import WrongURL from './components/WrongURL';
import Dashboard from './components/Dashboard';
import Reset from './components/Reset';
import Map from './components/Map';
// import { set } from 'mongoose';

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

let timer = null;

class App extends Component {
	constructor() {
		super();
		this.state = {
			loaded: false,
			user: {
				name: '',
				_id: '',
				emailHash: '',
				likes: [],
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
			if (localStorage.getItem('likes')) {
				user.likes = localStorage.getItem('likes');
			}
			this.setState({
				user,
				loggedIn: true,
			});
		}
	}

	updateLikes = (likes) => {
		let stateCopy = { ...this.state.user };
		stateCopy.likes = likes;
		this.setState({
			user: stateCopy,
		});
	};

	updateUser = (name, _id, emailHash, likes) => {
		if (name) {
			const userData = { ...this.state.user };
			userData.name = name;
			userData._id = _id;
			userData.emailHash = emailHash;
			userData.likes = likes;
			this.setState({
				user: userData,
				loggedIn: true,
			});
		} else {
			const userData = { ...this.state.user };
			userData.name = '';
			userData._id = '';
			userData.emailHash = '';
			userData.likes = [];
			this.setState({
				user: userData,
				loggedIn: false,
			});
		}
	};

	loginTimer() {
		let timerStart = Date.now();
		const timeoutTime = timerStart + 3 * 1000; // 5 seconds
		let time = timeoutTime - timerStart;
		timer = setTimeout(() => {
			console.log('LOGGED YOU OUT');
		}, time);
		console.log('Timer has started: ' + timerStart);
	}

	resetTimer = () => {
		clearTimeout(timer);
		this.state.loggedIn ? this.loginTimer() : (timer = null);
	};

	render() {
		const { user } = this.state;

		return (
			<Router>
				<div onClick={this.resetTimer}>
					<Header user={user} updateUser={this.updateUser} />
					<Route
						path='/'
						exact
						render={(props) => (
							<Home
								{...props}
								user={user}
								updateLikes={this.updateLikes}
							/>
						)}
					/>
					<Route path='/about' component={About} />
					<ProtectedRoute
						path='/create'
						user={user}
						component={Create}
					/>
					<ProtectedRoute
						path='/dashboard'
						user={user}
						component={Dashboard}
					/>
					<Route
						path='/login'
						render={(props) => (
							<Login
								{...props}
								updateUser={this.updateUser}
								loginTimer={this.loginTimer}
							/>
						)}
					/>
					<Route
						path='/register'
						render={(props) => (
							<Register {...props} updateUser={this.updateUser} />
						)}
					/>
					<Route path='/map' component={Map} />
					<Route path='/crags/:id/edit' component={EditCrag} />
					<Route
						path='/crag/:slug'
						exact
						render={(props) => <ShowCrag {...props} user={user} />}
					/>
					<Route path='/account/reset/:token' component={Reset} />
					<Route path='/404' component={WrongURL} />
				</div>
			</Router>
		);
	}
}

export default App;
