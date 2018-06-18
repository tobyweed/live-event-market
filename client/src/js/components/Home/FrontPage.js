import React, { Component } from 'react';
import '../../../css/FrontPage.css';
import videoimg from '../../../images/video.png';

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
				<div className="form">
					<div className="form_content">
						<form
							className="form_grid"
							method="POST"
							action="/send"
							onSubmit={this.handleFormSubmit}
						>
							<input
								className="button_plain form_search"
								type="text"
								name="artist"
								placeholder="Search Event, Promoter, or Sponsor"
								onChange={this.handleChange}
							/>
							<input
								className="button_color form_submit"
								type="submit"
								value="Search"
								onChange={this.handleChange}
							/>
							<div className="form_artist">
								<input
									type="radio"
									name="search_type"
									value="search_artist"
									onChange={this.handleChange}
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
									onChange={this.handleChange}
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

export default FrontPage;
