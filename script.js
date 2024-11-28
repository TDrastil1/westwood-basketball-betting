// Sample player stats data
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

let currentUserName = null;

// Function to update the scoreboard with player stats
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = ''; // Clear the table before adding rows

    // Loop through the playerStats object and create a table row for each player
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

// Log in user via name
document.getElementById("loginButton").addEventListener("click", function () {
    const name = document.getElementById("loginName").value;
    if (name) {
        currentUserName = name;
        document.getElementById("currentUser").textContent = `Logged in as: ${currentUserName}`;
        document.getElementById("userNameInput").value = currentUserName; // Update the hidden input with the name
    } else {
        alert("Please enter a valid name.");
    }
});

// Calculate payout dynamically based on bet details
document.getElementById("betForm").addEventListener("input", function () {
    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);

    if (!player || !stat || isNaN(amount) || isNaN(expectedStat)) {
        document.getElementById("payout").textContent = "Please fill in all fields.";
        return;
    }

    const stats = playerStats[player];
    let averageStat = stats[stat] || 1;  // Default to 1 if the stat doesn't exist
    const riskFactor = expectedStat / averageStat;

    // Apply a risk factor multiplier for high-risk bets
    let payoutMultiplier = 1 + (riskFactor - 1) * 1.5;  // 1.5 is the multiplier factor for higher risk
    let houseMargin = 0.1;  // House margin to ensure profitability

    // Apply diminishing returns for extreme risk (to prevent runaway payouts)
    if (riskFactor > 3) {
        payoutMultiplier *= 0.85;
    }

    const payout = Math.min(amount * payoutMultiplier, 5000); // Cap the payout at 5000

    document.getElementById("payout").textContent = `${payout.toFixed(2)}
