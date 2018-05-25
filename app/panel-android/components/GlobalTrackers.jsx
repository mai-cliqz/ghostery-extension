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
				this.props.callGlobalAction({
					actionName: 'blockUnBlockAllGlobalTrackers',
					actionData: {
						allBlocked: true,
					}
				});
			},
		},
		{
			name: 'Unblock All',
			callback: () => {
				console.log('Unblock All');
				this.props.callGlobalAction({
					actionName: 'blockUnBlockAllGlobalTrackers',
					actionData: {
						allBlocked: false,
					}
				});
			},
		},
		{
			name: 'Reset Settings',
			callback: () => {
				console.log('Reset Settings: To be implemented!');
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
				<Accordions type="global-trackers" categories={this.categories} callGlobalAction={this.props.callGlobalAction} />
			</div>
		)
	}
}

GlobalTrackers.propTypes = {
	categories: PropTypes.array,
	callGlobalAction: PropTypes.func,
};
