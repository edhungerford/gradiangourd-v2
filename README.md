# gradiangourd
A Discord bot powered by [gradia-api-v2](https://github.com/edhungerford/gradia-api-v2).

## What is this?
This is one part of a project I started in February of 2022. (Please refer to [gradia-lib-v2](https://github.com/edhungerford/gradia-lib-v2) and [gradia-api-v2](https://github.com/edhungerford/gradia-api-v2) for more context.) I wanted a way to pull the data from my API into Discord easily, so I built this. It also has a few other fun features, like a rudimentary dice roller.

Up until 2026, this project was in its own private repository. Since it represents the bulk of my work with REST APIs and Discord bots, I wanted to make that repository public so I could demonstrate the years of work I put into this. Unfortunately, the commit history for that repository contains some private information I can't readily share, so I moved the files to a new repository that will be their home going forward. If you should desire proof that this has indeed been a project years in the making, consider that [gradia-lib-v2](https://github.com/edhungerford/gradia-lib-v2) was built with `create-react-app` before it was sunset, or that the character portraits on [the Gradia wiki](https://tails.gradia.wiki) are colored with colored pencil and crudely scanned from my phone, which hasn't been my preferred artistic process for years. (This is really convincing evidence if you know me.)

By the way, the Gradian Gourd was the name of a quasi-sentient mecha in the second D&D campaign I ran called *Tails of Gradia*.

## How do I use it?
To get the Gradian Gourd into your server, you could just add it using [this link](https://discord.com/oauth2/authorize?client_id=1038911062080229407).

If you want to *add* to the Gourd's functionality for whatever peculiar reason...good luck? There's some stuff that's hardcoded in here that probably doesn't need to be, so you'll have to work with that. You'll also need a .env file with three variables:
```
DISCORD_TOKEN
CLIENT_ID
FETCH_BASE
```
`DISCORD_TOKEN` and `CLIENT_ID` belong to your Discord bot. `FETCH_BASE` is the path to the highest level of your REST API. (In my case, it's `https://tails.gradia.wiki/api`, of course.)

Also, `deploy-commands.js` might need `SERVER_ID` and `RILEY_ID` to function, even though I don't think it's actually used by the bot outside of that. My advice is to read the code and figure out how you can remove it. I'll be doing the same eventually. 

All in all, I don't recommend doing anything beyond just adding the Gourd to your server, because it's simply not designed for generic use (yet...?). 

### Commands
The Gourd has four commands.

#### /character [name] [game]
Fetches a character by name. The `name` parameter is a string used for a case-insensitive search where any matching string starting from the beginning of the name may be used, but the search will return only the first match (sorted by its index in the API, which is not necesarily alphabetical). In other words, Arbiter Graves can be found this way:

> */character name:arbi game:South of Snaplands*

but she will not be found this way:

> */character name:a game:South of Snaplands*

because the Gourd will instead return Aster Kyriogon, who comes second alphabetically but first by index. 

The `game` parameter is a hard-coded list of games corresponding to campaigns with databases following the specifications listed at [gradia-api-v2](https://github.com/edhungerford/gradia-api-v2).

#### /contest [question] [name_one] [name_two] [game]
Creates a poll comparing two characters from the same game. The `question` parameter is a string that will become the subject of the poll, e.g., "Who wore it better?" `name_one` and `name_two` are strings used for case-insensitive searches along the same lines as the `name` parameter in the `/character` command. Similarly, the `game` parameter is a hard-coded list of games matching the options from `/character`'s `game` parameter.

#### /list [type] [game]
Lists either characters (by affiliation) or session titles (in the order they happened). The `type` parameter is a hard-coded list (either "Characters" or "Sessions") determining the type of output. The `game` parameter works like you think it does. 

#### /recap [game] [title]
Displays the most recent session recap for a given game when no `title` parameter is specified, or displays the first session matching the `title` parameter when supplied. The `game` parameter works like you think it does. The optional `title` parameter is a string used for a case-insensitive search where any matching string starting from the beginning of the name may be used, but the search will return only the first match (sorted by its index in the API, which is not necessarily alphabetical, but is usually chronological).

#### /roll [number] [sides] [modifier]
A dice-rolling function. The `number` parameter represents the number of dice to roll, the `sides` parameter represents the number of sides on each die, and the optional `modifier` parameter represents a number to add or subtract from the result of the roll. For instance:

> */roll number:1 sides:20 modifier:2*

would roll one twenty-sided die and add 2. In role-playing game terms, this would be represented as 1d20+2.

> */roll number:2 sides:6*

would roll two six-sided dice. In role-playing game terms, this would be represented as 2d6.