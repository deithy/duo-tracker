'use strict';
const log = (req, res, next) => {
    console.log(`-> Incoming request for ${req.url}`);
    next();
};
export {log};