// Player stats data
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

// Function to calculate payout
function calculatePayout(player, stat, expectedStat, betAmount) {
    const stats = playerStats[player];
    const actualStat = stats[stat] || 0; // Default to 0 if stat not available
    const houseEdge = 0.05; // House retains a 5% edge
    const riskFactor = 0.15; // Higher-risk bets increase payouts
    const maxMultiplier = 5; // Cap on the maximum multiplier
    let multiplier = 1;

    if (expectedStat > actualStat) {
        // High-risk bet: The payout increases based on how much higher the bet is
        multiplier = 1 + ((expectedStat - actualStat) * riskFactor) - houseEdge;
    } else {
        // Low-risk bet: Small increase for betting below or at the current stat
        multiplier = 1 + ((expectedStat / actualStat) * 0.05); // Increment slightly
    }

    // Clamp multiplier between minimum and maximum values
    multiplier = Math.max(multiplier, 1); // Minimum multiplier is 1x
    multiplier = Math.min(multiplier, maxMultiplier); // Maximum multiplier is 5x

    const payout = betAmount * multiplier;
    return payout.toFixed(2); // Return the payout as a fixed decimal
}

// Update possible payout dynamically
document.getElementById("betForm").addEventListener("input", function () {
    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);

    if (!player || !stat || isNaN(amount) || isNaN(expectedStat)) {
        document.getElementById("payout").textContent = "Please fill in all fields.";
        return;
    }

    const payout = calculatePayout(player, stat, expectedStat, amount);
    document.getElementById("payout").textContent = `${payout} ς`;
});

// Update bet history
document.getElementById("betForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);
    const name = document.getElementById("userNameInput").value;
    const email = document.getElementById("userEmailInput").value;

    const payout = calculatePayout(player, stat, expectedStat, amount);

    if (currentUser) {
        const betDetails = {
            player,
            stat,
            expectedStat,
            amount,
            payout,
            name,
        };
        userBetHistories[currentUser].push(betDetails);
        updateBetHistory();
    }

    const formData = new FormData(e.target);
    fetch(e.target.action, {
        method: e.target.method,
        body: formData,
        headers: { Accept: "application/json" },
    })
        .then((response) => {
            if (response.ok) {
                alert("Bet submitted successfully!");
                e.target.reset();
                document.getElementById("payout").textContent = "Fill in your bet details to see the payout.";
            } else {
                alert("Error submitting your bet. Please check your details and try again.");
            }
        })
        .catch((error) => {
            console.error("Submission error:", error);
            alert("Network error. Please try again.");
        });
});

// Update scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = ""; // Clear current scoreboard

    // Populate player stats in the scoreboard
    for (const player in playerStats) {
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
updateScoreboard(); // Load stats on page load

// Update bet history dynamically
function updateBetHistory() {
    const betHistoryList = document.getElementById("bet-history-list");
    betHistoryList.innerHTML = ""; // Clear previous bets

    if (currentUser && userBetHistories[currentUser]) {
        const bets = userBetHistories[currentUser];
        if (bets.length === 0) {
            betHistoryList.innerHTML = "<p>No bets placed yet.</p>";
        } else {
            bets.forEach((bet) => {
                const betItem = document.createElement("li");
                betItem.textContent = `You bet ${bet.amount} ς on ${bet.player} to achieve ${bet.expectedStat} ${bet.stat}. Possible payout: ${bet.payout} ς.`;
                betHistoryList.appendChild(betItem);
            });
        }
    } else {
        betHistoryList.innerHTML = "<p>No bets placed yet.</p>";
    }
}
