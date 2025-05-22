document.addEventListener("DOMContentLoaded", function () {
    // Example dynamic data
    const userCount = 1023;
    const chatCount = 287;
    const moodScore = 7.5;

    // Update statistics
    document.getElementById("userCount").innerText = userCount;
    document.getElementById("chatCount").innerText = chatCount;
    document.getElementById("moodScore").innerText = moodScore;

    // Example User Details
    const userData = {
        name: "Alex Johnson",
        age: 21,
        mood: "Happy"
    };

    // Update user panel
    document.getElementById("userName").innerText = userData.name;
    document.getElementById("userAge").innerText = userData.age;
    document.getElementById("userMood").innerText = userData.mood;

    // Chart.js for Mood Analysis
    const ctx = document.getElementById("moodChart").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Happy", "Neutral", "Sad", "Stressed"],
            datasets: [{
                label: "User Mood Distribution",
                data: [50, 30, 15, 5],
                backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6"]
            }]
        }
    });
});
