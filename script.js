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

// Track the current user and bet history
let currentUser = null;
const userBetHistories = {};

// Log in user
document.getElementById("loginButton").addEventListener("click", () => {
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();

    if (name && email) {
        currentUser = email;
        document.getElementById("currentUser").textContent = `Logged in as: ${name}`;
        document.getElementById("userEmailInput").value = email;
        document.getElementById("userNameInput").value = name;

        if (!userBetHistories[email]) userBetHistories[email] = [];
        updateBetHistory();
        alert(`Welcome, ${name}!`);
    } else {
        alert("Please enter both your name and email to log in.");
    }
});

// Calculate the possible payout
function calculatePayout(player, stat, expectedStat, betAmount) {
    const stats = playerStats[player];
    const actualStat = stats[stat] || 0;
    const houseEdge = 0.05;
    const riskFactor = 0.15;

    let multiplier;

    if (expectedStat > actualStat) {
        multiplier = 1 + ((expectedStat - actualStat) * riskFactor) - houseEdge;
    } else {
        multiplier = 1 + (0.01 * expectedStat) - houseEdge;
    }

    multiplier = Math.max(multiplier, 1);
    multiplier = Math.min(multiplier, 5);

    return (betAmount * multiplier).toFixed(2);
}

// Update the payout dynamically
document.getElementById("betForm").addEventListener("input", () => {
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

// Submit the bet and send data to Formspree
document.getElementById("betForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const player = document.getElementById("player").value;
    const stat = document.getElementById("stat").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const expectedStat = parseFloat(document.getElementById("expected-stat").value);
    const name = document.getElementById("userNameInput").value;
    const email = document.getElementById("userEmailInput").value;

    const payout = calculatePayout(player, stat, expectedStat, amount);

    // Update bet history
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

    // Send bet to Formspree
    const formData = new FormData(e.target);
    fetch(e.target.action, {
        method: e.target.method,
        body: formData,
    }).then((response) => {
        if (response.ok) {
            alert("Bet submitted successfully!");
            e.target.reset();
            document.getElementById("payout").textContent = "Fill in your bet details to see the payout.";
            playTransactionAnimation();
        } else {
            alert("Error submitting your bet.");
        }
    });
});

// Update the scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = "";

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
updateScoreboard();

// Update bet history dynamically
function updateBetHistory() {
    const betHistoryList = document.getElementById("bet-history-list");
    betHistoryList.innerHTML = "";

    if (currentUser && userBetHistories[currentUser]) {
        const bets = userBetHistories[currentUser];
        if (bets.length === 0) {
            betHistoryList.innerHTML = "<p>No bets placed yet.</p>";
        } else {
            bets.forEach((bet) => {
                const betItem = document.createElement("li");
                betItem.textContent = `${bet.name} bet ${bet.amount} ς on ${bet.player} for ${bet.expectedStat} ${bet.stat}. Payout: ${bet.payout} ς.`;
                betHistoryList.appendChild(betItem);
            });
        }
    } else {
        betHistoryList.innerHTML = "<p>No bets placed yet.</p>";
    }
}

// Transaction animation
function playTransactionAnimation() {
    const animationContainer = document.getElementById("bet-animation");
    animationContainer.style.display = "block";
    setTimeout(() => {
        animationContainer.style.display = "none";
    }, 1500);
}
