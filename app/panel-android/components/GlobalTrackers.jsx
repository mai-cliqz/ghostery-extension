import React from 'react';
import Accordions from './utils/Accordions';

export default class GlobalTrackers extends React.Component {
	get categories() {
		return this.props.categories;
	}

	render() {
		return (
			<div className="global-trackers">
				<h2>Global Trackers</h2>
				<Accordions accordions={this.categories} />
			</div>
		)
	}
}
