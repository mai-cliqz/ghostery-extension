import { sendMessage } from '../utils/msg';
import { addToArray, removeFromArray } from '../utils/utils';

function getPageHostFromSummary(summary) {
	return summary.pageHost.toLowerCase().replace(/^(http[s]?:\/\/)?(www\.)?/, '');
}

export function handleTrustButtonClick({ actionData, state }) {
	const summary = state;
	// This pageHost has to be cleaned.
	const pageHost = getPageHostFromSummary(summary);

	const siteBlacklist = summary.site_blacklist || [];
	const siteWhitelist = summary.site_whitelist || [];

	const currentState = siteWhitelist.indexOf(pageHost) !== -1;

	let updatedBlacklist = siteBlacklist.slice(0);
	let updatedWhitelist = siteWhitelist.slice(0);

	if (currentState) {
		updatedWhitelist = removeFromArray(siteWhitelist, siteWhitelist.indexOf(pageHost));
	} else {
		if (siteBlacklist.includes(pageHost)) {
			// remove from blacklist if site is trusted
			updatedBlacklist = removeFromArray(siteBlacklist, siteBlacklist.indexOf(pageHost));
		}
		if (!siteWhitelist.includes(pageHost)) {
			// add to whitelist
			updatedWhitelist = addToArray(siteWhitelist, pageHost);
		}
	}

	sendMessage('setPanelData', {
		site_whitelist: updatedWhitelist,
		site_blacklist: updatedBlacklist,
		paused_blocking: false,
	});

	return {
		site_whitelist: updatedWhitelist,
		site_blacklist: updatedBlacklist,
		paused_blocking: false,
	};
}

export function handleRestrictButtonClick({ actionData, state }) {
	const summary = state;
	const pageHost = getPageHostFromSummary(summary);

	const siteBlacklist = summary.site_blacklist || [];
	const siteWhitelist = summary.site_whitelist || [];

	const currentState = siteBlacklist.indexOf(pageHost) !== -1;

	let updatedBlacklist = siteBlacklist.slice(0);
	let updatedWhitelist = siteWhitelist.slice(0);

	if (currentState) {
		updatedBlacklist = removeFromArray(siteBlacklist, siteBlacklist.indexOf(pageHost));
	} else {
		if (siteWhitelist.includes(pageHost)) {
			// remove from whitelist if site is restricted
			updatedWhitelist = removeFromArray(siteWhitelist, siteWhitelist.indexOf(pageHost));
		}
		if (!siteBlacklist.includes(pageHost)) {
			// add to blacklist
			updatedBlacklist = addToArray(siteBlacklist, pageHost);
		}
	}

	sendMessage('setPanelData', {
		site_whitelist: updatedWhitelist,
		site_blacklist: updatedBlacklist,
		paused_blocking: false,
	});

	return {
		site_whitelist: updatedWhitelist,
		site_blacklist: updatedBlacklist,
		paused_blocking: false,
	};
}

export function handlePauseButtonClick({ state }) {
	const summary = state;
	const currentState = summary.paused_blocking;

	sendMessage('setPanelData', {
		paused_blocking: !currentState,
	});

	return {
		paused_blocking: !currentState,
	};
}

export function cliqzFeatureToggle({ actionData }) {
	const { currentState, type } = actionData;
	const key = `enable_${type}`;

	sendMessage('setPanelData', {
		[key]: !currentState,
	});

	return {
		[key]: !currentState,
	};
}
