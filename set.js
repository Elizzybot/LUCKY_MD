const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUhNUUFhQXl3cUhKRGxyZzdRWGlJbDQrdHp6aXEzazNxZkxIZnRuNXdYZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicmpsK3V4UENFd3g0ZW95alo4UTFIclI4U1I3VG82d0tKQi8xT1FQV24wOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBTzVma3pkWGpna2NDb2tieGgxTUxYcEpaQTE1OEsyNzByVElEWno1TEVNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJpL25PK2VIVDhEZWRld3BxcXF6dkFEaXQ0ek5INEpuOG5JK2dMWnIrQXhFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9CdXkxcjVIZWhXR1owY2tDYTFHWE04RzlCYk1ZQS9HT2t5VWR6SDVFMGM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjI4SnhCRUNVZUMvVWMyQjBNZzJ5ZnkwNjJHQ3Q5dkErVDlCSEQ5RWJVWG89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibUpPWDZNVlpJZ3BQNExRbHpjSTJFb0M3UnhvaTl3Q2pTR1FOMWxrdVAybz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibzVwMzhuNDkrWXR4c084QWxIQ00yV3RrVUJkMGdTYkNzeEt1MzJxT1ZFND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9jMkRZKzF0Zm9PMnJ4ekhrMjVwRkNXRy91KzE1UnYwdCtOSlJDWkVnTFF4Z3lzZzFTejVTTzU0YU9YNERyWmgyOThBYlZ3VEZQdW51NWp6Z0tETWdnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTIwLCJhZHZTZWNyZXRLZXkiOiJCdUhVSXhDd0NudzliVXhPRXBFakpjUmZ0WXNjQ2tjUXBiajhFM2UrbzVjPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJIMlZLSG1nZlEweUgxRWlxU19pVFN3IiwicGhvbmVJZCI6IjgwOTlkOWIwLWE3NzQtNGY2Yy04NDA0LWUzNGFjZTk4MzZiNCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxdnk3eXBMc2hSd0xaeVFzTjg5WWVDa0pZSEU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidnh3eXdCWmdxQ0RpeGRncWxDcXFLU1J5cVJBPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjRINEhLWVY4IiwibWUiOnsiaWQiOiIyMzQ3MDM4NDk0OTk3OjExQHMud2hhdHNhcHAubmV0IiwibmFtZSI6IkdSRVktSEVBUlQtVEVDSCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSS80aXRJR0VOejY4TFlHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMlJBS2NBSnRYWTkzZWZ2dlVHQ0VneEVtdWY1N0R4UkVTbTNMZTRhRjQzWT0iLCJhY2NvdW50U2lnbmF0dXJlIjoic3gxR0NJTmxoS3ZVV2VrSDEvVzcrNlpCWEFlcTU0cVY3RGF6aFVDU0doaGN1ZGtxUDlVNk5QWUFLV0xEdTB0cFVZaWRpNFZhaUR2SVBkQ3E4OEpuQXc9PSIsImRldmljZVNpZ25hdHVyZSI6Im9QQ1VWZ2NVUXdZdVZYZCtPaUZ1WlltM3I5VGVmcVVkT2FEWkZuNTdlRXhuaEF0OE41SXFObGc2N3RkekxkeDF5RXhvdkVRb3pYWkVaQVFIckptNml3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0NzAzODQ5NDk5NzoxMUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJka1FDbkFDYlYyUGQzbjc3MUJnaElNUkpybitldzhVUkVwdHkzdUdoZU4yIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzI1NzA5Njc0fQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Ftedie",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "2347038494997,2349039727490",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'Lucky Md ',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/926c7a8ad7ff624c144b7.jpg,https://telegra.ph/file/187cfa2365d88ffe98fec.jpg,',
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
