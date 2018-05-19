import React from 'react';
import PropTypes from 'prop-types';
import Accordions from './utils/Accordions';

export default class SiteTrackers extends React.Component {
	get categories() {
		return this.props.categories;
	}

	render() {
		return (
			<div className="site-trackers">
				<h2>Trackers on this site</h2>
				<Accordions accordions={this.categories} />
			</div>
		)
	}
}

SiteTrackers.propTypes = {
	categories: PropTypes.array,
};
