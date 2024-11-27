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

    // Calculate the odds multiplier
    const oddsMultiplier = expectedStat / averageStat;

    // Apply a profit margin (20% by default)
    const profitMargin = 0.2;
    const finalMultiplier = Math.max(oddsMultiplier - profitMargin, 0.1); // Ensure minimum multiplier

    // Calculate total payout (includes the original bet)
    const totalPayout = amount * (finalMultiplier + 1);

    // Display the possible payout in a simple format
    document.getElementById("payout").innerHTML = `
        <p><strong>Player:</strong> ${player}</p>
        <p><strong>Stat:</strong> ${stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
        <p><strong>Possible Payout:</strong> ${totalPayout.toFixed(2)} ς</p>
    `;
});

// Initialize the scoreboard
updateScoreboard();
