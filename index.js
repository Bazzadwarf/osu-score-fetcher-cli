require('es6-promise').polyfill();
const axios = require('axios');
const originalFetch = require('isomorphic-fetch');
const fetch = require('fetch-retry')(originalFetch)
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const userID = prompt('Enter User ID to check: ');
const apiKey = prompt('Enter API Key: ');
const loved = prompt('Include Loved maps (yes/no)? ', "no")
const sr_range = prompt('Star rating range (0-12): ', "0-12")
const start_date = prompt('Start Date (2007-01-01): ', "2007-01-01")
const end_date = prompt('End Date (2022-01-01): ', "2022-01-01")

let beatmaps = '';
let beatmapIds = '';
let scores = [];

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};  

fs.writeFile(userID + '.csv', 'score_id,user_id,beatmap_id,score,count300,count100,count50,countmiss,combo,perfect,enabled_mods,date_played,rank,pp,replay_available\n', (err) => {
    if (err) throw err;
  });

async function getMaps () {
    beatmaps = await axios.get(`https://osu.respektive.pw/beatmaps?star_rating=${sr_range}&from=${start_date}&to=${end_date}`)
    beatmapIds = beatmaps.data.ranked.beatmaps;
    if (loved != "no") {
        beatmapIds = beatmapIds.concat(beatmaps.data.loved.beatmaps);
    }
}
async function getScores () {
    for (const id of beatmapIds) {
            //time interval between each api call in ms
            await sleep(2000);

            fetch('https://osu.ppy.sh/api/get_scores?k=' + apiKey + '&b=' + id + '&u=' + userID + '&limit=1',{
                retries: 3,
                retryDelay: 1000,
                retryOn: function(attempt, error, response) {
                    if (error !== null || response.status >= 400) {
                      console.log(`retrying, attempt number ${attempt + 1}`);
                    }
                }
              })
              .then(function(response) {
                return response.json()
                })
                .then(function(data) {
                    scores.push(data[0]);
                    fs.appendFile(userID + '.csv', data[0].score_id + ',' + data[0].user_id + ',' + id + ',' + data[0].score + ',' + 
                    data[0].count300 + ',' + data[0].count100 + ',' + data[0].count50 + ',' + data[0].countmiss + ',' + 
                    data[0].maxcombo + ',' + data[0].perfect + ',' + data[0].enabled_mods + ',' + data[0].date + ',' +
                    data[0].rank + ',' + data[0].pp + ',' + data[0].replay_available + '\n', function (err) {
                        if (err) throw err;
                    });   
                })
                .catch(function(error) {
                    console.log('no score found on beatmap id: ' + id);
                });
        console.log(scores.length + 1 + '/' + beatmapIds.length);
       
    }
}

async function main(){
    await getMaps();
    getScores();
}

main();
