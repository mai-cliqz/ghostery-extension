import React from 'react';
import PropTypes from 'prop-types';
import TrackersChart from './contents/TrackersChart';
import { sendMessage } from '../utils/msg';
import { addToArray, removeFromArray } from '../utils/utils';

export default class Overview extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	isTrusted: false,
    	isRestricted:false,
    	isPaused: false,
    }
  }

  componentDidMount() {
  	this.setState({
      isTrusted: this.isTrusted,
    	isRestricted: this.isRestricted,
    	isPaused: this.isPaused,
    });
  }

  componentDidUpdate(oldProps) {
    if(oldProps.summary !== this.props.summary) {
      // This triggers an unnecessary re-render
      this.setState({
        isTrusted: this.isTrusted,
	    	isRestricted: this.isRestricted,
	    	isPaused: this.isPaused,
      });
    }
  }

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
		const currentState = this.state.isTrusted;
		this.setState({
			isTrusted: !currentState,
			isRestricted: !currentState ? false : this.state.isRestricted,
			isPaused: false,
		});

		let updatedBlacklist = this.siteBlacklist.slice(0);
		let updatedWhitelist = this.siteWhitelist.slice(0);

		if (currentState) {
			updatedWhitelist = removeFromArray(this.siteWhitelist, this.siteWhitelist.indexOf(this.pageHost));
		} else {
			if (this.siteBlacklist.includes(this.pageHost)) {
				// remove from blacklist if site is trusted
				updatedBlacklist = removeFromArray(this.siteBlacklist, this.siteBlacklist.indexOf(this.pageHost));
			}
			if (!this.siteWhitelist.includes(this.pageHost)) {
				// add to whitelist
				updatedWhitelist = addToArray(this.siteWhitelist, this.pageHost);
			}
		}

		sendMessage('setPanelData', {
			site_whitelist: updatedWhitelist,
			site_blacklist: updatedBlacklist,
			paused_blocking: false,
		});
	}

	handleRestrictButtonClick = () => {
		const currentState = this.state.isRestricted;
		this.setState({
			isRestricted: !currentState,
			isTrusted: !currentState ? false: this.state.isTrusted,
			isPaused: false,
		});

		let updatedBlacklist = this.siteBlacklist.slice(0);
		let updatedWhitelist = this.siteWhitelist.slice(0);

		if (currentState) {
			updatedBlacklist = removeFromArray(this.siteBlacklist, this.siteBlacklist.indexOf(this.pageHost));
		} else {
			if (this.siteWhitelist.includes(this.pageHost)) {
				// remove from whitelist if site is restricted
				updatedWhitelist = removeFromArray(this.siteWhitelist, this.siteWhitelist.indexOf(this.pageHost));
			}
			if (!this.siteBlacklist.includes(this.pageHost)) {
				// add to blacklist
				updatedBlacklist = addToArray(this.siteBlacklist, this.pageHost);
			}
		}

		sendMessage('setPanelData', {
			site_whitelist: updatedWhitelist,
			site_blacklist: updatedBlacklist,
			paused_blocking: false,
		});
	}

	handlePauseButtonClick = () => {
		const currentState = this.state.isPaused;
		this.setState({
			isPaused: !currentState,
		});

		sendMessage('setPanelData', {
			paused_blocking: !currentState,
		});
	}

	render() {
		return (
			<div className={`overview ${this.state.isPaused ? 'paused' : ''}`}>
				<TrackersChart
	      	paths={this.chartData.arcs}
	      	num={this.chartData.sum}
	      />
	      <p>{this.hostName}</p>
	      <p>{this.nTrackersBlocked} Trackers blocked</p>

	      <div className="buttons-wrapper row">
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button trust-site-btn ${this.state.isTrusted ? 'changed' : ''}`}
			  			onClick={this.handleTrustButtonClick}
			  		>
			  			<span>Trust Site</span>
			  		</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button restrict-site-btn ${this.state.isRestricted ? 'changed' : ''}`}
			  			onClick={this.handleRestrictButtonClick}
			  		>
			  			<span>Restrict Site</span>
			  		</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className={`button pause-resume-btn ${this.state.isPaused ? 'changed' : ''}`}
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
};
