# osu-score-fetcher-cli
 Fetch a users best osu! score for every ranked beatmap. Outputs scores in csv format used for import in [osu!alternative](https://twitter.com/albino_rhino12/status/1352293214536015880?lang=en)
 
### Requirements
- Node.js (https://nodejs.org)
- osu! account (https://osu.ppy.sh)
- Git (https://git-scm.com/)

### Setup
```Bash
git clone https://github.com/respektive/osu-score-fetcher-cli.git
cd osu-score-fetcher-cli
npm i
```

### Usage
Update with
```Bash
git pull
npm i
```
Start with
```Bash
node index
```

Note: checking every ranked beatmap can take a very long time as there are currently over 80k ranked maps, so keep that in mind. You can change the time interval between each api call in the index.js, however i do not recommend it as it's already quite low at 200ms.

![](https://pek.li/7657xx.gif)
