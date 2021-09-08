// Saves options to chrome.storage
function save_options() {
	var opening = document.getElementById("opening").value;
	var like = document.getElementById("like").checked;
	chrome.storage.sync.set(
		{
			openingPref: opening,
			like: like,
		},
		function () {
			// Update status to let user know options were saved.
			var status = document.getElementById("status");
			status.textContent = "Options saved!";
			setTimeout(function () {
				status.textContent = "";
			}, 750);
		}
	);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get(
		{
			openingPref: "auto",
			like: true,
		},
		function (items) {
			document.getElementById("opening").value = items.openingPref;
			document.getElementById("like").checked = items.like;
		}
	);
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
