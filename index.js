const axios = require('axios');
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const userID = prompt('Enter User ID to check: ');
const apiKey = prompt('Enter API Key: ');

let beatmaps = '';
let beatmapIds = '';

fs.writeFile(userID + '.csv', 'score_id,user_id,beatmap_id,score,count300,count100,count50,countmiss,combo,perfect,enabled_mods,date_played,rank,pp,replay_available\n', (err) => {
    if (err) throw err;
  });

async function getMaps () {
    beatmaps = await axios.get('http://osu.respektive.pw/beatmaps')
    beatmapIds = beatmaps.data.ranked.beatmaps;
}
async function getScores () {
    beatmapIds.forEach(function (id, i) {
        setTimeout( function () {
            axios.get('https://osu.ppy.sh/api/get_scores?k=' + apiKey + '&b=' + id + '&u=' + userID + '&limit=1')
            .then(response => {
                if (response.data[0] != undefined) {
                fs.appendFile(userID + '.csv', response.data[0].score_id + ',' + response.data[0].user_id + ',' + id + ',' + response.data[0].score + ',' + 
                response.data[0].count300 + ',' + response.data[0].count100 + ',' + response.data[0].count50 + ',' + response.data[0].countmiss + ',' + 
                response.data[0].maxcombo + ',' + response.data[0].perfect + ',' + response.data[0].enabled_mods + ',' + response.data[0].date + ',' +
                response.data[0].rank + ',' + response.data[0].pp + ',' + response.data[0].replay_available + '\n', function (err) {
                    if (err) throw err;
                });
            } else {
                return;
            }
            })
            .catch(error => {
                console.log(error);
            });
            console.log(i + 1 + '/' + beatmapIds.length);
        
        }, i * 200);
})
}
async function main(){
    await getMaps();
    getScores();
}

main();
