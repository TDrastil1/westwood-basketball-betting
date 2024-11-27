// Player stats
const playerStats = {
    "Matthew Suk": { GP: 1, MPG: 0, PPG: 2.0, DEFR: 4.0, OFFR: 0.0, RPG: 4.0, APG: 1.0, SPG: 1.0, BPG: 0.0, TPG: 2.0, PFPG: 2.0 },
    "Ari Piller": { GP: 1, MPG: 0, PPG: 10.0, DEFR: 2.0, OFFR: 1.0, RPG: 3.0, APG: 1.0, SPG: 3.0, BPG: 0.0, TPG: 4.0, PFPG: 5.0 },
    "Evan Ludeman": { GP: 1, MPG: 0, PPG: 4.0, DEFR: 0.0, OFFR: 0.0, RPG: 0.0, APG: 1.0, SPG: 4.0, BPG: 0.0, TPG: 0.0, PFPG: 5.0 },
    "Valin Lively": { GP: 1, MPG: 0, PPG: 0.0, DEFR: 3.0, OFFR: 1.0, RPG: 4.0, APG: 1.0, SPG: 0.0, BPG: 0.0, TPG: 1.0, PFPG: 0.0 },
    "Reeyan Mistry": { GP: 1, MPG: 0, PPG: 2.0, DEFR: 1.0, OFFR: 0.0, RPG: 1.0, APG: 0.0, SPG: 2.0, BPG: 0.0, TPG: 0, PFPG: 2.0 },
    "Arman Aslan": { GP: 1, MPG: 0, PPG: 0.0, DEFR: 2.0, OFFR: 2.0, RPG: 4.0, APG: 0.0, SPG: 3.0, BPG: 0.0, TPG: 1.0, PFPG: 0.0 },
    "Ntito Josiah-Olu": { GP: 1, MPG: 0, PPG: 0.0, DEFR: 0.0, OFFR: 0.0, RPG: 0.0, APG: 0.0, SPG: 0.0, BPG: 0.0, TPG: 1.0, PFPG: 3.0 },
    "Cyrus Terry": { GP: 1, MPG: 0, PPG: 4.0, DEFR: 1.0, OFFR: 2.0, RPG: 3.0, APG: 2.0, SPG: 6.0, BPG: 0.0, TPG: 0.0, PFPG: 1.0 },
    "Pierre Tissot": { GP: 1, MPG: 0, PPG: 14.0, DEFR: 2.0, OFFR: 4.0, RPG: 6.0, APG: 2.0, SPG: 6.0, BPG: 0.0, TPG: 2.0, PFPG: 4.0 },
    "Mark Djomo": { GP: 1, MPG: 0, PPG: 10.0, DEFR: 2.0, OFFR: 2.0, RPG: 4.0, APG: 1.0, SPG: 3.0, BPG: 2.0, TPG: 4.0, PFPG: 4.0 },
};

// Handle form submission
document.getElementById("betForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get values from the form
    let player = document.getElementById("player").value;
    let stat = document.getElementById("stat").value;
    let amount = document.getElementById("amount").value;
    let expectedStat = document.getElementById("expected-stat").value;
    let userName = document.getElementById("userName").value; // Get the user's name

    // Create a summary for the bet
    let betSummary = `
        <p><strong>Your Name:</strong> ${userName}</p>
        <p><strong>Player:</strong> ${player}</p>
        <p><strong>Stat:</strong> ${stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
        <p><strong>Expected Amount:</strong> ${expectedStat}</p>
        <p><strong>Bet Amount:</strong> ${amount} ς</p>
        <p><strong>Bet Type:</strong> Over</p>
    `;

    // Show the summary to the user
    document.getElementById("summary").innerHTML = betSummary;

    // Send the bet details via Formspree (replace with your Formspree URL)
    fetch("https://formspree.io/f/xyzyplew", {
        method: "POST",
        body: JSON.stringify({
            _subject: "New Basketball Bet!",
            userName: userName, // Send the user's name
            player: player,
            stat: stat,
            expectedStat: expectedStat,
            amount: amount,
            _replyto: "simon.drastil@icloud.com",
            _format: "json",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            alert("Bet placed successfully!");
            document.getElementById("betForm").reset(); // Reset the form after submission
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("There was an issue placing your bet. Please try again.");
        });

    // Update the scoreboard
    updateScoreboard(player);
});

// Function to update the scoreboard
function updateScoreboard(player) {
    const stats = playerStats[player];
    if (!stats) {
        document.getElementById("scoreboard-content").innerHTML = `<p>No stats available for this player.</p>`;
        return;
    }

    // Generate HTML for the stats
    let statsHTML = `
        <p><strong>Player:</strong> ${player}</p>
        <p><strong>Games Played:</strong> ${stats.GP}</p>
        <p><strong>Minutes Per Game:</strong> ${stats.MPG}</p>
        <p><strong>Points Per Game:</strong> ${stats.PPG}</p>
        <p><strong>Defensive Rebounds:</strong> ${stats.DEFR}</p>
        <p><strong>Offensive Rebounds:</strong> ${stats.OFFR}</p>
        <p><strong>Rebounds Per Game:</strong> ${stats.RPG}</p>
        <p><strong>Assists Per Game:</strong> ${stats.APG}</p>
        <p><strong>Steals Per Game:</strong> ${stats.SPG}</p>
        <p><strong>Blocks Per Game:</strong> ${stats.BPG}</p>
        <p><strong>Turnovers Per Game:</strong> ${stats.TPG}</p>
        <p><strong>Personal Fouls Per Game:</strong> ${stats.PFPG}</p>
    `;

    // Update the scoreboard content
    document.getElementById("scoreboard-content").innerHTML = statsHTML;
}
