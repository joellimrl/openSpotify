const supportedHostnames = ["open.spotify.com", "play.spotify.com"];

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
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

const checkCurrentTab = async () => {
	const currentTab = await getCurrentTab();

	// New tabs have no url
	if (currentTab?.url) {
		const tab = new URL(currentTab.url);
		if (supportedHostnames.includes(tab.hostname)) {
			const steamURL = `spotify:${tab.pathname.substring(1)}`;
			console.log("navigating to:", steamURL);
			await updateTab({ url: steamURL });
		}
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
