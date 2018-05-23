import React from 'react';
import PropTypes from 'prop-types';
import TrackersChart from './contents/TrackersChart';
import FixedMenu from './contents/FixedMenu';
import { sendMessage } from '../utils/msg';

export default class Overview extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	isPaused: false,
    	isTrusted: false,
    	isRestricted: false,
    }
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

	get nTrackersBlocked() {
		return (this.summary.trackerCounts || {}).blocked || 0;
	}

	handleTrustButtonClick = () => {
		let currentState = this.state.isTrusted;
		this.setState({
			isTrusted: !currentState,
		});
	}

	handleRestrictButtonClick = () => {
		let currentState = this.state.isRestricted;
		this.setState({
			isRestricted: !currentState,
		});
	}

	handlePauseButtonClick = () => {
		let currentState = this.state.isPaused;
		this.setState({
			isPaused: !currentState,
		});
	}

	render() {
		return (
			<div className="overview">
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
	  		<FixedMenu />
  		</div>
		)
	}
}

Overview.propTypes = {
	summary: PropTypes.object,
	handleClick: PropTypes.func,
};
