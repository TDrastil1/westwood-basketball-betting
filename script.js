// Player stats based on your provided data
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

// Handle form submission to calculate the possible payout
document.getElementById("betForm").addEventListener("input", function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get values from the form
    let player = document.getElementById("player").value;
    let stat = document.getElementById("stat").value;
    let amount = parseFloat(document.getElementById("amount").value); // Ensure bet amount is a number
    let expectedStat = parseFloat(document.getElementById("expected-stat").value); // Ensure expected stat is a number

    // Update possible payout
    updatePayout(player, stat, expectedStat, amount);
});

// Function to calculate and display the possible payout
function updatePayout(player, stat, expectedStat, amount) {
    const stats = playerStats[player];
    if (!stats) {
        document.getElementById("payout").innerHTML = `<p>No stats available for this player.</p>`;
        return;
    }

    // Get the player's average stat value
    const averageStat = stats[stat];

    // Ensure valid stats for calculations
    if (averageStat === 0 || expectedStat === 0) {
        document.getElementById("payout").innerHTML = `<p>Invalid bet: Expected stat and average stat must be greater than 0.</p>`;
        return;
    }

    // Calculate the odds multiplier
    const oddsMultiplier = expectedStat / averageStat;

    // Calculate the payout
    const payout = amount * oddsMultiplier;

    // Display the possible payout and odds details
    document.getElementById("payout").innerHTML = `
        <p><strong>Player:</strong> ${player}</p>
        <p><strong>Stat:</strong> ${stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
        <p><strong>Average ${stat.charAt(0).toUpperCase() + stat.slice(1)}:</strong> ${averageStat.toFixed(2)}</p>
        <p><strong>Expected ${stat.charAt(0).toUpperCase() + stat.slice(1)}:</strong> ${expectedStat.toFixed(2)}</p>
        <p><strong>Odds Multiplier:</strong> ${oddsMultiplier.toFixed(2)}</p>
        <p><strong>Possible Payout:</strong> ${payout.toFixed(2)} ς</p>
    `;
}
