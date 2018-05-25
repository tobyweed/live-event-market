import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../../css/Footer.css';
import blank_prof from '../../../images/blank_prof.png';

class Footer extends Component {
	render() {
		return (
			<div>
				<hr />
				<div className="footer">
					<div className="footer_company">
						<h5>COMPANY</h5>First Tube Media brings the live events industy
						together and amplifies the reach of every show. Its platform enables
						artists, event creators, and sponsors to find each other while their
						in house content creation and distribution services deliver endless
						online exposure.
					</div>

					<div className="footer_links">
						<h5>ABOUT</h5>Platform<br />Services<br />Partners<br />Case Studies<br />team<br />Contact
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
								placeholder="Your Email..."
							/>
							<input
								className="button_color form_submit"
								type="submit"
								value="Subscribe"
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
