import React, { Component } from 'react';
import '../../../../css/About.css';
import videoimg from '../../../../images/video.png';

class About extends Component {
	render() {
		return (
			<div className="about">
				<div className="about_text">
					<div className="about_text_content">
						<h5>ABOUT</h5>
						<h3>First Tube Media</h3>
						<b>Connecting Partners</b>
						<br />
						Our platform allows the live events industry to discover and contact
						well fit partners for better live experiances.<br />
						<br />
						<b>Creating Content</b>
						<br />
						We extend the value of live event experiances with digital content
						coverage before, during, and post event.<br />
						<br />
						<b>Scaling Distribution</b>
						<br />
						We know how to reach an endless audience through stratigic online
						activations and media channels.
					</div>
				</div>
				<div className="about_image">
					<div className="about_image_content">
						<img
							className="about_image_content"
							src={videoimg}
							alt="video png"
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default About;
