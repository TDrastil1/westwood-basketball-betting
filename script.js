const playerStats = {
    "Matthew Suk": { points: 2.0, assists: 4.0, rebounds: 4.0 },
    "Ari Piller": { points: 10.0, assists: 3.0, rebounds: 3.0 },
    "Evan Ludeman": { points: 4.0, assists: 4.0, rebounds: 0.0 },
    "Valin Lively": { points: 0.0, assists: 1.0, rebounds: 4.0 },
    "Reeyan Mistry": { points: 2.0, assists: 0.0, rebounds: 1.0 },
    "Arman Aslan": { points: 0.0, assists: 3.0, rebounds: 4.0 },
    "Ntito Josiah-Olu": { points: 0.0, assists: 0.0, rebounds: 0.0 },
    "Cyrus Terry": { points: 4.0, assists: 6.0, rebounds: 3.0 },
    "Pierre Tissot": { points: 14.0, assists: 6.0, rebounds: 6.0 },
    "Mark Djomo": { points: 10.0, assists: 3.0, rebounds: 4.0 },
};

let currentUserEmail = null;
let currentUserProfilePic = null;

// Google Sign-In callback function
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    currentUserEmail = profile.getEmail();
    currentUserProfilePic = profile.getImageUrl();

    // Update UI with user's profile info
    document.getElementById("currentUser").textContent = `Logged in as: ${currentUserEmail}`;
    document.getElementById("profile-pic").src = currentUserProfilePic;

    // Update hidden input with email for form submission
    document.getElementById("userEmailInput").value = currentUserEmail;
}

// Log out the user
function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementById("currentUser").textContent = "No user logged in.";
        document.getElementById("profile-pic").src = ""; // Clear profile picture
    });
}

// Update scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = '';
    for (let player in playerStats) {
        const stats = playerStats[player];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player}</td>
            <td>${stats.points}</td>
            <td>${stats.assists}</td>
            <td>${stats.rebounds}</td>
        `;
        scoreboardBody.appendChild(row);
    }
}

// Calculate payout dynamically
document.getElementById("betForm").addEventListener("input", function (event) {
    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);

    if (!player || !stat || isNaN(amount) || isNaN(expectedStat)) {
        document.getElementById("payout").textContent = "Please fill in all fields.";
        return;
    }

    const stats = playerStats[player];
    let averageStat = stats[stat] || 1;

    const riskFactor = expectedStat / averageStat;

    let houseMargin = riskFactor <= 1 ? 0.8 : riskFactor <= 1.5 ? 0.4 : 0.15;
    let payoutMultiplier = riskFactor - houseMargin;

    // Diminishing returns for very high expected stats
    if (riskFactor > 2) {
        payoutMultiplier *= 0.9;
    }

    payoutMultiplier = Math.max(payoutMultiplier, 1.01);
    const payout = Math.min(amount * payoutMultiplier, 500
