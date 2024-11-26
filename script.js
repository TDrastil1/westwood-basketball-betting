// Handle form submission
document.getElementById("betForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the form from submitting the default way

    // Get values from the form
    let player = document.getElementById("player").value;
    let stat = document.getElementById("stat").value;
    let amount = document.getElementById("amount").value;
    let expectedStat = document.getElementById("expected-stat").value;

    // Create a summary for the bet
    let betSummary = `
        Player: ${player} <br>
        Stat: ${stat.charAt(0).toUpperCase() + stat.slice(1)} <br>
        Expected Amount: ${expectedStat} <br>
        Bet Amount: ${amount} ς <br>
        Bet Type: Over
    `;

    // Show the summary to the user
    document.getElementById("summary").innerHTML = betSummary;

    // Send the bet details via Formspree (replace with your Formspree URL)
    fetch('https://formspree.io/f/xyzyplew', {
        method: 'POST',
        body: JSON.stringify({
            _subject: 'New Basketball Bet!',
            player: player,
            stat: stat,
            expectedStat: expectedStat,
            amount: amount,
            _replyto: 'simon.drastil@icloud.com',
            _format: 'json',
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        alert('Bet placed successfully!');
        document.getElementById("betForm").reset();  // Reset the form after submission
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an issue placing your bet. Please try again.');
    });
});
