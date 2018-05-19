import React from 'react';
import PropTypes from 'prop-types';
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

GlobalTrackers.propTypes = {
	categories: PropTypes.array,
};
