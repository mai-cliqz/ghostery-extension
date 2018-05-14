import React from 'react';
import { Tabs, Tab } from './utils/Tabs';
import Overview from './Overview';
import SiteTrackers from './SiteTrackers';
import GlobalTrackers from './GlobalTrackers';

export default class Panel extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	summary: {},
    	panel: {},
    	blocking: {},
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

	get categories() {
		return this.state.summary.categories || [];
	}

	render() {
		return (
			<div>
				<Tabs>
	        <Tab tabLabel={'Overview'}
	             linkClassName={'custom-link'}>
	          <Overview summary={this.state.summary} />
	          <p>tab 1 content</p>
	        </Tab>

	        <Tab tabLabel={'Site Trackers'}
	             linkClassName={'custom-link'}>
	          <SiteTrackers categories={this.categories} />
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
