document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'a32738498ff745c78a6714bdefb36dfd';
    const API_URL = 'https://api.football-data.org/v4/';

    async function fetchMatches() {
        try {
            const response = await fetch(`${API_URL}matches`, {
                headers: { 'X-Auth-Token': API_KEY }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Matches data:', data);
            return data.matches;
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    }
    
    async function fetchStandings(competition) {
        try {
            const response = await fetch(`${API_URL}competitions/${competition}/standings`, {
                headers: { 'X-Auth-Token': API_KEY }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`${competition} standings data:`, data);
            return data.standings[0].table;
        } catch (error) {
            console.error(`Error fetching ${competition} standings:`, error);
        }
    }
    
    function renderStandings(standings, leagueId) {
        const standingsTable = document.querySelector(`#${leagueId} table tbody`);
        if (standings && standings.length > 0) {
            standingsTable.innerHTML = '';
            standings.forEach(team => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${team.position}</td>
                    <td>${team.team.name}</td>
                    <td>${team.points}</td>
                `;
                standingsTable.appendChild(tr);
            });
        } else {
            standingsTable.innerHTML = '<tr><td colspan="3">No standings found</td></tr>';
        }
    }

    function renderMatches(matches) {
        const matchesList = document.getElementById('matches-list');
        if (matches && matches.length > 0) {
            matchesList.innerHTML = '';
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = `${match.homeTeam.name} vs ${match.awayTeam.name} - ${new Date(match.utcDate).toLocaleString()}`;
                matchesList.appendChild(li);
            });
        } else {
            matchesList.innerHTML = '<li>No matches found</li>';
        }
    }

    Promise.all([
        fetchStandings('PL'), // Premier League
        fetchStandings('SA')  // Serie A
    ]).then(([premierLeagueStandings, serieAStandings]) => {
        renderStandings(premierLeagueStandings, 'premier-league');
        renderStandings(serieAStandings, 'seria-a');
    }).catch(error => {
        console.error('Error fetching standings:', error);
    });

    fetchMatches().then(renderMatches).catch(error => {
        console.error('Error fetching matches:', error);
    });
});
