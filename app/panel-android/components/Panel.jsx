import React from 'react';
import { Tabs, Tab } from './contents/Tabs';
import Overview from './Overview';
import SiteTrackers from './SiteTrackers';
import GlobalTrackers from './GlobalTrackers';
import { getSummaryData, getSettingsData, getBlockingData } from '../actions/panelActions';

export default class Panel extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	summary: {},
    	settings: {},
    	blocking: {},
    }
  }

	componentDidMount() {
		// this.getPanelData();
		this.setSummaryState();
		this.setSettingsState();
		this.setBlockingState();
	}

	setSummaryState = () => {
		getSummaryData(4).then((data) => {
			console.log('@@@@', data);
			this.setState({
				summary: data,
			});
		});
	}

	setSettingsState = () => {
		getSettingsData().then((data) => {
			console.log('@@@@', data);
			this.setState({
				settings: data,
			});
		});
	}

	setBlockingState = () => {
		getBlockingData(4).then((data) => {
			this.setState({
				blocking: data,
			});
		});
	}

	getPanelData = () => {
		fetch('../../databases/mock-data2.json')
			.then(results => results.json())
			.then(data => {
				this.setState({
					summary: data.summary,
					panel: data.panel,
					blocking: data.blocking,
					settings: data.settings,
				});

				console.log('@@@@', this.state);
			});
	}

	get siteCategories() {
		return this.state.summary.categories || [];
	}

	get globalCategories() {
		return this.state.settings.categories || [];
	}

	render() {
		return (
			<div>
				<Tabs>
	        <Tab tabLabel={'Overview'}
	             linkClassName={'custom-link'}>
	          <Overview summary={this.state.summary} />
	        </Tab>

	        <Tab tabLabel={'Site Trackers'}
	             linkClassName={'custom-link'}>
	          <SiteTrackers categories={this.siteCategories} />
	        </Tab>

	        <Tab tabLabel={'Global Trackers'}
	             linkClassName={'custom-link'}>
	          <GlobalTrackers categories={this.globalCategories} />
	        </Tab>
	      </Tabs>
			</div>
		)
	}
}
