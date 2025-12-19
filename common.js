function createSnowflakes() {
    const container = document.getElementById("snowflakes");
    // Don't create snowflakes if the container is not on the page
    if (!container) {
        return;
    }
    for (let i = 0; i < 60; i++) {
        const s = document.createElement("div");
        s.className = "snowflake";
        s.textContent = Math.random() > 0.5 ? "❄" : "✨";
        s.style.left = Math.random() * 100 + "%";
        s.style.animationDuration = Math.random() * 3 + 3 + "s";
        s.style.animationDelay = Math.random() * 5 + "s";
        s.style.fontSize = Math.random() * 1.5 + 0.5 + "em";
        container.appendChild(s);
    }
}
createSnowflakes();
