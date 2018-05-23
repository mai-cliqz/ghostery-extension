export function sendMessage(name, message, callback = function () {}) {
	return chrome.runtime.sendMessage({
		name,
		message,
	}, callback);
}
