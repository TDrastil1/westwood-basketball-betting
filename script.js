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

// Log in user
document.getElementById("loginButton").addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value;
    if (email) {
        currentUserEmail = email;
        document.getElementById("currentUser").textContent = `Logged in as: ${email}`;
        document.getElementById("userEmailInput").value = email; // Update hidden input in the form
        document.getElementById("loginEmail").value = ''; // Clear input
    } else {
        alert("Please enter a valid email.");
    }
});

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

    payoutMultiplier = Math.max(payoutMultiplier, 1.01);
    const payout = Math.min(amount * payoutMultiplier, 5000);

    document.getElementById("payout").textContent = `${payout.toFixed(2)} ς`;
});

// Initialize scoreboard
updateScoreboard();
