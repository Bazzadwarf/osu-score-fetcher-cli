# osu-score-fetcher-cli
 Fetch a users best osu! score for every ranked beatmap. Outputs scores in csv format used for import in [osu!alternative](https://twitter.com/albino_rhino12/status/1352293214536015880?lang=en)
 
### Requirements
- Node.js (https://nodejs.org)
- osu! account (https://osu.ppy.sh)
- osu! API Key (https://osu.ppy.sh/p/api/)
- Git (https://git-scm.com/downloads)

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
npm run start
```

If it throws an error when updating or starting regarding the `package-lock.json` you can just delete that file and try again.

Default values for prompts are in parentheses. In general if you just want to check every ranked map you don't need to input anything after entering your API key.

![](https://pek.li/mxj7qw.gif)

### Advanced Usage (By [@WitchOfFrost](https://github.com/witchoffrost))
Before starting with advanced mode, please make sure you understand the basic [JSON Syntax](https://www.w3schools.com/js/js_json_syntax.asp).

Query Parameters need to be enclosed by aposthrophes, and the query itself needs to be enclosed by curly brackets.

Quick Reference:  
`[]` - Required Parameter.  
`<>` - Optional Parameter.  
`{}` - Limitation of preceeding argument (if present).  
-> `{*, [Integer]}` - Maximum count of arguments.  
`!VALID` - Argument will be validated.  
`!ESC` - Preceeding argument will be escaped.  
`!WHOLE` - Preceeding Number has to be whole.  
`Integer` - A whole Number.  
`Operator` - A mathematical Operator.  
`String` - A sentence or word.  


Following parameters are available:  
`beatmap_id - [Integer]!WHOLE !VALID` - The Beatmap ID.  
`beatmapset_id - [Integer]!WHOLE !VALID` - The Beatmap-Set ID.  
`approved - [Operator]{<,>,=, [1]}[Integer{0, 1, 2, 3, 4}[1]]!WHOLE !VALID` - The Approved Status of maps.  
(4 = loved, 3 = qualified, 2 = approved, 1 = ranked, 0 = pending, -1 = WIP, -2 = graveyard)  
`mode - [Operator]{<,>,=, [1]}[Integer{0, 1, 2, 3}[1]]!WHOLE !VALID` - The Gamemode of the maps.  
(0 = osu!, 1 = Taiko, 2 = CTB, 3 = Mania)  
`total_length - [Operator]{<,>,=, [1]}[Integer]!WHOLE !VALID` - The Total Lenght of the map in seconds.  
`hit_length - [Operator]{<,>,=, [1]}[Integer]!WHOLE !VALID` - The Drain Lenght of the map in seconds.  
`difficulty - [String]!ESC` - The Difficulty name of the map.  
`artist - [String]!ESC` - The Artist of the map's Song.  
`title - [String]!ESC`  - The Title of the map's Song.  
`creator - [String]!ESC` - The Name of the Mapper.  
`creator_id - [Integer]!WHOLE !VALID` - The ID of the Mapper.  
`star_rating - [Integer]!VALID` - The Difficulty Rating of the maps. (Star Rating)  
`max_score - [Integer]!WHOLE !VALID` - The Maximum Score attainable on the map. (Ranked score, not pp.)  

Example:  
`{"mode": "=2", "approved": "=1", "max_score": ">10000000"}` - Will return all CTB ranked maps that give more than 10 Million Score.  
