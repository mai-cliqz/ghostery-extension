import React from 'react';
import URLSearchParams from 'url-search-params';
import { Tabs, Tab } from './contents/Tabs';
import Overview from './Overview';
import FixedMenu from './contents/FixedMenu';
import SiteTrackers from './SiteTrackers';
import GlobalTrackers from './GlobalTrackers';
import { getPanelData, getSummaryData, getSettingsData, getBlockingData } from '../actions/panelActions';
import handleAllActions from '../actions/handler';

// TODO: @mai reset debug and log options
// TODO: @mai optimize large data.

export default class Panel extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	panel: {},
    	summary: {},
    	settings: {},
    	blocking: {},
    }
  }

	componentDidMount() {
		const tabId = new URLSearchParams(window.location.search).get('tabId');
		this.setPanelState(tabId);
		this.setSummaryState(tabId);
		this.setSettingsState();
		this.setBlockingState(tabId);
	}

	setPanelState = (tabId) => {
		getPanelData(tabId).then((data) => {
			this.setState({
				panel: data.panel,
			});
		});
	}

	setSummaryState = (tabId) => {
		getSummaryData(tabId).then((data) => {
			this.setState({
				summary: data,
			});
		});
	}

	setSettingsState = () => {
		getSettingsData().then((data) => {
			this.setState({
				settings: data,
			});
		});
	}

	setBlockingState = (tabId) => {
		getBlockingData(tabId).then((data) => {
			this.setState({
				blocking: data,
			});

			console.log('@@@@@@@####', this.state);
		});
	}

	setGlobalState = ({ view, updated }) => {
		const newState = Object.assign({}, this.state[view], updated);

		this.setState({
			[view]: newState,
		});
	}

	callGlobalAction = ({ actionName, actionData = {} }) => {
		const { view, updated } = handleAllActions({ actionName, actionData, currentState: this.state });
		if (view) {
			console.log('@@@@', view, updated);
			this.setGlobalState({ view, updated });
		}
	}

	get siteCategories() {
		return this.state.blocking.categories || [];
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
	          <Overview summary={this.state.summary} callGlobalAction={this.callGlobalAction} />
	          <FixedMenu panel={this.state.panel} callGlobalAction={this.callGlobalAction} />
	        </Tab>

	        <Tab tabLabel={'Site Trackers'}
	             linkClassName={'custom-link'}>
	          <SiteTrackers categories={this.siteCategories} callGlobalAction={this.callGlobalAction} />
	        </Tab>

	        <Tab tabLabel={'Global Trackers'}
	             linkClassName={'custom-link'}>
	          <GlobalTrackers categories={this.globalCategories} callGlobalAction={this.callGlobalAction} />
	        </Tab>
	      </Tabs>
			</div>
		)
	}
}
