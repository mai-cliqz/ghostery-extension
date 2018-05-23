import React from 'react';
import PropTypes from 'prop-types';
import Accordions from './contents/Accordions';
import DotsMenu from './contents/DotsMenu';

export default class GlobalTrackers extends React.Component {
	actions = [
		{
			name: 'Block All',
			callback: () => {
				console.log('Block All');
			},
		},
		{
			name: 'Unblock All',
			callback: () => {
				console.log('Unblock All');
			},
		},
		{
			name: 'Reset Settings',
			callback: () => {
				console.log('Reset Settings');
			},
		}
	]

	get categories() {
		return this.props.categories;
	}

	render() {
		return (
			<div className="global-trackers">
				<div className="header">
					<h2>Global Trackers</h2>
					<DotsMenu actions={this.actions} />
				</div>
				<Accordions categories={this.categories} />
			</div>
		)
	}
}

GlobalTrackers.propTypes = {
	categories: PropTypes.array,
};
