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

// Global variables to track logged-in users and bet histories
let currentUser = null;
const userBetHistories = {};

// Log in user
document.getElementById("loginButton").addEventListener("click", function () {
    const name = document.getElementById("loginName").value;
    const email = document.getElementById("loginEmail").value;

    if (name && email) {
        currentUser = email;
        document.getElementById("currentUser").textContent = `Logged in as: ${name}`;
        document.getElementById("userEmailInput").value = email;
        document.getElementById("userNameInput").value = name;

        // Initialize bet history for the user if not already present
        if (!userBetHistories[email]) {
            userBetHistories[email] = [];
        }
        updateBetHistory();
    } else {
        alert("Please enter both your name and email.");
    }
});

// Update the scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = ""; // Clear existing rows

    // Populate the scoreboard with player stats
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
updateScoreboard(); // Ensure the scoreboard loads when the page is opened

// Calculate the possible payout
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
    const houseEdge = 0.05; // House retains a 5% edge
    const riskFactor = 0.15; // Higher risk increases payout
    const maxMultiplier = 5; // Cap the multiplier

    let multiplier = 1;

    if (expectedStat > actualStat) {
        // High-risk bet logic
        multiplier = 1 + ((expectedStat - actualStat) / (actualStat + 1)) * riskFactor - houseEdge;
    } else {
        // Low-risk bet logic
        multiplier = 1 + (0.01 * expectedStat); // Slight increase for low-risk
    }

    // Ensure multiplier stays within bounds
    multiplier = Math.max(multiplier, 1); // Minimum payout is 1x the bet amount
    multiplier = Math.min(multiplier, maxMultiplier); // Maximum payout is 5x the bet amount

    const payout = amount * multiplier;
    document.getElementById("payout").textContent = `${payout.toFixed(2)} ς`;
});

// Submit bet and update bet history
document.getElementById("betForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);
    const name = document.getElementById("userNameInput").value;
    const email = document.getElementById("userEmailInput").value;

    const stats = playerStats[player];
    const actualStat = stats[stat] || 0;
    const houseEdge = 0.05;
    const riskFactor = 0.15;
    const maxMultiplier = 5;

    let multiplier = 1;

    if (expectedStat > actualStat) {
        multiplier = 1 + ((expectedStat - actualStat) / (actualStat + 1)) * riskFactor - houseEdge;
    } else {
        multiplier = 1 + (0.01 * expectedStat);
    }

    multiplier = Math.max(multiplier, 1);
    multiplier = Math.min(multiplier, maxMultiplier);

    const payout = amount * multiplier;

    if (currentUser) {
        const betDetails = {
            player,
            stat,
            expectedStat,
            amount,
            payout: payout.toFixed(2),
            name,
        };
        userBetHistories[currentUser].push(betDetails);
        updateBetHistory();
    }

    // Submit the form to Formspree
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
                alert("There was an error submitting your bet.");
            }
        })
        .catch((error) => {
            alert("Network error. Please try again.");
        });
});

// Update the bet history dynamically
function updateBetHistory() {
    const betHistoryList = document.getElementById("bet-history-list");
    betHistoryList.innerHTML = ""; // Clear previous history

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
