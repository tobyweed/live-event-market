import React, { Component } from 'react';

class BooleanFilter extends Component {
	constructor(props) {
		super(props);

		this.useFilter = props.useFilter.bind(this);
		this.handleBooleanCheckboxChange = props.handleBooleanCheckboxChange.bind(
			this
		);
	}

	render() {
		return (
			<div>
				<button onClick={this.useFilter}>
					{this.props.filter.use ? (
						<section>Stop Using This Filter</section>
					) : (
						<section>Use This Filter</section>
					)}
				</button>
				<input
					type="checkbox"
					name={this.props.filterName}
					checked={this.props.filter.term}
					onChange={this.handleBooleanCheckboxChange}
				/>
				{this.props.filterName.charAt(0).toUpperCase() +
					this.props.filterName.slice(1)}
				{/*Give a helpful comment based on whether we're using the filter and
				what the term is*/}
				{this.props.filter.use ? (
					this.props.filter.term ? (
						<span>
							Your search will return only events which are &nbsp;
							{this.props.filterName}.
						</span>
					) : (
						<span>
							Your search will return only events which are not &nbsp;
							{this.props.filterName}.
						</span>
					)
				) : (
					<span>
						Your search will not filter based on whether or not results are
						&nbsp;
						{this.props.filterName}.
					</span>
				)}
			</div>
		);
	}
}

export default BooleanFilter;
