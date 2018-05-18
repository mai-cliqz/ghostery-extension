import React from 'react';
import TrackersChart from './utils/TrackersChart';
import FixedMenu from './utils/FixedMenu';

export default class Overview extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
    	config: {
    		radius: 100,
    	}
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

	render() {
		return (
			<div className="overview">
				<TrackersChart
	      	paths={this.chartData.arcs}
	      	radius={this.state.config.radius}
	      	num={this.chartData.sum}
	      />
	      <p>{this.hostName}</p>
	      <p>{this.nTrackersBlocked} Trackers blocked</p>

	      <div className="buttons-wrapper row">
				  <div className="small-12 medium-4">
				  	<button
			  			className="button trust-site-btn"
			  			onClick={this.props.handleClick}
			  		>Trust Site</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className="button restrict-site-btn"
			  			onClick={this.props.handleClick}
			  		>Restrict Site</button>
				  </div>
				  <div className="small-12 medium-4">
				  	<button
			  			className="button pause-resume-btn"
			  			onClick={this.props.handleClick}
			  		>Pause Ghostery</button>
				  </div>
				</div>
	  		<FixedMenu />
  		</div>
		)
	}
}
