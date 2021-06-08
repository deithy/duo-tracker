# Duo tracker

A personal op.gg for you and your duo partner.

You can view [DEMO HERE](https://duo.deithy.me/)


## Installation

You will need node, npm and a valid API key from [Riot developer portal](https://developer.riotgames.com/)

Copy files from repo
```bash
$ git clone https://github.com/deithy/duo-tracker
```

Install dependencies
```bash
$ npm install
```

Create .env file with and set variables
```bash
$ touch .env
```
```bash
PORT=*your port*
API_KEY=*your api key*
```

Launch in testing enviroment
```bash
$ npm run dev
```
Navigate to `http://localhost:*your port*`

## Usage

Repo comes with an example frontend website that consumes endpoints of an API.
You may freely change this website located in `static/` directory without breaking backend logic

### Routing
API has just 2 simple endpoints:
* `/stats` - responds with information about player current rank, matches played etc.
* `/matches` - reponds with an array of matches played by both players

### Example responses
Request path `http://localhost:5000/stats`
```JSON
[
    {
        "name":"Shibumi",
        "tier":"PLATINUM",
        "rank":"III",
        "leaguePoints":75,
        "wins":104,
        "losses":102,
        "champs":[
            {"id":"Quinn","level":6,"pts":42314},
            {"id":"Kaisa","level":5,"pts":34331},
            {"id":"Vayne","level":5,"pts":30805}
        ]
    },{
        "name":"Sleepy Blade",
        "tier":"PLATINUM",
        "rank":"II",
        "leaguePoints":35,
        "wins":104,
        "losses":102,
        "champs":[
            {"id":"Lux","level":7,"pts":67192},
            {"id":"Yone","level":6,"pts":35566},
            {"id":"Ezreal","level":5,"pts":25447}
        ]
    }
]
```
Request path `http://localhost:5000/matches`
```JSON
[
    {
        "duration":1318,
        "date":1619807282683,
        "queue":"Draft Pick",
        "players":[
            {
                "kills":3,
                "deaths":3,
                "assists":5,
                "lane":"MIDDLE",
                "level":13,
                "spells":["Barrier","Flash"],
                "primary":8229,
                "secondary":8100,
                "items":[1056,3191,6655,3020,1058,0,3340],
                "name":"Shibumi",
                "champion":"Lux"
            }
        ],
        "participants":[
            {"name":"Pietrov Depoitre","champion":"Zed"},
            {"name":"Pablo Depoitre","champion":"Camille"},
            {"name":"Astra Lunara","champion":"Samira"},
            {"name":"Melönchen","champion":"Nidalee"},
            {"name":"M00NSTAR","champion":"Yuumi"},
            {"name":"Shibumi","champion":"Lux"},
            {"name":"Arlo Black","champion":"Ezreal"},
            {"name":"tryhard puri","champion":"Pyke"},
            {"name":"MisterJeppoe","champion":"Zilean"},
            {"name":"SapphireNocturne","champion":"LeeSin"}
        ],
        "flags":[],
        "win":false
    },
]
```

## License
Project is under MIT license. Let me know if you make something cool with it :)
If you wish to know more read my [blog post](https://deithy.me/project/duo-tracker).