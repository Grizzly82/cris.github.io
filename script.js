/* --------------------------------------------------
   TYPEWRITER EFFECT — Home Page
-------------------------------------------------- */

const typewriter = document.querySelector(".typewriter");
if (typewriter) {
    const text = "Cris Vizcaino";
    let i = 0;

    function type() {
        if (i < text.length) {
            typewriter.textContent += text.charAt(i);
            i++;
            setTimeout(type, 120);
        }
    }

    type();
}

/* --------------------------------------------------
   DARK / LIGHT MODE TOGGLE
-------------------------------------------------- */

const toggle = document.getElementById("theme-toggle");
if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        document.body.classList.toggle("dark");

        toggle.textContent = document.body.classList.contains("light")
            ? "☀️"
            : "🌙";
    });
}

/* --------------------------------------------------
   PROJECT FILTERING — Projects Page
-------------------------------------------------- */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.getAttribute("data-filter");

            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");

                card.style.display =
                    filter === "all" || filter === category ? "block" : "none";
            });
        });
    });
}

/* --------------------------------------------------
   MLB API — Yankees Live Stats
-------------------------------------------------- */

async function getYankeesStandings() {
    const url = "https://statsapi.mlb.com/api/v1/standings?leagueId=103&season=2024";
    const res = await fetch(url);
    const data = await res.json();

    const standingsDiv = document.getElementById("standings");
    standingsDiv.innerHTML = "";

    const teams = data.records[0].teamRecords;

    teams.forEach(team => {
        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${team.team.name}</h3>
            <p>Wins: ${team.wins}</p>
            <p>Losses: ${team.losses}</p>
            <p>Win %: ${team.winningPercentage}</p>
        `;

        standingsDiv.appendChild(card);
    });
}

async function getYankeesGames() {
    const url = "https://statsapi.mlb.com/api/v1/schedule?teamId=147&season=2024";
    const res = await fetch(url);
    const data = await res.json();

    const gamesDiv = document.getElementById("games");
    gamesDiv.innerHTML = "";

    const games = data.dates.slice(-5);

    games.forEach(date => {
        const game = date.games[0];
        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${game.teams.away.team.name} @ ${game.teams.home.team.name}</h3>
            <p>Date: ${date.date}</p>
            <p>Status: ${game.status.detailedState}</p>
        `;

        gamesDiv.appendChild(card);
    });
}

async function getYankeesPlayers() {
    const url = "https://statsapi.mlb.com/api/v1/teams/147/roster";
    const res = await fetch(url);
    const data = await res.json();

    const playersDiv = document.getElementById("players");
    playersDiv.innerHTML = "";

    const players = data.roster.slice(0, 6);

    players.forEach(player => {
        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${player.person.fullName}</h3>
            <p>Position: ${player.position.name}</p>
            <p>Jersey: ${player.jerseyNumber || "N/A"}</p>
        `;

        playersDiv.appendChild(card);
    });
}

/* --------------------------------------------------
   NFL API — Giants Standings (Corrected)
-------------------------------------------------- */

async function getGiantsStandings() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/standings";
    const res = await fetch(url);
    const data = await res.json();

    const standingsDiv = document.getElementById("giants-standings");
    standingsDiv.innerHTML = "";

    const nfcEast = data.children.find(div => div.name.includes("NFC East"));

    nfcEast.standings.entries.forEach(team => {
        const stats = team.stats;

        const wins = stats.find(s => s.name === "wins")?.value ?? 0;
        const losses = stats.find(s => s.name === "losses")?.value ?? 0;
        const ties = stats.find(s => s.name === "ties")?.value ?? 0;
        const winPct = stats.find(s => s.name === "winPercent")?.value ?? 0;

        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${team.team.displayName}</h3>
            <p>Record: ${wins}-${losses}-${ties}</p>
            <p>Win %: ${winPct.toFixed(3)}</p>
        `;

        standingsDiv.appendChild(card);
    });
}

/* --------------------------------------------------
   NFL API — Giants Players (Corrected)
-------------------------------------------------- */

async function getGiantsPlayers() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/19/roster";
    const res = await fetch(url);
    const data = await res.json();

    const playersDiv = document.getElementById("giants-players");
    playersDiv.innerHTML = "";

    const players = data.athletes;

    players.slice(0, 12).forEach(player => {
        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${player.displayName}</h3>
            <p>Position: ${player.position.displayName}</p>
            <p>Jersey: ${player.jersey || "N/A"}</p>
        `;

        playersDiv.appendChild(card);
    });
}

/* --------------------------------------------------
   NFL API — Giants Schedule (Corrected)
-------------------------------------------------- */

async function getGiantsSchedule() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/19/schedule";
    const res = await fetch(url);
    const data = await res.json();

    const scheduleDiv = document.getElementById("giants-schedule");
    scheduleDiv.innerHTML = "";

    const games = data.events;

    games.forEach(game => {
        const comp = game.competitions[0];
        const home = comp.competitors.find(t => t.homeAway === "home");
        const away = comp.competitors.find(t => t.homeAway === "away");

        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${away.team.displayName} @ ${home.team.displayName}</h3>
            <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
            <p>Status: ${game.status.type.description}</p>
        `;

        scheduleDiv.appendChild(card);
    });
}

/* --------------------------------------------------
   NFL API — Giants Stat Leaders (Corrected)
-------------------------------------------------- */

async function getGiantsStatLeaders() {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/19/roster";
    const res = await fetch(url);
    const data = await res.json();

    const leadersDiv = document.getElementById("giants-leaders");
    leadersDiv.innerHTML = "";

    const players = data.athletes;

    const leaderStats = [];

    for (const player of players) {
        const statsUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/athletes/${player.id}`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();

        if (!statsData.stats) continue;

        leaderStats.push({
            name: player.displayName,
            position: player.position.displayName,
            stats: statsData.stats
        });
    }

    leaderStats.slice(0, 10).forEach(p => {
        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>${p.name}</h3>
            <p>Position: ${p.position}</p>
            <p>${p.stats[0]?.name || "Stat"}: ${p.stats[0]?.value || "N/A"}</p>
        `;

        leadersDiv.appendChild(card);
    });
}

/* --------------------------------------------------
   NFL API — Giants Team Comparison vs Opponents (Corrected)
-------------------------------------------------- */

async function getGiantsComparison() {
    const scheduleUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/19/schedule";
    const scheduleRes = await fetch(scheduleUrl);
    const scheduleData = await scheduleRes.json();

    const comparisonDiv = document.getElementById("giants-comparison");
    comparisonDiv.innerHTML = "";

    const games = scheduleData.events.slice(0, 5);

    for (const game of games) {
        const comp = game.competitions[0];
        const opponent = comp.competitors.find(t => t.team.id !== "19");

        const opponentId = opponent.team.id;

        const oppRosterUrl = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${opponentId}/roster`;
        const oppRosterRes = await fetch(oppRosterUrl);
        const oppRosterData = await oppRosterRes.json();

        const card = document.createElement("div");
        card.className = "stat-card";

        card.innerHTML = `
            <h3>Giants vs ${opponent.team.displayName}</h3>
            <p>Recent Matchup: ${new Date(game.date).toLocaleDateString()}</p>
            <p>Status: ${game.status.type.description}</p>
            <p>Opponent Players: ${oppRosterData.athletes.length}</p>
        `;

        comparisonDiv.appendChild(card);
    }
}

/* --------------------------------------------------
   RUN ALL SPORTS FUNCTIONS ON sports.html
-------------------------------------------------- */

if (window.location.pathname.includes("sports.html")) {
    getYankeesStandings();
    getYankeesGames();
    getYankeesPlayers();

    getGiantsStandings();
    getGiantsPlayers();
    getGiantsSchedule();
    getGiantsStatLeaders();
    getGiantsComparison();
}


/* --------------------------------------------------
   CONTACT FORM — SUCCESS ANIMATION
-------------------------------------------------- */

/* const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        // Send to Formspree
        const res = await fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
        });

        if (res.ok) {
            const successBox = document.getElementById("success-message");

            // Show animation
            successBox.classList.remove("success-hidden");
            successBox.classList.add("success-visible");

            // Clear form
            contactForm.reset();

            // Hide after 3 seconds
            setTimeout(() => {
                successBox.classList.remove("success-visible");
                successBox.classList.add("success-hidden");
            }, 3000);
        }
    });
} */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);

        try {
            const res = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (res.ok) {
                showSuccessMessage();
                contactForm.reset();
            } else {
                showErrorMessage();
            }
        } catch (error) {
            showErrorMessage();
        }
    });
}

function showSuccessMessage() {
    const box = document.getElementById("success-message");
    box.classList.remove("success-hidden");
    box.classList.add("success-visible");

    setTimeout(() => {
        box.classList.remove("success-visible");
        box.classList.add("success-hidden");
    }, 3000);
}

function showErrorMessage() {
    alert("Message failed to send. Check your Formspree setup.");
}


function launchConfetti() {
    const container = document.getElementById("confetti-container");

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti-piece");

        // Random position
        piece.style.left = Math.random() * 100 + "vw";

        // Random size
        piece.style.width = piece.style.height = (6 + Math.random() * 10) + "px";

        // Random neon colors
        const colors = ["#00eaff", "#00bcd4", "#00fff2", "#00c8ff"];
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random animation delay
        piece.style.animationDelay = Math.random() * 0.3 + "s";

        container.appendChild(piece);

        // Remove after animation
        setTimeout(() => piece.remove(), 3000);
    }
}


if (res.ok) {
    showSuccessMessage();
    launchConfetti();
    contactForm.reset();
}
