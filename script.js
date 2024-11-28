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

// Bet history and leaderboard data
const betHistory = [];
const leaderboard = {};
let currentUser = null; // Tracks the currently logged-in user

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

// Update bet history
function updateBetHistory(player, stat, expectedStat, amount, payout, outcome) {
    betHistory.push({ player, stat, expectedStat, amount, payout, outcome });

    const betHistoryList = document.getElementById("bet-history-list");
    betHistoryList.innerHTML = ''; // Clear the list

    betHistory.forEach((bet) => {
        const listItem = document.createElement('li');
        listItem.textContent = `You bet ${bet.amount} ς on ${bet.player} to achieve ${bet.expectedStat} ${bet.stat}. Outcome: ${bet.outcome} (${bet.payout.toFixed(2)} ς)`;
        betHistoryList.appendChild(listItem);
    });
}

// Update leaderboard
function updateLeaderboard(userName, winnings) {
    if (!leaderboard[userName]) {
        leaderboard[userName] = 0;
    }

    leaderboard[userName] += winnings;

    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = '';

    Object.entries(leaderboard)
        .sort((a, b) => b[1] - a[1])
        .forEach(([user, totalWinnings]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${user}: ${totalWinnings.toFixed(2)} ς`;
            leaderboardList.appendChild(listItem);
        });
}

// Register/Login User
document.getElementById("registerButton").addEventListener("click", () => {
    const userName = document.getElementById("registerName").value;
    if (userName) {
        currentUser = userName;
        document.getElementById("currentUser").textContent = `Logged in as: ${userName}`;
        document.getElementById("registerName").value = '';
    } else {
        alert("Please enter your name.");
    }
});

// Calculate and display payout
function calculatePayout(player, stat, expectedStat, amount) {
    const stats = playerStats[player];
    let averageStat = stats[stat] || 1; // Default to 1 if no stats available
    const riskFactor = expectedStat / averageStat;

    let houseMargin = riskFactor <= 1 ? 0.8 : riskFactor <= 1.5 ? 0.4 : 0.15;
    let statAdjustment
