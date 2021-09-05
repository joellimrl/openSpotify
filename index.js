// https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V
// spotify:artist:${id}
// spotify:track:${id}
// https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V?si=dIDOS51WRFiPXypn0_Fksg&dl_branch=1&nd=1

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

const supportedHostnames = ["open.spotify.com", "play.spotify.com"];
/**
 * Checks currently activated tab and activates page button if it's valid.
 */
const checkCurrentTab = async () => {
	const currentTab = await getCurrentTab();
	console.log(
		"🚀 ~ file: index.js ~ line 42 ~ checkCurrentTab ~ currentTab",
		currentTab
	);

	const currentTabHostname = new URL(currentTab.url).hostname;
	console.log(
		"🚀 ~ file: index.js ~ line 44 ~ checkCurrentTab ~ currentTabHostname",
		currentTabHostname
	);
	//    if (supportedHostnames.includes(currentTabHostname)) {
	// 	 app.pageAction.show(currentTab.id);
	// 	 app.pageAction.setTitle({ tabId: currentTab.id, title: "Open in Steam"});
	//    } else {
	// 	 app.pageAction.hide(currentTab.id);
	// 	 app.pageAction.setTitle({ tabId: currentTab.id, title: "Not on Steam page"});
	//    };
};

// Check the tab on extension load
checkCurrentTab();

// app.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
// 	if (!changeInfo.url) return;

// 	const currentTab = await getCurrentTab();
// 	if (tabId !== currentTab.id) return;

// 	checkCurrentTab();
// });

// app.tabs.onActivated.addListener(async () => {
// 	checkCurrentTab();
// });

// const FIREFOX_WORKAROUND = false;

// app.pageAction.onClicked.addListener(async (tab) => {
// 	const steamURL = `steam://openurl/${tab.url}`;
// 	console.log("navigating to:", steamURL);

// 	if (
// 		(await browser.runtime.getBrowserInfo()).name === "Firefox" &&
// 		FIREFOX_WORKAROUND
// 	) {
// 		// open new tab, updating url with steam:// url does not work in firefox anymore
// 		const newTab = await app.tabs.create({ url: steamURL });

// 		setTimeout(() => {
// 			console.log("closing tab", newTab);
// 			// close the new temporary tab
// 			app.tabs.remove(newTab.id);
// 			// active the old tab back
// 			app.tabs.update(tab.id, { active: true });
// 		}, 100);
// 	} else {
// 		app.tabs.update({ url: steamURL });
// 	}
// });
