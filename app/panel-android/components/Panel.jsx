import React from 'react';
import TrackersChart from './TrackersChart';
import { Tabs, Tab } from './Tabs';

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
			});
	}

	fromTrackersToChartData(trackers) {
		if (trackers.length < 1) {
			return [];
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

		return arcs;
	}

	get paths() {
		const trackers = (this.state.summary.categories || []).map(category =>
			({
				id: category.id,
				numTotal: category.num_total,
			})
		);

		return this.fromTrackersToChartData(trackers);
	}

	get num() {
		return 22;
	}

	render() {
		return (
			<div>
				<Tabs>
	        <Tab tabLabel={'Overview'}
	             linkClassName={'custom-link'}>
	          <TrackersChart paths={this.paths} radius={this.state.config.radius} num={this.num} />
	          <p>hello</p>
	        </Tab>
	        <Tab tabLabel={'Site Trackers'}
	             linkClassName={'custom-link'}>
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
