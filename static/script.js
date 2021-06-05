fetch('stats')
.then(response => response.json())
.then(response => {
    response.forEach(player => {
        let playerContainer = document.createElement('section');
        playerContainer.className = 'player';
        playerContainer.innerHTML += `
            <h1>${player.name}</h1>
            <div class='tier'>
                <img src='assets/ranked-emblems/${player.tier}.png'/>
                <div>
                    <p>Ranked Solo/Duo</p>
                    <h1>${player.tier} ${player.rank}</h1>
                    <p>${player.leaguePoints}LP | ${player.wins}W ${player.losses}L</p>
                    <p>Win Ratio ${((player.wins/(player.wins + player.losses)) * 100).toFixed(1)}%</p>
                </div>
            </div>
        `;
        let championContainer = document.createElement('div');
        championContainer.className = 'top-champ';
        player.champs.forEach(champion => {
            championContainer.innerHTML += `
                <div>
                    <img src='assets/champion/${champion.id}.png'/>
                    <div class='champ-desc'>
                        <img src='assets/mastery/${champion.level}.png'/>
                        <p>${champion.pts} pts</p>
                    </div>
                </div>
            `;
        });
        playerContainer.appendChild(championContainer);
        document.body.appendChild(playerContainer);
    });
});

fetch('matches')
.then(response => response.json())
.then(response => {
    let matchHistory = document.createElement('section');
    matchHistory.id = 'match-history';
    let stats = {
        wins: 0,
        losses: 0,
        playerNames: []
    };
    response.forEach(match => {
        let matchContainer = document.createElement('div');
        matchContainer.className = 'match';

        //Result
        matchContainer.innerHTML += `<div ${match.win ? `class='green'` : ``}></div>`;
        match.win ? stats.wins++ : stats.losses++;

        //Time & Queue type
        const daysElapsed = Math.ceil((Date.now() - match.date) / (1000 * 3600 * 24));
        matchContainer.innerHTML += `
            <div>
                <p>${match.queue}</p>
                <p>${daysElapsed} day${daysElapsed > 1 ? 's' : ''} ago</p>
            </div>
        `;

        //Players
        let playersContainer = document.createElement('div');
        playersContainer.className = 'main-participants';
        match.players.forEach(player => {
            playersContainer.innerHTML += `
                <div>
                    <div class='main-champ'>
                        <img src='assets/champion/${player.champion}.png'/>
                        <div>${player.level}</div>
                    </div>
                    <p>${player.kills}/${player.deaths}/${player.assists}</p>
                    <p>${player.deaths == 0 ? 'Perfect' : ((player.kills + player.assists) / player.deaths).toFixed(2) + ':1'}</p>
                    <div class='runes'>
                        <img src='assets/runes/${player.primary}.png'/>
                        <img src='assets/runes/${player.secondary}.png'/>
                    </div>
                    <div class='items'>
                        <img src='assets/item/${player.items[0]}.png'/>
                        <img src='assets/item/${player.items[1]}.png'/>
                        <img src='assets/item/${player.items[2]}.png'/>
                        <img src='assets/item/${player.items[3]}.png'/>
                        <img src='assets/item/${player.items[4]}.png'/>
                        <img src='assets/item/${player.items[5]}.png'/>
                        <img src='assets/item/${player.items[6]}.png'/>
                    </div>
                    <div class='spells'>
                        <img src='assets/spells/${player.spells[0]}.png'/>
                        <img src='assets/spells/${player.spells[1]}.png'/>
                    </div>
                </div>
            `;
            if(stats[player.name] == undefined) {
                stats.playerNames.push(player.name);
                stats[player.name] = {
                    totalKills: 0,
                    totalDeaths: 0,
                    totalAssists: 0,
                    lanes: {
                        TOP: 0,
                        JUNGLE: 0,
                        MIDDLE: 0,
                        BOTTOM: 0,
                        SUPPORT: 0
                    },
                    champions: {}
                };
            }
            stats[player.name].totalKills += player.kills;
            stats[player.name].totalDeaths += player.deaths;
            stats[player.name].totalAssists += player.assists;
            if(player.lane != 'NONE') stats[player.name].lanes[player.lane]++;
            if(stats[player.name].champions[player.champion] == undefined) {
                stats[player.name].champions[player.champion] = {
                    wins: 0,
                    losses: 0
                };
            }
            if(match.win) stats[player.name].champions[player.champion].wins++;
            else stats[player.name].champions[player.champion].losses++;
        });
        matchContainer.appendChild(playersContainer);

        //Flags (Labels)
        let flagsContainer = document.createElement('div');
        flagsContainer.className = 'labels';
        match.flags.forEach(flag => {
            flagsContainer.innerHTML += `
                <div ${flag.positive ? `class='green'` : ``}>${flag.id.toUpperCase()}</div>
            `;
        });
        matchContainer.appendChild(flagsContainer);

        //Participants
        let participantsContainer = document.createElement('div');
        participantsContainer.className = 'participants';
        match.participants.forEach(participant => {
            participantsContainer.innerHTML += `
                <div><img src='assets/champion/${participant.champion}.png'/>${participant.name}</div>
            `;
        });
        matchContainer.appendChild(participantsContainer);


        matchContainer.innerHTML += `
            <div>
                <p>${(match.duration / 60).toFixed(0)}min ${match.duration % 60}s</p>
                <p>${new Date(match.date).toDateString()}</p>
            </div>
        `;
        matchHistory.appendChild(matchContainer);
    });
    document.body.appendChild(matchHistory);

    let statsContainer = document.createElement('section');
    statsContainer.id = 'stats';
    statsContainer.innerHTML += `
    <div id='wr-circle'>
        <h3>${stats.wins / (stats.wins + stats.losses) * 100}%</h3>
        <svg id='wr'>
            <circle cx='50%' cy="50%" r="45%"/>
            <circle cx="50%" cy="50%" r="45%" stroke-dashoffset="${340 * stats.wins / (stats.wins + stats.losses)}"/>
        </svg>
    </div>
    `;
    let playersStats = document.createElement('div');
    stats.playerNames.forEach(player => {
        let divContainer = document.createElement('div');
        divContainer.className = 'player-stats';
        divContainer.innerHTML += `<p>${player}:</p>`;
        let lanesContainer = document.createElement('div');
        lanesContainer.className = 'lanes';

        //Selecting 3 most played roles
        for(let i = 0; i < 3; i++) {
            let bestLane;
            let gamesAmount = 0;
            for(const lane in stats[player].lanes) {
                if(stats[player].lanes[lane] > gamesAmount) {
                    bestLane = lane;
                    gamesAmount = stats[player].lanes[lane];
                }
            }
            stats[player].lanes[bestLane] = -1;
            divContainer.innerHTML += `
            <figure>
                <img src='assets/lanes/${bestLane}.png'/>
                <figcaption>${gamesAmount / (stats.wins + stats.losses) * 100}%</figcaption>
            </figure>
            `;
        }

        divContainer.innerHTML += `<p>${stats[player].totalKills} / ${stats[player].totalDeaths} / ${stats[player].totalAssists}</p>`;

        let champsContainer = document.createElement('div');
        champsContainer.className = 'recent-champs';
        for(const champion in stats[player].champions) {
            let total = stats[player].champions[champion].wins + stats[player].champions[champion].losses;
            champsContainer.innerHTML += `
                <figure>
                    <img src='assets/champion/${champion}.png'/>
                    <figcaption>${total}</figcaption>
                </figure>
            `;
        }
        divContainer.appendChild(champsContainer);
        playersStats.appendChild(divContainer);
    });
    statsContainer.appendChild(playersStats);
    document.body.appendChild(statsContainer);
});