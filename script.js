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

// Variables for user login and bet tracking
let currentUserName = null;
let currentUserEmail = null;
let betHistory = [];
let leaderboard = [];

// Log in user via name and email
document.getElementById("loginButton").addEventListener("click", function () {
    const name = document.getElementById("loginName").value;
    const email = document.getElementById("loginEmail").value;
    if (name && email) {
        currentUserName = name;
        currentUserEmail = email;
        document.getElementById("currentUser").textContent = `Logged in as: ${currentUserName}`;
        document.getElementById("userEmailInput").value = currentUserEmail; // Update the hidden input with the email
    } else {
        alert("Please enter both your name and email.");
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
    const actualStat = stats[stat] || 0;  // Default to 0 if the stat doesn't exist

    // Define constants for calculations
    const riskFactor = 0.2;  // Scaling factor for risk
    const houseEdge = 0.0476;  // 4.76% house edge
    const maxMultiplier = 5;  // Cap on payout multiplier

    // Calculate payout multiplier
    let multiplier = 1; // Base multiplier for low-risk bets
    if (expectedStat > actualStat) {
        // High-risk: Increase multiplier based on risk factor
        multiplier = 1 + ((expectedStat - actualStat) / (actualStat + 1)) * riskFactor;
    } else {
        // Low-risk: Minimal payout for expectedStat <= actualStat
        multiplier = 1 + (expectedStat / (actualStat + 1)) * 0.05;
    }

    // Apply house edge
    multiplier -= houseEdge;

    // Ensure multiplier is within bounds
    if (multiplier < 1) multiplier = 1; // No negative payouts
    if (multiplier > maxMultiplier) multiplier = maxMultiplier;

    // Calculate final payout
    const payout = amount * multiplier;

    // Display the payout
    document.getElementById("payout").textContent = `${payout.toFixed(2)} ς`;
});

// Save bet history and update leaderboard
document.getElementById("betForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);
    const email = document.getElementById("userEmailInput").value;

    // Store bet details
    betHistory.push({
        player,
        stat,
        expectedStat,
        amount,
        payout: document.getElementById("payout").textContent,
        email,
    });

    // Display bet history
    updateBetHistory();

    // Update leaderboard
    leaderboard.push({ name: currentUserName, amount });
    leaderboard.sort((a, b) => b.amount - a.amount); // Sort descending by amount
    updateLeaderboard();

    // Reset form after submission
    document.getElementById("betForm").reset();
});

// Update Bet History display
function updateBetHistory() {
    const betHistoryList = document.getElementById("bet-history-list");
    betHistoryList.innerHTML = ""; // Clear the list before adding new entries

    if (betHistory.length === 0) {
        betHistoryList.innerHTML = "<li>No bets placed yet.</li>";
    } else {
        betHistory.forEach((bet) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${currentUserName} bet ${bet.amount} ς on ${bet.player} to get ${bet.expectedStat} ${bet.stat}. Payout: ${bet.payout}`;
            betHistoryList.appendChild(listItem);
        });
    }
}

// Initialize scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = ""; // Clear the table before adding rows

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
