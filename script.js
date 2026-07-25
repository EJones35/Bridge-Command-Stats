let profileFormClosed = false
let navBarClosed = false

frontlineSectors = [
	"08",
	"16",
	"16",
	"15",
	"13",
	"12",
	"11",
	"08"	
]

function loadData() {
	const profileSaved = localStorage.getItem("profile");
	if (profileSaved) {
		const profile = JSON.parse(profileSaved);
		updateProfileInfo(profile)
	}

	const settingsSaved = localStorage.getItem("settings");
	if (settingsSaved) {
		const settings = JSON.parse(settingsSaved);
		profileFormClosed = settings.profileForm;
		navBarClosed = settings.navBar;
}
}

function updateProfileInfo(profile) {
	const profileNameDisplay = document.getElementById("profile-name");
	const profileCallsignDisplay = document.getElementById("profile-callsign");
	const profileRankDisplay = document.getElementById("profile-rank");
	const profileDescriptionDisplay = document.getElementById("profile-description");

	profileNameDisplay.innerHTML = `<p><strong>Name: </strong>${profile["name"]}</p>`;
	profileCallsignDisplay.innerHTML = `<p><strong>Callsign: </strong>${profile["callsign"]}</p>`;
	profileRankDisplay.innerHTML = `<p><strong>Rank: </strong>${profile["rank"]}</p>`;

	if (profile["description"].trim()) {
		console.log(profile["description"])
		profileDescriptionDisplay.innerHTML = `<p><strong>Description: </strong>${profile["description"]}<p>`;
	}
}

function closeNav() {
	const nav = document.getElementById("nav");
	nav.innerHTML = "";

	nav.innerHTML += `<button id="close-nav" class="close-nav" onclick="openNav()">Open</button>`;

	navBarClosed = true;
	saveSettings();
}

function openNav() {
	const nav = document.getElementById("nav");
	nav.innerHTML = "";

	nav.innerHTML += `<a href="#home">Home</a>
		<a href="#profile">Profile</a>
		<a href="#dashboard">Dashboard</a>
		<a href="#stats">Stats</a>
		<a href="#mission-history">Mission History</a>
		<a href="#add-mission">Add Mission</a>
		<a href="#reference">Reference</a>
		<button id="close-nav" class="close-nav" onclick="closeNav()">Close</button>`;

	navBarClosed = false;
	saveSettings();
}

function closeProfileForm() {
	const profileForm = document.getElementById("profile-form");
	profileForm.innerHTML = "";

	profileForm.innerHTML += `<button id="open-profile-form" class="open-profile-form" onclick="openProfileForm()">Open</button>`;

	profileFormClosed = true;
	saveSettings();
}

function openProfileForm() {
	const profileForm = document.getElementById("profile-form");
	profileForm.innerHTML = "";

	profileForm.innerHTML += `<label for="profile-name-form">Name</label>
			<input type="text" id="profile-name-form">

			<br>

			<label for="profile-callsign-form">Callsign</label>
			<input type="text" id="profile-callsign-form">

			<br>

			<label for="profile-rank-form">Rank</label>
			<select id="profile-rank-form">
				<option>Cadet</option>
				<option>Ensign</option>
				<option>Sub Lieutenant</option>
				<option>Lieutenant</option>
				<option>Lieutenant Commander</option>
			</select>

			<br>

			<label for="profile-description-form">Description</label>
			<textarea id="profile-description-form" rows="4"></textarea>

			<br>

			<button type="button" id="profile-save" onclick="saveProfile()">Save</button>

			<br>

			<button id="close-profile-form" class="close-profile-form" onclick="closeProfileForm()">Close</button>`;

	profileFormClosed = false;
	saveSettings();
}

function saveProfile() {
	let oldProfile = localStorage.getItem("profile");

	if (oldProfile) {
		oldProfile = JSON.parse(oldProfile);
	} else {
		oldProfile = {
			name: "",
			callsign: "",
			rank: "Cadet",
			description: ""
		};
	}

	const profileNameInput = document.getElementById("profile-name-form");
	const profileCallsignInput = document.getElementById("profile-callsign-form");
	const profileRankInput = document.getElementById("profile-rank-form");
	const profileDescriptionInput = document.getElementById("profile-description-form");

	let name;
	let callsign;
	let rank;
	let description;

	if (profileNameInput.value.trim()) {
		name = profileNameInput.value;
	} else {
		name = oldProfile.name;
	}

	if (profileCallsignInput.value.trim()) {
		callsign = profileCallsignInput.value;
	} else {
		callsign = oldProfile.callsign;
	}

	if (profileRankInput.value.trim()) {
		rank = profileRankInput.value;
	} else {
		rank = oldProfile.rank;
	}

	if (profileDescriptionInput.value.trim()) {
		description = profileDescriptionInput.value;
	} else {
		description = oldProfile.description;
	}

	const profile = {
		name: name,
		callsign: callsign,
		rank: rank,
		description: description
	};

	localStorage.setItem("profile", JSON.stringify(profile));

	updateProfileInfo(profile);
}

function saveSettings() {
	const settings = {
		profileForm: profileFormClosed,
		navBar: navBarClosed
	};

	localStorage.setItem("settings", JSON.stringify(settings));
}

function updateMissionDisplay() {
	const missionForm = document.getElementById("mission-form");

	let currentType = "Diplomacy";
	let isFrontline = false;

	const missionType = document.getElementById("mission-type");

	if (missionType) {
		currentType = missionType.value;
	}

	if (currentType == "Frontline") {
		isFrontline = true;
	}

	missionForm.innerHTML = `
		<label for="mission-name">Name</label>
		<input type="text" id="mission-name">

		<br>

		<label for="mission-date">Date</label>
		<input type="datetime-local" id="mission-date">

		<br>

		<label for="mission-type">Type</label>
		<select id="mission-type" onchange="updateMissionDisplay()">
			<option>Diplomacy</option>
			<option>Exploration</option>
			<option>Intrigue</option>
			<option>Military</option>
			<option>Frontline</option>
		</select>

		<br>

		<label for="mission-ship">Ship</label>
		<select id="mission-ship">
			<option>UCS Havock</option>
			<option>UCN Takanami</option>
		</select>
	`;

	document.getElementById("mission-type").value = currentType;

	if (isFrontline) {
		missionForm.innerHTML += `
			<br>
			<label for="mission-frontline-sector-a">Sector</label>
			<select id="mission-frontline-sector-a" onchange="updateFrontlineSectorInput()">
				<option>01</option>
				<option>02</option>
				<option>03</option>
				<option>04</option>
				<option>05</option>
				<option>06</option>
				<option>07</option>
				<option>08</option>
			</select> -
			<select id="mission-frontline-sector-b">
			</select>
		`;
		document.getElementById("mission-type").value = currentType;
	}

	missionForm.innerHTML += `
			<br>
			<label for="mission-outcome">Outcome</label>
			<select id="mission-outcome">
				<option>Decisive Defeat</option>
				<option>Minor Defeat</option>
				<option>Stalemate</option>
				<option>Minor Victory</option>
				<option>Decisive Victory</option>
			</select>
		`;

	document.getElementById("mission-type").value = currentType;
	updateFrontlineSectorInput()
}

function updateFrontlineSectorInput() {
	let firstFrontlineSector = document.getElementById("mission-frontline-sector-a");
	let secondFrontlineSector = document.getElementById("mission-frontline-sector-b");
	secondFrontlineSector.innerHTML = "";
	let firstFrontlineSectorValue = firstFrontlineSector.value;

	let secondFrontlineSectorValues = frontlineSectors[firstFrontlineSectorValue-1];

	for(let value = 1; value <= secondFrontlineSectorValues; value ++) {
		if(value >= 10) {
			secondFrontlineSector.innerHTML += `<option>${value}</option>`;
		} else {
			secondFrontlineSector.innerHTML += `<option>${"0" + value}</option>`;
		}
	}
}


loadData()

if (navBarClosed) {
	closeNav();
} else {
	openNav();
}

if (profileFormClosed) {
	closeProfileForm();
} else {
	openProfileForm();
}

updateMissionDisplay();

updateFrontlineSectorInput()