import { sendMessageInPromise } from '../utils/msg';

export function getPanelData(tabId) {
	return sendMessageInPromise('getPanelData', {
		tabId,
		view: 'panel',
	}).then((data) => {
		return data;
	});
}

export function getSummaryData(tabId) {
	return sendMessageInPromise('getPanelData', {
		tabId,
		view: 'summary',
	}).then((data) => {
		return data;
	});
}

export function getBlockingData(tabId) {
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
