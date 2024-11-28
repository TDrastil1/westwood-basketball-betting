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

    // Handle players with 0 stats by assigning a small default average
    if (averageStat === 0) {
        averageStat = 1; // Default average for players with no stats
    }

    // Calculate the risk factor: higher when expectedStat >> averageStat
    const riskFactor = expectedStat / averageStat;

    // Define house margins for risk categories
    let houseMargin;
    if (riskFactor <= 1) {
        houseMargin = 0.8; // Very high margin for low-risk bets
    } else if (riskFactor <= 1.5) {
        houseMargin = 0.4; // Moderate margin for medium-risk bets
    } else {
        houseMargin = 0.15; // Lower margin for high-risk bets
    }

    // Calculate the base multiplier after applying house margin
    let baseMultiplier = riskFactor - houseMargin;

    // Adjust the multiplier further based on the player's average stats
    const statAdjustmentFactor = Math.max(1 - averageStat / 20, 0.5); // Scales down payouts for high-stat players
    baseMultiplier *= statAdjustmentFactor;

    // Ensure a minimum multiplier (low-risk bets should barely profit)
    if (baseMultiplier < 1.01) {
        baseMultiplier = 1.01; // Minimum profit for low-risk bets
    }

    // Cap the payout to avoid excessive returns
    const maxPayout = 5000; // Maximum payout cap
    let payout = amount * baseMultiplier;

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
