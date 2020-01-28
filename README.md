# Gnomesweeper Bot
Hello! I'm a bot that can generate a random Gnomesweeper games using the discord spoiler tags, for anyone to play! Use the command `!gnomesweeper` or `!gs` to generate a game.

## The Gnomesweeper Command
The `!gnomesweeper` command works like this:
```
!gnomesweeper [<gameWidth> <gameHeight> [<numGnomes>]]
```
* `gameWidth` is the amount of squares the game is wide, must be an integer from 1 to 40. If omitted, it'll be 8.
* `gameHeight` is the amount of squares the game is high, must be an integer from 1 to 20. If omitted, it'll be 8.
* `numGnomes` (optional) is the amount of gnomes that will be in the game. If omitted, I will choose by myself how many gnomes there should be depending on the size of the game.
When you run this command, I will reply with a grid of spoiler tags. Click a spoiler tag to open the square and see if there's a gnome inside!

## Other Commands
Here's the other commands I listen to:
* `!gs` — alias of `!gnomesweeper`.
* `!help` — shows this list of commands.
* `!info` — displays info about me.
* `!howtoplay` — displays a tutorial about how to play the game.
* `!ping` — displays the heartbeat ping of the bot.