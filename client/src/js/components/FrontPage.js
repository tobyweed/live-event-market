import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../css/FrontPage.css';
import '../../images/video.png';

class LocalNav extends Component {
	render() {
		return (
			<div className="frontpage">
				<div className="video">
					<div className="video_content">
						<img className="video_content" src={videoimg} />
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
				<div className="form">
					<div className="form_content">
						<form className="form_grid" method="POST" action="/send">
							<input
								className="button_plain form_search"
								type="text"
								name="artist"
								placeholder="Search Event, Promoter, or Sponsor"
							/>
							<input
								className="button_color form_submit"
								type="submit"
								value="Search"
							/>
							<div className="form_artist">
								<input
									type="radio"
									name="search_type"
									value="search_artist"
									checked
								/>{' '}
								&nbsp; Artist
							</div>
							<div className="form_event">
								<input type="radio" name="search_type" value="search_event" />{' '}
								&nbsp; Event
							</div>
							<div className="form_promoter">
								<input
									type="radio"
									name="search_type"
									value="search_promoter"
								/>{' '}
								&nbsp; Promoter
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
