import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import '../../../css/GlobalNav.css';
import master_logo from '../../../images/master_logo.png';
import blank_prof from '../../../images/blank_prof.png';
import { withRouter } from 'react-router';

import AuthService from '../../utils/auth/AuthService';

class Nav extends Component {
	constructor() {
		super();
		this.Auth = new AuthService();
	}

	state = {
		initialized: false
	};

	componentWillMount() {
		//Whenever the url changes, re-initalize the app and tell state it's okay to render the navbar
		this.unlisten = this.props.history.listen(location => {
			this.Auth.initialize().then(res => {
				this.setState({ initialized: true });
			});
		});
	}

	componentWillUnmount() {
		this.unlisten();
	}

	componentDidMount() {
		this.setState({ initialized: true });
	}

	render() {
		const loggedIn = this.Auth.loggedIn();
		return this.state.initialized ? (
			<div>
				<ul className="navbar fixed">
					<li className="navbar left">
						<Link to="/">
							<img className="navbar" src={master_logo} alt="logo" />
						</Link>
					</li>
					{loggedIn ? (
						<li className="navbar right">
							<Link className="pro-pic" to="/account">
								{this.props.userData.proPicUrl ? (
									<img
										src={this.props.userData.proPicUrl}
										onError={e => {
											e.target.src = blank_prof;
										}}
										alt="User Profile"
									/>
								) : (
									<img
										className="navbar"
										src={blank_prof}
										alt="blank profile icon"
									/>
								)}
							</Link>
						</li>
					) : (
						''
					)}

					{!loggedIn ? (
						<li className="navbar right">
							<Link to="/login">
								<div className="navbar button_color">Login</div>
							</Link>
						</li>
					) : (
						''
					)}

					{!loggedIn ? (
						<li className="navbar right">
							<Link to="/registration">
								<div className="navbar button_color">Sign Up</div>
							</Link>
						</li>
					) : (
						''
					)}

					<li className="navbar right">
						<Link to="/contact">
							<div className="navbar button_plain">Contact</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/help">
							<div className="navbar button_plain">Help</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/reports">
							<div className="navbar button_plain">Reports</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/content-examples">
							<div className="navbar button_plain">Content Examples</div>
						</Link>
					</li>
					<li className="navbar right">
						<Link to="/our-strategy">
							<div className="navbar button_plain">Our Strategy</div>
						</Link>
					</li>
				</ul>
				<div className="nav_spacer" />
			</div>
		) : null;
	}
}

function mapStateToProps(state) {
	return {
		userData: state.idData.userData
	};
}

export default connect(mapStateToProps)(withRouter(Nav));
