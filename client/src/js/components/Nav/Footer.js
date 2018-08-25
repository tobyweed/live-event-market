import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/Footer.css';

class Footer extends Component {
	render() {
		return (
			<div>
				<hr />
				<div className="footer">
					<div className="footer_company">
						<h5>COMPANY</h5>First Tube Media brings the live events industry
						together and amplifies the reach of every show. Its platform enables
						artists, event creators, and sponsors to find each other while their
						in house content creation and distribution services deliver endless
						online exposure.
					</div>

					<div className="footer_links">
						<h5>ABOUT</h5>
						<Link to="/platform">Platform</Link>
						<br />
						<Link to="/services">Services</Link>
						<br />
						<Link to="/partners">Partners</Link>
						<br />
						<Link to="/case-studies">Case Studies</Link>
						<br />
						<Link to="/team">Team</Link>
						<br />
						<Link to="/contact">Contact</Link>
					</div>

					<div className="footer_email">
						<h5>KEEP IN TOUCH</h5>
						<p>
							Stay up to date on trending artists, upcoming events, and more...
						</p>
						<form>
							<input
								className="button_plain form_search"
								type="text"
								name="email"
								placeholder="Currently a Dead Link"
							/>
							<input
								className="button_color form_submit"
								type="submit"
								value="Doesn't Do Anything"
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
