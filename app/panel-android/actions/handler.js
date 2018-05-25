import { handleTrustButtonClick, handleRestrictButtonClick, handlePauseButtonClick, cliqzFeatureToggle } from './summaryActions';
import { trustRestrictTracker, blockUnblockTracker, blockUnBlockAllTrackers } from './trackerActions';

// Handler center :D
export default function handleAllActions({ actionName, actionData, currentState }) {
	let updated = {};
	let view = '';

	switch(actionName) {
		case 'handleTrustButtonClick':
			view = 'summary';
			updated = handleTrustButtonClick({ actionData, state: currentState[view] });
			break;

		case 'handleRestrictButtonClick':
			view = 'summary';
			updated = handleRestrictButtonClick({ actionData, state: currentState[view] });
			break;

		case 'handlePauseButtonClick':
			view = 'summary';
			updated = handlePauseButtonClick({ state: currentState[view] });
			break;

		case 'cliqzFeatureToggle':
			view = 'panel';
			updated = cliqzFeatureToggle({ actionData });
			break;

		case 'trustRestrictTracker':
			view = 'blocking';
			const pageHost = currentState.summary.pageHost;
			actionData.pageHost = pageHost;
			updated = trustRestrictTracker({ actionData, state: currentState[view] });
			break;

		case 'blockUnblockSiteTracker':
			view = 'blocking';
			updated = blockUnblockTracker({ actionData, state: currentState[view] });
			break;

		case 'blockUnblockGlobalTracker':
			view = 'settings';
			updated = blockUnblockTracker({ actionData, state: currentState[view] });
			break;

		case 'blockUnBlockAllSiteTrackers':
			view = 'blocking';
			updated = blockUnBlockAllTrackers({ actionData, state: currentState[view] });
			break;

		case 'blockUnBlockAllGlobalTrackers':
			view = 'settings';
			updated = blockUnBlockAllTrackers({ actionData, state: currentState[view] });
			break;

		default:
			updated = {};
			view = '';
	}

	return {
		view, updated,
	};
}
