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

// Log in user via name and email
document.getElementById("loginButton").addEventListener("click", function () {
    const name = document.getElementById("loginName").value;
    const email = document.getElementById("loginEmail").value;
    if (name && email) {
        document.getElementById("currentUser").textContent = `Logged in as: ${name}`;
        document.getElementById("userEmailInput").value = email;
    } else {
        alert("Please enter both your name and email.");
    }
});

// Calculate payout dynamically
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
    const actualStat = stats[stat] || 0; // Default to 0 if stat doesn't exist
    const houseEdge = 0.05; // 5% house edge
    const riskFactor = 0.15; // Scaling factor for high-risk bets
    const maxMultiplier = 5; // Cap on multiplier
    let multiplier = 1;

    if (expectedStat > actualStat) {
        // High-risk bet: Scale payout proportionally
        multiplier = 1 + ((expectedStat - actualStat) / (actualStat + 1)) * riskFactor - houseEdge;
    } else {
        // Low-risk bet: Minimal payout increase
        multiplier = 1 + (0.01 * expectedStat); // Small increment per stat
    }

    // Ensure multiplier is within bounds
    multiplier = Math.max(multiplier, 1); // Minimum multiplier is 1
    multiplier = Math.min(multiplier, maxMultiplier); // Maximum multiplier is 5

    // Calculate final payout
    const payout = amount * multiplier;

    // Display payout
    document.getElementById("payout").textContent = `${payout.toFixed(2)} ς`;
});

// Basketball animation trigger
document.querySelector('.bet-button').addEventListener('click', function (e) {
    e.target.classList.add('clicked');
    setTimeout(() => {
        e.target.classList.remove('clicked');
    }, 1000); // Reset animation after 1 second
});

// Update scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = "";

    // Populate stats dynamically
    for (let player in playerStats) {
        const stats = playerStats[player];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player}</td>
            <td>${stats.points}</td>
            <td>${stats.assists}</td>
            <td>${stats.rebounds}</td>
        `;
        scoreboardBody.appendChild(row);
    }
}
updateScoreboard();
