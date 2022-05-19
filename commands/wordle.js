const MessageEmbed = require("discord.js/src/structures/MessageEmbed")
const randomWords = require('random-words')
const { blueLetters } = require('../wordle_letter_emojis')
//add win streak 
//add dictionary to check if guesses are valid words

module.exports = {
    name: "wordle",
    permissions: [],
    devOnly: false,
    async execute(message, guess, wordleState) {
        let current_board = ""
        let counter = 0
        let winner = false

        //Checks if there is a current wordle game running - if there is no current game, a new 5 letter Wordle word will generate
        if (wordleState.currentGame === false) {
            for(let j = 0; j < 26; j++) {
                wordleState.letters[j] = blueLetters[String.fromCharCode('a'.charCodeAt(0)+j)]
            }
            wordleState.wordleWord = randomWords({exactly: 1, maxLength: 5})[0]
            wordleState.currentGame = true
            wordleState.numGuess = 0
            while (wordleState.wordleWord.length != 5){
                wordleState.wordleWord = randomWords({exactly: 1, maxLength: 5})[0]
            }
        }

        //track the Wordle word in the comsole
        console.log(wordleState.wordleWord)

        currentGame = true
        if(guess.length === 5 && winner === false) {
            for(let i = 0; i < guess.length; i++) {
                let colour = ':white_large_square: '
                for(let k = 0; k < wordleState.wordleWord.length; k++) {
                    if(guess.charAt(i) === wordleState.wordleWord.charAt(k)) {
                        if(i === k) {
                            colour = ':green_square: '
                            counter++
                            break
                        }
                        else {
                            colour = ":yellow_square: "
                        }
                    }
                }
                if(colour === ':white_large_square: ') {
                    wordleState.letters[guess.charCodeAt(i)-'a'.charCodeAt(0)] = ':white_large_square:'
                }
                current_board += colour
            }
            
            wordleState.numGuess ++
            const wordleGuess = new MessageEmbed()
            .setTitle('Wordle Guess ' + wordleState.numGuess + ' /6')
            .setColor('#3DA5D9')
            .addField('Guess', current_board + "   \n**" + guess + "**", true)
            .addField('Letters', wordleState.letters.join(' '), true)
            message.channel.send({ embeds: [wordleGuess] })
            console.log(wordleState.letters.join(''))
            console.log(wordleState.letters)

            if(counter === 5){
                //building embedded message for when user wins
                const winnerMessage = new MessageEmbed()
                .setTitle('Wordle')
                .setColor('#3DA5D9')
                .addField('Game Over!', 'Congratulations, you guessed the word in ' + wordleState.numGuess + ' guesses!', true)

                message.channel.send({ embeds: [winnerMessage]})
                winner = true
                wordleState.currentGame = false
            }
            else if(wordleState.numGuess === 6) {
                //building embedded message for when user loses
                const loserMessage = new MessageEmbed()
                .setTitle('Wordle')
                .setColor('#9F2042')
                .addField('Game Over!', 'You lose, the word was **' + wordleState.wordleWord + '**', true)

                message.channel.send({ embeds: [loserMessage]})
                wordleState.currentGame = false
                wordleState.numGuess = 0
                winner = false
            }
        }
        else {
            message.reply("Please enter a 5-letter word.")
        }
    }
}
