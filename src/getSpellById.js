'use strict';
const spellIds = {
    "21": "Barrier",
    "1": "Cleanse",
    "14": "Ignite",
    "3": "Exhaust",
    "4": "Flash",
    "6": "Ghost",
    "7": "Heal",
    "13": "Clarity",
    "30": "Poro Recall",
    "31": "Poro Toss",
    "11": "Smite",
    "39": "SnowballURF",
    "32": "Snowball",
    "12": "Teleport"
}

const getSpellById = id => {
    let str = spellIds[id];
    return str == undefined ? `${id} unknown id`: str;
};

export {getSpellById};