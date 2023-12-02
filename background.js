const supportedHostnames = ["open.spotify.com", "play.spotify.com"];
const storageCache = {};

// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = async () => {
	const items = await getAllStorageSyncData();
	// Copy the data retrieved from storage into storageCache.
	Object.assign(storageCache, items);
};

async function getAllStorageSyncData() {
	// Immediately return a promise and start asynchronous work
	return new Promise((resolve, reject) => {
		// Asynchronously fetch all data from storage.sync.
		chrome.storage.sync.get(null, (items) => {
			// Pass any observed errors down the promise chain.
			if (chrome.runtime.lastError) {
				return reject(chrome.runtime.lastError);
			}
			// Pass the data retrieved from storage down the promise chain.
			resolve(items);
		});
	});
}

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let tabs = await chrome.tabs.query(queryOptions);
	return tabs[0];
}

// Workaround for tab error ( Tabs cannot be edited right now (user may be dragging a tab))
const updateTab = async (info) => {
	try {
		await chrome.tabs.update(info);
	} catch (e) {
		setTimeout(async () => {
			await updateTab(info);
		}, 500);
	}
};

const checkIfShouldLoad = async (url, currentTab) => {
	// Don't load same page twice
	if (storageCache["currentUrl"] === url) {
		return false;
	}
	if (storageCache["openingPref"] === "alert") {
		// Inject confirm alert into current tab
		const result = await chrome.scripting.executeScript({
			target: { tabId: currentTab.id },
			func: () => {
				return confirm("Proceed to spotify page on desktop app?");
			},
		});
		if (!result[0].result) return false;
	}
	return true;
};

const checkCurrentTab = async () => {
	const currentTab = await getCurrentTab();
	try {
		await initStorageCache();
		// New tabs have no url
		if (currentTab?.url) {
			const tab = new URL(currentTab.url);
			if (supportedHostnames.includes(tab.hostname)) {
				const spotifyUrl = `spotify:${tab.pathname.substring(1)}`;
				if ((await checkIfShouldLoad(spotifyUrl, currentTab)) === false) {
					return;
				}
				// Store this page in storage to check for duplicate
				await chrome.storage.sync.set({
					currentUrl: spotifyUrl,
				});
				await updateTab({ url: spotifyUrl });
			}
		}
	} catch (e) {
		console.error("Error: ", e);
	}
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
	if (!changeInfo.url) return;

	const currentTab = await getCurrentTab();
	if (tabId !== currentTab.id) return;

	await checkCurrentTab();
});

chrome.tabs.onActivated.addListener(async () => {
	await checkCurrentTab();
});
