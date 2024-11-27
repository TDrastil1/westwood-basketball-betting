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

// Populate scoreboard
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
    event.preventDefault();
    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);

    if (!player || !stat || isNaN(amount) || isNaN(expectedStat)) {
        document.getElementById("payout").innerHTML = "Please fill in all fields.";
        return;
    }

    const stats = playerStats[player];
    let averageStat = stats[stat];

    // Allow bets on players with 0 average stats
    if (averageStat === 0) {
        averageStat = 1; // Default average for players with no stats
    }

    // Calculate the risk level (higher risk for larger gaps between expectedStat and averageStat)
    const riskFactor = expectedStat / averageStat;

    // Define the house margin dynamically based on risk
    let houseMargin;
    if (riskFactor <= 1.1) {
        houseMargin = 0.45; // 45% margin for very low-risk bets
    } else if (riskFactor <= 1.5) {
        houseMargin = 0.3; // 30% margin for medium-low risk
    } else if (riskFactor <= 2) {
        houseMargin = 0.15; // 15% margin for medium-high risk
    } else {
        houseMargin = 0.1; // 10% margin for high-risk bets
    }

    // Calculate the odds multiplier after applying the house margin
    let finalMultiplier = riskFactor - houseMargin;

    // Ensure a minimum multiplier (low-risk bets should barely profit)
    if (finalMultiplier < 1.01) {
        finalMultiplier = 1.01; // Minimum profit for low-risk bets
    }

    // Cap the payout to avoid excessive returns
    const maxPayout = 5000; // Maximum payout cap
    let payout = amount * finalMultiplier;

    // Apply the payout cap
    if (payout > maxPayout) {
        payout = maxPayout;
    }

    // Display the possible payout
    document.getElementById("payout").innerHTML = `
        <p><strong>Player:</strong> ${player}</p>
        <p><strong>Stat:</strong> ${stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
        <p><strong>Possible Payout:</strong> ${payout.toFixed(2)} ς</p>
    `;
});

// Initialize the scoreboard
updateScoreboard();
