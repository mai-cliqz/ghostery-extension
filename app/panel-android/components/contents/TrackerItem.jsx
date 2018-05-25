import React from 'react';
import PropTypes from 'prop-types';

export default class TrackerItem extends React.Component {

	toggleMenu = () => {
		this.props.toggleMenu(this.props.index);
	}

	get trackerStatus() {
		if (this.props.tracker.ss_allowed) {
			return 'trusted';
		}

		if (this.props.tracker.ss_blocked) {
			return 'restricted';
		}

		if (this.props.tracker.blocked) {
			return 'blocked';
		}

		return '';
	}

	clickButtonTrust = () => {
		const ss_allowed = !this.props.tracker.ss_allowed;
		this.props.callGlobalAction({
			actionName: 'trustRestrictTracker',
			actionData: {
				app_id: this.props.tracker.id,
				cat_id: this.props.categoryId,
				trust: ss_allowed,
				restrict: false,
			}
		});
		this.props.toggleMenu(this.props.index); // Hide menu
	}

	clickButtonRestrict = () => {
		const ss_blocked = !this.props.tracker.ss_blocked;
		this.props.callGlobalAction({
			actionName: 'trustRestrictTracker',
			actionData: {
				app_id: this.props.tracker.id,
				cat_id: this.props.categoryId,
				trust: false,
				restrict: ss_blocked,
			}
		});
		this.props.toggleMenu(this.props.index);
	}

	clickButtonBlock = () => {
		const blocked = !this.props.tracker.blocked;
		const actionName = this.props.type === 'site-trackers' ?
																					 'blockUnblockSiteTracker' :
																					 'blockUnblockGlobalTracker';
		this.props.callGlobalAction({
			actionName,
			actionData: {
				app_id: this.props.tracker.id,
				cat_id: this.props.categoryId,
				blocked,
			}
		});
		this.props.toggleMenu(this.props.index);
	}

	render() {
		return (
			<div className={`tracker ${this.props.showMenu ? 'show-menu' : ''} ${this.trackerStatus}`}>
  			<a className="info" href={'#'}></a>
  			<div onClick={this.toggleMenu} className="trackerName">{this.props.tracker.name}
  				<span className="trackerSelect"></span>
  			</div>

  			<div className={`menu ${this.props.type}`}>
  				<button className="trackerOption trust" onClick={this.clickButtonTrust}>
  					{this.trackerStatus === 'trusted' ? 'Untrust': 'Trust'}
  				</button>
  				<button className="trackerOption restrict" onClick={this.clickButtonRestrict}>
  					{this.trackerStatus === 'restricted' ? 'Unrestrict': 'Restrict'}
  				</button>
  				<button className="trackerOption block" onClick={this.clickButtonBlock}>
  					{this.trackerStatus === 'blocked' ? 'UnBlock': 'Block'}
  				</button>
  			</div>
  		</div>
		);
	}
}

TrackerItem.propTypes = {
	toggleMenu: PropTypes.func,
	index: PropTypes.number,
	showMenu: PropTypes.bool,
	tracker: PropTypes.object,
	callGlobalAction: PropTypes.func,
	categoryId: PropTypes.string,
	type: PropTypes.string,
	siteProps: PropTypes.object,
};
