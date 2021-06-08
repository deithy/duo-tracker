'use strict';

import 'dotenv/config.js';
import express from 'express';
import { log } from './src/log.js';
import { Match } from './src/Match.js';
import { Player } from './src/Player.js';

const app = express();
const players = [new Player('Shibumi'), new Player('Sleepy%20Blade')];


//Frontend
app.use(express.static('static'));

//Backend
app.use(log);
app.get('/stats', async (req, res) => {
    let response = [{
        ...await players[0].rank(), champs: await players[0].champs()
    },{
        ...await players[1].rank(), champs: await players[1].champs()
    }];
    res.send(response);
});

app.get('/matches', async (req, res) => {
    const merged = new Set([...await players[0].gameIds(), ...await players[1].gameIds()]);
    let matches = [...merged];
    for(let i in matches) {
        const temp = new Match(matches[i]);
        await temp.load();
        matches[i] = temp.label();
    }
    res.send(matches);
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Live at ${port}`);
});