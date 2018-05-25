import React from 'react';
import PropTypes from 'prop-types';
import TrackersChart from './contents/TrackersChart';

export default class Overview extends React.Component {

  get isTrusted() {
		return this.siteWhitelist.indexOf(this.pageHost) !== -1;
	}

	get isRestricted() {
		return this.siteBlacklist.indexOf(this.pageHost) !== -1;
	}

	get isPaused() {
		return this.summary.paused_blocking;
	}

	fromTrackersToChartData(trackers) {
		if (trackers.length < 1) {
			return {
				sum: 0,
				arcs: [],
			};
		}

		const arcs = [];
		let startAngle = 0;

		var sum = trackers.map(tracker => tracker.numTotal).reduce((a, b) => a + b, 0);

		for (let i = 0; i < trackers.length; i += 1) {
			const endAngle = startAngle + (trackers[i].numTotal * 360  / sum);

			arcs.push({
				start: startAngle,
				end: endAngle,
				category: trackers[i].id,
			})

			startAngle = endAngle;
		}

		return {
			sum,
			arcs,
		};
	}

	get summary() {
		return this.props.summary;
	}

	get categories() {
		return this.summary.categories || [];
	}

	get chartData() {
		const trackers = this.categories.map(category =>
			({
				id: category.id,
				numTotal: category.num_total,
			})
		);

		return this.fromTrackersToChartData(trackers);
	}

	get hostName() {
		return this.summary.pageHost || '';
	}

	get pageHost() {
		return this.hostName.toLowerCase().replace(/^(http[s]?:\/\/)?(www\.)?/, '');
	}

	get nTrackersBlocked() {
		return (this.summary.trackerCounts || {}).blocked || 0;
	}

	get siteWhitelist() {
		return this.summary.site_whitelist || [];
	}

	get siteBlacklist() {
		return this.summary.site_blacklist || [];
	}

	handleTrustButtonClick = () => {
		this.props.callGlobalAction({
			actionName: 'handleTrustButtonClick',
		});
	}

	handleRestrictButtonClick = () => {
		this.props.callGlobalAction({
			actionName: 'handleRestrictButtonClick',
		});
	}

	handlePauseButtonClick = () => {
		this.props.callGlobalAction({
			actionName: 'handlePauseButtonClick',
		});
	}

	render() {
		return (
			<div className={`overview ${this.isPaused ? 'paused' : ''}`}>
				<TrackersChart
	      	paths={this.chartData.arcs}
	      	num={this.chartData.sum}
	      />
	      <p>{this.hostName}</p>
	      <p>{this.nTrackersBlocked} Trackers blocked</p>

	      <div className="buttons-wrapper row">
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button trust-site-btn ${this.isTrusted ? 'changed' : ''}`}
			  			onClick={this.handleTrustButtonClick}
			  		>
			  			<span>Trust Site</span>
			  		</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button restrict-site-btn ${this.isRestricted ? 'changed' : ''}`}
			  			onClick={this.handleRestrictButtonClick}
			  		>
			  			<span>Restrict Site</span>
			  		</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button pause-resume-btn ${this.isPaused ? 'changed' : ''}`}
			  			onClick={this.handlePauseButtonClick}
			  		>
			  			<span>Pause Ghostery</span>
			  			<span>Resume Ghostery</span>
			  		</button>
				  </div>
				</div>
  		</div>
		)
	}
}

Overview.propTypes = {
	summary: PropTypes.object,
	handleClick: PropTypes.func,
	callGlobalAction: PropTypes.func,
};
