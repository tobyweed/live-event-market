import React, { Component } from 'react';
import '../../../css/FrontPage.css';
import videoimg from '../../../images/video.png';

import SearchForm from '../Search/SearchForm';

class FrontPage extends Component {
	render() {
		return (
			<div className="frontpage">
				<div className="video">
					<div className="video_content">
						<img className="video_content" src={videoimg} alt="video" />
					</div>
				</div>
				<div className="intro">
					<div className="intro_content">
						<h5>A PLATFORM FOR</h5>
						<h3>Before, During, and After the Event</h3>
						<p>
							First Tube Media brings the live events industry together and
							scales digital content to extend the reach of America&apos;s most
							sought after music experiences.
						</p>
					</div>
				</div>
				<SearchForm />
			</div>
		);
	}
}

export default FrontPage;
