import { sendMessageInPromise } from '../utils/msg';

export function getSummaryData(tabId = null) {
	return sendMessageInPromise('getPanelData', {
		tabId,
		view: 'summary',
	}).then((data) => {
		return data;
	});
}

export function getBlockingData(tabId = null) {
	return sendMessageInPromise('getPanelData', {
		tabId,
		view: 'blocking',
	}).then((data) => {
		return data;
	});
}

export function getSettingsData() {
	return sendMessageInPromise('getPanelData', {
		view: 'settings',
	}).then((data) => {
		return data;
	});
}
