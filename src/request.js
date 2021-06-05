'use strict';

import 'dotenv/config.js';
import https from 'https';

//TODO: Reject
const request = path => {
    console.log(`<- ${path}`);
    return new Promise((resolve, reject) => {
        https.request({
            hostname: 'euw1.api.riotgames.com',
            method: 'GET',
            path: path,
            headers: {
                'X-Riot-Token': process.env.API_KEY
            }
        }, response => {
            let str = '';
            response.on('data', data => {
                str += data;
            });
            response.on('end', () => {
                if(response.statusCode == '200') console.log(`-> Riot finished responding`);
                else console.log(`-> Riot responded with code ${response.statusCode}`);
                resolve(JSON.parse(str));
            });
        }).end();
    });
};

export {request};
