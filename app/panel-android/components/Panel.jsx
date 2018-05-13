import React from 'react';
import { Tabs, Tab } from './Tabs';
import TrackersChart from './TrackersChart';
import Accordions from './Accordions';

export default class Panel extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	summary: {},
    	panel: {},
    	blocking: {},
    	config: {
    		radius: 100,
    	}
    }

    this.getPanelData = this.getPanelData.bind(this);
  }

	componentDidMount() {
		this.getPanelData();
	}

	getPanelData() {
		fetch('../../databases/mock-data.json')
			.then(results => results.json())
			.then(data => {
				this.setState({
					summary: data.data.summary,
					panel: data.data.panel,
					blocking: data.data.blocking,
				});

				console.log('@@@@', this.state);
			});
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

	get categories() {
		return this.state.summary.categories || [];
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
		return this.state.summary.pageHost || '';
	}

	get nTrackersBlocked() {
		return (this.state.summary.trackerCounts || {}).blocked || 0;
	}

	render() {
		return (
			<div>
				<Tabs>
	        <Tab tabLabel={'Overview'}
	             linkClassName={'custom-link'}>
	          <TrackersChart
	          	paths={this.chartData.arcs}
	          	radius={this.state.config.radius}
	          	num={this.chartData.sum}
	          />
	          <p>{this.hostName}</p>
	          <p>{this.nTrackersBlocked} Trackers blocked</p>

	          <button
        			className="button"
        			style={{ marginRight: '5px' }}
        			onClick={this.props.handleClick}
        		>Trust Site</button>
        		<button
        			className="button"
        			style={{ marginRight: '5px' }}
        			onClick={this.props.handleClick}
        		>Restrict Site</button>
        		<button
        			className="button"
        			style={{ marginRight: '5px' }}
        			onClick={this.props.handleClick}
        		>Pause Ghostery</button>
	        </Tab>

	        <Tab tabLabel={'Site Trackers'}
	             linkClassName={'custom-link'}>
	          <Accordions accordions={this.categories} />
	          <p>tab 2 content</p>
	        </Tab>

	        <Tab tabLabel={'Global Trackers'}
	             linkClassName={'custom-link'}>
	          <p>tab 3 content</p>
	        </Tab>
	      </Tabs>
			</div>
		)
	}
}
