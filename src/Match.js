import { request } from './request.js';
import { getQueueById } from './getQueueById.js';
import { getChampionById } from './getChampionById.js';
import fs from 'fs';
import { Player } from './Player.js';
import { getSpellById } from './getSpellById.js';

export class Match {
	constructor(id) {
		this.id = id;
	}
	load() {
		return new Promise(async resolve => {
			let match;
			try {
				match = JSON.parse(fs.readFileSync(`matches/${this.id}.json`));
			} catch {
				match = await request(`/lol/match/v4/matches/${this.id}`);
				let data = JSON.stringify(match, null, 2);
				fs.writeFile(`matches/${this.id}.json`, data, (err) => {
					if (err) console.log(`Failed writing match ${this.id} to local storage`);
				});
			} finally {
				for(let key in match) this[key] = match[key];
				resolve();
			}
		});
	}
	label() {
		let label = {
			duration: this.gameDuration,
			date: this.gameCreation,
			queue: getQueueById(this.queueId),
			players: [],
			participants: [],
			flags: []
		};
		let mainPlayerTeam;
		for(let i = 0; i < this.participants.length; i++) {
			const current = this.participants[i];
			let participant = {
				name: this.participantIdentities[current.participantId - 1].player.summonerName,
				champion: getChampionById(current.championId)
			};
			label.participants[i] = participant;
			if(Player.mainNames.includes(participant.name)) {
				if(mainPlayerTeam == undefined) mainPlayerTeam = current.teamId;
				if(label.win == undefined) label.win = current.stats.win;
				let extended = {
					kills: current.stats.kills,
					deaths: current.stats.deaths,
					assists: current.stats.assists,
					lane: (current.timeline.role == 'DUO_SUPPORT' ? 'SUPPORT' : current.timeline.lane),
					level: current.stats.champLevel,
					spells: [getSpellById(current.spell1Id), getSpellById(current.spell2Id)],
					primary: current.stats.perk0,
					secondary: current.stats.perkSubStyle,
					items: [
						current.stats.item0,
						current.stats.item1,
						current.stats.item2,
						current.stats.item3,
						current.stats.item4,
						current.stats.item5,
						current.stats.item6,
					]
				};
				Object.assign(extended, participant);
				label.players.push(extended);
				//Flags
				if(current.stats.pentaKills) label.flags.push({id: 'penta', positive: true})
				else if(current.stats.quadraKills) label.flags.push({id: 'quadra', positive: true})

				let kda = ((extended.kills + extended.assists) / extended.deaths).toFixed(2);
				if( kda > 3) label.flags.push({id: 'high kda', positive: true});
				if( kda < 0.5) label.flags.push({id: 'low kda', positive: false});
			}
		}
		this.teams.forEach(team => {
			if(team.dragonKills >= 4) label.flags.push({
				id: 'dragon soul', 
				positive: (team.teamId == mainPlayerTeam)
			});
		});
		if(label.duration < 960) label.flags.push({id: 'FF 15', positive: label.win})
		else if (label.duration < 1260) label.flags.push({id: 'FF 20', positive: label.win})
		return label;
	}
}