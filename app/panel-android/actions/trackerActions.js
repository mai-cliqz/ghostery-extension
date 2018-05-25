import { sendMessage } from '../utils/msg';
import { updateObject } from '../utils/utils';

export function trustRestrictTracker({ actionData, state }) {
	let updated_site_specific_unblocks = {};
	let updated_site_specific_blocks = {};
	const updated_categories = JSON.parse(JSON.stringify(state.categories)); // deep clone
	const msg = actionData;
	const app_id = +msg.app_id;
	const { pageHost } = actionData;
	const siteSpecificUnblocks = state.site_specific_unblocks;
	const siteSpecificBlocks = state.site_specific_blocks;
	const pageUnblocks = siteSpecificUnblocks[pageHost] && siteSpecificUnblocks[pageHost].slice(0) || []; // clone
	const pageBlocks = siteSpecificBlocks[pageHost] && siteSpecificBlocks[pageHost].slice(0) || []; // clone

	// Site specific un-blocking
	if (msg.trust) {
		if (!pageUnblocks.includes(app_id)) {
			pageUnblocks.push(app_id);
		}
	} else if (pageUnblocks.includes(app_id)) {
		pageUnblocks.splice(pageUnblocks.indexOf(app_id), 1);
	}
	updated_site_specific_unblocks = updateObject(siteSpecificUnblocks, pageHost, pageUnblocks);

	// Site specific blocking
	if (msg.restrict) {
		if (!pageBlocks.includes(app_id)) {
			pageBlocks.push(app_id);
		}
	} else if (pageBlocks.includes(app_id)) {
		pageBlocks.splice(pageBlocks.indexOf(app_id), 1);
	}
	updated_site_specific_blocks = updateObject(siteSpecificBlocks, pageHost, pageBlocks);

	// update tracker category for site-specific blocking
	const updated_category = updated_categories[updated_categories.findIndex(item => item.id === msg.cat_id)];

	updated_category.trackers.forEach((tracker) => {
		if (tracker.shouldShow) {
			if (tracker.id === app_id) {
				tracker.ss_allowed = msg.trust;
				tracker.ss_blocked = msg.restrict;
			}
		}
	});

	// persist to background - note that categories are not included
	sendMessage('setPanelData', {
		site_specific_unblocks: updated_site_specific_unblocks,
		site_specific_blocks: updated_site_specific_blocks,
	});

	return {
		categories: updated_categories,
		site_specific_unblocks: updated_site_specific_unblocks,
		site_specific_blocks: updated_site_specific_blocks,
	};
}

export function blockUnblockTracker({ actionData, state }) {
	// Don't need this since we don't allow user to click on the option in the component
	// TODO @mai implement this on site trackers
	// const sitePolicy = action.sitePolicy || false;
	// const ghosteryPaused = action.paused_blocking || false;

	// // don't update if we're whitelisted or paused
	// if (sitePolicy || ghosteryPaused) {
	// 	return {};
	// }

	const { blocked, cat_id, app_id } = actionData;
	const updated_app_ids = JSON.parse(JSON.stringify(state.selected_app_ids)) || {};
	const updated_categories = JSON.parse(JSON.stringify(state.categories)) || []; // deep clone
	const catIndex = updated_categories.findIndex(item => item.id === cat_id);
	const updated_category = updated_categories[catIndex];

	updated_category.num_blocked = 0;
	updated_category.trackers.forEach((tracker) => {
		if (tracker.shouldShow) {
			if (tracker.id === app_id) {
				tracker.blocked = blocked;
				const key = tracker.id;
				if (blocked) {
					updated_app_ids[key] = 1;
				} else {
					delete updated_app_ids[key];
				}
			}
			if (tracker.blocked) {
				updated_category.num_blocked++;
			}
		}
	});

	// persist to background
	sendMessage('setPanelData', { selected_app_ids: updated_app_ids });

	return {
		categories: updated_categories,
		selected_app_ids: updated_app_ids,
	};
}

export function blockUnBlockAllTrackers({ actionData, state }) {
	const blocked = actionData.allBlocked;
	const updated_app_ids = JSON.parse(JSON.stringify(state.selected_app_ids)) || {};
	const updated_categories = JSON.parse(JSON.stringify(state.categories)) || [];

	updated_categories.forEach((category) => {
		category.num_blocked = 0;
		category.trackers.forEach((tracker) => {
			if (tracker.shouldShow) {
				tracker.blocked = blocked;
				const key = tracker.id;
				if (blocked) {
					category.num_blocked++;
					updated_app_ids[key] = 1;
				} else {
					delete updated_app_ids[key];
				}
			}
		});
	});

	// persist to background
	sendMessage('setPanelData', { selected_app_ids: updated_app_ids });

	return {
		selected_app_ids: updated_app_ids,
		categories: updated_categories
	};
}
