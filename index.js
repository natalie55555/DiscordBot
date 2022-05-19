const Discord = require("discord.js")
const search = require("./commands/search")
const wordle = require("./commands/wordle")
const member_counter = require("./counters/member_counter")
const client = new Discord.Client({
    intents: 32767
})
const prefix = "-"
const memberCount = require('./counters/member_counter')

// allows .env variable to be loaded into global variable that can be accessed anywhere in the code process.env
require("dotenv").config() 

//Wordle State Object
let wordleState = {
    currentGame: false,
    numGuess: 0,
    wordleWord: "",
    letters: []
}
wordleState.letters.length = 26

client.once("ready", () => {
    console.log(`Bot now online in ${client.guilds.cache.size} servers.`)
    member_counter(client)
})

client.on("messageCreate", (message) => { 
    if (message.author.bot) return;
 
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const firstArg = args.shift()
    if (!firstArg) {
        return;
    }
    const command = firstArg.toLowerCase()

    if (command === 'hello') {
        message.reply("Hi")
    }

    if (command === 'search') {
        search.execute(message, args.join(' '))
    }

    if (command === 'ping') {
        message.reply("Pong")
    }

    if (command === 'wordle'){
        wordle.execute(message, args[0].toLowerCase(), wordleState)
    }

    if(command === 'test') {
        test.execute(message, args)
    }
})

client.login(process.env.discord_token)
