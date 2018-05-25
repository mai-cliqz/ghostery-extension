import React from 'react';
import PropTypes from 'prop-types';
import Accordions from './contents/Accordions';
import DotsMenu from './contents/DotsMenu';

export default class SiteTrackers extends React.Component {
	actions = [
		{
			name: 'Block All',
			callback: () => {
				console.log('Block All');
				this.props.callGlobalAction({
					actionName: 'blockUnBlockAllSiteTrackers',
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
					actionName: 'blockUnBlockAllSiteTrackers',
					actionData: {
						allBlocked: false,
					}
				});
			},
		}
	]

	get categories() {
		return this.props.categories;
	}

	render() {
		return (
			<div className="site-trackers">
				<div className="header">
					<h2>Trackers on this site</h2>
					<DotsMenu actions={this.actions} />
				</div>
				<Accordions type="site-trackers" categories={this.categories} callGlobalAction={this.props.callGlobalAction} />
			</div>
		)
	}
}

SiteTrackers.propTypes = {
	categories: PropTypes.array,
	callGlobalAction: PropTypes.func,
};
