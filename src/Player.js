import { getChampionById } from './getChampionById.js';
import { request } from './request.js';

export class Player {
    constructor(name) {
        this.name = name;
        request(`/lol/summoner/v4/summoners/by-name/${this.name}`)
            .then(response => {
                for(let key in response) this[key] = response[key];
                console.log(`Created player ${this.name}`);
                Player.mainNames.push(this.name);
            });
    }
    static mainNames = [];
    rank() {
        return new Promise((resolve) => {
            request(`/lol/league/v4/entries/by-summoner/${this.id}`)
            .then(entries => {
                entries.forEach(entry => {
                    if(entry.queueType == 'RANKED_SOLO_5x5') resolve({
                        name: entry.summonerName,
                        tier: entry.tier,
                        rank: entry.rank,
                        leaguePoints: entry.leaguePoints,
                        wins: entry.wins,
                        losses: entry.losses
                    });
                });
                resolve({error: 'solo/duo rank not found'});
            })
        });
    }
    champs(amount = 3) {
        return new Promise(resolve => {
            request(`/lol/champion-mastery/v4/champion-masteries/by-summoner/${this.id}`)
            .then(masteryArray => {
                let selected = [];
                for(let i = 0; i < amount; i++) {
                    selected[i] = {
                        id: getChampionById(masteryArray[i].championId),
                        level: masteryArray[i].championLevel,
                        pts: masteryArray[i].championPoints
                    };
                }
                resolve(selected);
            })
        });
    }
    gameIds(amount = 10) {
        return new Promise(resolve => {
            request(`/lol/match/v4/matchlists/by-account/${this.accountId}?endIndex=${amount}`)
            .then(response => {
                let gameIds = [];
                response.matches.forEach(match => {
                    gameIds.push(match.gameId);
                });
                resolve(gameIds);
            });
        });
    }
}