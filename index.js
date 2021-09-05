const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const userID = prompt('Enter User ID to check: ');
const apiKey = prompt('Enter API Key: ');
const interval = prompt('Time interval between API calls in ms (500): ', 500);
const loved = prompt('Include Loved maps [yes/no/only](no)? ', "no")
const sr_range = prompt('Star rating range (0-12): ', "0-12")
const tags = prompt('Tags separated by "," (leave blank for no tags): ', "")
const start_date = prompt('Start Date (2007-01-01): ', "2007-01-01")
const end_date = prompt('End Date (2022-01-01): ', "2022-01-01")

let beatmaps = '';
let beatmapIds = '';
let scores = [];
let foundScores = [];

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};  

fs.writeFile(userID + '.csv', 'score_id,user_id,beatmap_id,score,count300,count100,count50,countmiss,combo,perfect,enabled_mods,date_played,rank,pp,replay_available\n', (err) => {
    if (err) throw err;
  });

async function getMaps () {
    beatmaps = await axios.get(`https://osu.respektive.pw/beatmaps?star_rating=${sr_range}&tags=${tags}&from=${start_date}&to=${end_date}`)
    beatmapIds = beatmaps.data.ranked.beatmaps;
    if (loved == "yes") {
        beatmapIds = beatmapIds.concat(beatmaps.data.loved.beatmaps);
    } else if (loved == "only") {
        beatmapIds = beatmaps.data.loved.beatmaps;
    }
}
async function getScores () {
    for (const id of beatmapIds) {
        await sleep(interval);
        let keepTrying;
        let retries = 0;
        let data = [];

        do {
            try {
                await fetch('https://osu.ppy.sh/api/get_scores?k=' + apiKey + '&b=' + id + '&u=' + userID + '&limit=1')
                .then(async function(response) {
                    data = await response.json();
                    scores.push(data[0]);
                    if (data.length) {
                        fs.appendFile(userID + '.csv', data[0].score_id + ',' + data[0].user_id + ',' + id + ',' + data[0].score + ',' + 
                        data[0].count300 + ',' + data[0].count100 + ',' + data[0].count50 + ',' + data[0].countmiss + ',' + 
                        data[0].maxcombo + ',' + data[0].perfect + ',' + data[0].enabled_mods + ',' + data[0].date + ',' +
                        data[0].rank + ',' + data[0].pp + ',' + data[0].replay_available + '\n', function (err) {
                            if (err) throw err;
                        });
                        foundScores.push(data[0]);
                    }

                        keepTrying = false;
                    });
            } catch (err) {
                if (data.length) {
                    if (retries <= 6) {
                        keepTrying = true;
                        retries += 1;
                        await sleep(2 ** retries * 100);
                        console.error("retry: " + retries);  
                    } else {
                        keepTrying = false;
                        console.error("max retries reached")
                    }
                }
              }
        } while (keepTrying)
    
        if (data.length) {
            console.log('(' + scores.length + '/' + beatmapIds.length + '): ' + 'found score on beatmap id: ' + id);
        } else {
            console.log('(' + scores.length + '/' + beatmapIds.length + '): ' + 'no score found on beatmap id: ' + id);
        }
}
}

async function main(){
    await getMaps();
    await getScores();
    console.log(`found ${foundScores.length} scores on ${beatmapIds.length} maps.\nwrote scores to ${__dirname}\\${userID}.csv`)
}

main();
