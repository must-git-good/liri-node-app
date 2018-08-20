//Welcome to LIRI-bot...A simple node app to develop skills calling and utilizing APIs from a terminal interface.


//Keep this first, it fails even if first thing after variable assignment.
require("dotenv").config();

// Set npm requirement references:
var fs = require("fs");
var inquirer = require("inquirer");
var chalk = require("chalk");
var moment = require("moment");
var request = require("request");
var dotenv = require("dotenv");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
//////

// Reference hidden keys for safe API access:
var spotifyId = keys.spotify.id;
var spotifySecret = keys.spotify.secret;


// Assign terminal input variables:
var call = process.argv[2];
var whatCalled = process.argv[3];
var queryURL;
///OBFUSCATE THIS API KEY AS WELL, AS PER JAMES REQUEST:




inquirer.prompt([
    {
        type: "list",
        message: "Hello, I am Liri-Bot. Which of these things would you like me to help you with? -->",
        choices: ["Search for information about a song.", "Look up information about a movie.", "Find out where a band you like is performing!", "Do something random..."],
        name: "theChoice"
    }
]).then(function (user) {
    if (user.theChoice === "Search for information about a song.") {
        inquirer.prompt([
            {
                type: "input",
                message: "What song would you like to know about?",
                name: "name"
            }
        ]).then(function (picked) {
            if (picked) {
                whatCalled = picked.name;
               
                    spotify = new Spotify({
                        id: spotifyId,
                        secret: spotifySecret
                    });

                    spotify
                        .search({ type: 'track', query: whatCalled })
                        .then(function (response) {
                            var data = response.tracks.items[0]
                            console.log("   ");
                            console.log("   ");
                            console.log("   ");
                            console.log(chalk.gray("================"));
                            console.log("-----> The song you requested is performed by: " + chalk.green(data.artists[0].name) + " and can be found on the '" + chalk.magenta(data.album.name) + "' album.");
                            console.log("   ");
                            console.log("If you want to listen to " + chalk.yellow(data.name) + " you can hear a sample at: ");
                            console.log("     " + chalk.cyan(data.preview_url));
                            console.log(chalk.gray("================"));
                            console.log("   ");
                            console.log("   ");
                            console.log("   ");
                        })
                        .catch(function (err) {
                            return console.log(err);
                        });
              
            }
        });
    }
    else if (user.theChoice === "Look up information about a movie.") {
        inquirer.prompt([
            {
                type: "input",
                message: "What movie would you like to know about?",
                name: "name"
            }
        ]).then(function (picked) {
            if (picked) {
                whatCalled = picked.name;
    
                    var apiKey = "trilogy";
                    queryURL = "https://www.omdbapi.com/?apikey=" + apiKey + "&t=" + whatCalled + "&plot=full";

                    request(queryURL, function (err, response, body) {
                        if ((err) && (response.statusCode !== 200)) {
                            console.log("==============An error hit or a status code other than 200 flagged...=============");
                            return console.log(chalk.red.bold("Error: " + err + "   Status Code: " + response.statusCode + "..."));
                        } else {
                            var body = JSON.parse(body, null, 2);

                            console.log("    ");
                            console.log("    ");
                            console.log("    ");
                            console.log(chalk.gray("================"));
                            console.log("The movie you requested is called: '" + chalk.yellow(body.Title) + "', and it came out in " + chalk.green(body.Year) + ".");
                            console.log("    ");
                            console.log("IMDB users rate it at: " + chalk.cyan(body.Ratings[0].Value) + ", and Rotten Tomatoes critics give it a: " + chalk.cyan(body.Ratings[1].Value) + ".");
                            console.log("    ");
                            console.log("Country where " + chalk.yellow(body.Title) + " was created: " + chalk.magenta(body.Country) + " The language of the film: " + chalk.magenta(body.Language));
                            console.log("    ");
                            console.log(chalk.yellow(body.Title) + " features these actors: " + chalk.green(body.Actors));
                            console.log("    ");
                            console.log(" --->  " + chalk.gray(body.Plot));
                            console.log(chalk.gray("================"));
                            console.log("    ");
                            console.log("    ");
                            console.log("    ");
                        }
                    });
            }
        });
    }
    else if (user.theChoice === "Find out where a band you like is performing!") {
        inquirer.prompt([
            {
                type: "input",
                message: "What band are you hoping to see live?",
                name: "name"
            }
        ]).then(function (picked) {
            if (picked) {
                whatCalled = picked.name;

                queryURL = "https://rest.bandsintown.com/artists/" + whatCalled + "/events?app_id=codingbootcamp";

                request(queryURL, function (err, response, body) {
                    if ((err) && (response.statusCode !== 200)) {
                        console.log("==============An error hit or a status code other than 200 flagged...=============");
                        return console.log(chalk.red.bold("Error: " + err + "   Status Code: " + response.statusCode + "..."));
                    } else {
                        var body = JSON.parse(body, null, 2);
                        for (var i = 0; i < body.length; i++) {
                            var data = body[i];
                            console.log("  ");
                            console.log(chalk.gray("================"));
                            console.log(chalk.yellow(whatCalled) + " is playing at: " + chalk.green(data.venue.name) + ", which is located in " + chalk.cyan(data.venue.city) + ", " + chalk.cyan(data.venue.region) + ".");
                            console.log("       ----> The concert will be on: " + chalk.magenta(data.datetime + ". ===="));    //USE MOMENT TO MAKE THIS READABLE LATER.
                            console.log(chalk.gray("================"));
                            console.log("  ");
                        }
                    }
                });
            }
        });
    }

    else if (user.theChoice === "Do something random...") {
        fs.readFile("./random.txt", "utf8", (err, data) => {
            if (err) {
                return console.log(chalk.red.bold("Error: " + err));
            } else {
                console.log(data);
            }
        });
    }









    //NOT NEEDED NOW THAT FORMAT IS CHANGING?
    // else {
    //     return console.log(chalk.red.bold(("Unrecognized call! Please try again with another command.")));
    // } //end of catch-all else for lack of call.



});  // END OF THE THEN FROM INQUIRER
//FUTURE ISSUES:  ADDRESS the .THEN issue since it's all async.  -  Add the log file  -   Make the interface prettier   -    



