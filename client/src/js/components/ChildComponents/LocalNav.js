import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//comment
class LocalNav extends Component {
	render() {
		return (
			<div>
				<ul class="navbar absolute">
					<li class="navbar left">
						<a href="#overview">
							<div class="navbar button_plain">Overview</div>
						</a>
					</li>
					<li class="navbar left">
						<a href="#music">
							<div class="navbar button_plain">Music</div>
						</a>
					</li>
					<li class="navbar left">
						<a href="#content">
							<div class="navbar button_plain">Content</div>
						</a>
					</li>
					<li class="navbar left">
						<a href="#shows">
							<div class="navbar button_plain">Shows</div>
						</a>
					</li>
					<li class="navbar right">
						<a href="#contact">
							<div class="navbar button_color">Contact</div>
						</a>
					</li>
					<li class="navbar right">
						<a href="#save">
							<div class="navbar button_color">Save</div>
						</a>
					</li>
				</ul>
			</div>
		);
	}
}

export default LocalNav;
