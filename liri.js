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
var bandsInTownCred = keys.bandsInTown.apikey;
var omdbCred = keys.omdb.apikey;

// Assign terminal input variables:
var call = process.argv[2];         //Remnants from old format. Leaving for now to show initial req fulfilled.
var whatCalled = process.argv[3];
var queryURL;

//Create functions for API calls and responses:
function checkSpotify() {
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
            if (data.preview_url === null) {
                console.log(chalk.red("Sadly, a preview of this song isn't available."))
            } else {
                console.log("If you want to listen to " + chalk.yellow(data.name) + " you can hear a sample at: ");
                console.log("     " + chalk.cyan(data.preview_url));
            }
            console.log(chalk.gray("================"));
            console.log("   ");
            console.log("   ");
            console.log("   ");
            runLiri();
        })
        .catch(function (err) {
            console.log(chalk.red("An error occurred. Please check that you have a valid input and try again!"));
            console.log(chalk.gray("The following error occured: " + err));
            console.log("  ");
            console.log("  ");
            console.log("  ");
            runLiri();
        });
};

function checkOMDB() {
    queryURL = "https://www.omdbapi.com/?apikey=" + omdbCred + "&t=" + whatCalled + "&plot=full";

    request(queryURL, function (err, response, body) {
        if ((err) && (response.statusCode !== 200)) {
            console.log("==============An error hit or a status code other than 200 flagged...=============");
            console.log(chalk.red.bold("Error: " + err + "   Status Code: " + response.statusCode + "..."));
            runLiri();
        } else if (JSON.parse(body).length < 40) {
            console.log(chalk.red("Looks like your input didn't give results. That may not be a movie, or you may have a spelling error...Or maybe you gave us no information! Check your inputs and try again..."));
            runLiri();
        } else if (JSON.parse(body).Response === "False") {
            console.log(chalk.red("Looks like your input didn't give results. That may not be a movie, or you may have a spelling error...Or maybe you gave us no information! Check your inputs and try again..."));
            runLiri();
        } else if ((JSON.parse(body).Ratings[0] === undefined) || (JSON.parse(body).Ratings[1] === undefined)) {
            body = JSON.parse(body, null, 2);
            console.log("    ");
            console.log("    ");
            console.log("    ");
            console.log(chalk.gray("================"));
            console.log("The movie you requested is called: '" + chalk.yellow(body.Title) + "', and it came out in " + chalk.green(body.Year) + ".");
            console.log("    ");
            console.log(chalk.red(("Unfortunately, user/critic ratings are not available for this title.")));
            console.log("    ");
            console.log("Country where " + chalk.yellow(body.Title) + " was created: " + chalk.magenta(body.Country) + " The language of the film: " + chalk.magenta(body.Language));
            console.log("    ");
            console.log(chalk.yellow(body.Title) + " features these actors: " + chalk.green(body.Actors));
            console.log("    ");
            console.log(" --->  " + chalk.gray(body.Plot));
            console.log(chalk.gray("================"));
            console.log("    ");
            runLiri();
        } else {
            body = JSON.parse(body, null, 2);
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
            runLiri();
        }
    });
};

function checkBandsInTown() {
    queryURL = "https://rest.bandsintown.com/artists/" + whatCalled + "/events?app_id=" + bandsInTownCred;

    request(queryURL, function (err, response, body) {
        if ((err) || (response.statusCode !== 200)) {
            console.log("==============An error hit or a status code other than 200 flagged...=============");
            console.log(chalk.red.bold("Error: " + err + "   Status Code: " + response.statusCode + "..."));
        } else if (body.length < 25) {
            console.log(chalk.gray("================"));
            console.log(chalk.red("Either that band never existed, or they're no longer touring. Check your input and try again!"));
            console.log(chalk.gray("================"));
        } else if (JSON.parse(body).length === 0) {
            console.log(chalk.gray("================"));
            console.log(chalk.red("Either that band never existed, or they're no longer touring. Check your input and try again!"));
            console.log(chalk.gray("================"));
        } else if (body.length === 18) {
            console.log(chalk.gray("================"));
            console.log(chalk.red("Either that band never existed, or they're no longer touring. Check your input and try again!"));
            console.log(chalk.gray("================"));
        } else {
            var body = JSON.parse(body, null, 2);
            for (var i = 0; i < body.length; i++) {
                data = body[i];
                console.log("  ");
                console.log(chalk.gray("================"));
                console.log(chalk.yellow(whatCalled) + " is playing at: " + chalk.green(data.venue.name) + ", which is located in " + chalk.cyan(data.venue.city) + ", " + chalk.cyan(data.venue.region) + ".");
                console.log("       ----> The concert will be on: " + chalk.magenta(moment(data.datetime).format("dddd, MMMM Do YYYY") + ". ===="));
                console.log(chalk.gray("================"));
                console.log("  ");
            }
        }
        runLiri();
    });
};

function runLiri() {
    inquirer.prompt([
        {
            type: "list",
            message: "\n\n\n\nHello, I am Liri-Bot. Which of these things would you like me to help you with? -->\n\n",
            choices: ["Search for information about a song.", "Look up information about a movie.", "Find out where a band you like is performing!", "Do something random...", "Quit Liri-Bot.   :( "],
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
                    checkSpotify();
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
                    checkOMDB();
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
                    checkBandsInTown();
                }
            });
        }
        else if (user.theChoice === "Do something random...") {

            options = ["Search for information about a song.", "Look up information about a movie.", "Find out where a band you like is performing!", "Do something random..."];

            function randNum() {
                randNum = Math.floor(Math.random() * 3);
            }
            randNum();
            data = options[randNum];
            console.log("\n\nWe've randomly chosen to:   " + chalk.yellow(data) + "\n =========");

            fs.writeFile("./random.txt", data, (err) => {
                if (err) {
                    console.log("Error in fs.writeFile: ", err);
                }
            });

            inquirer.prompt([
                {
                    name: "input",
                    message: "Based on that choice, what should we search for?"
                }
            ]).then(function (request) {
                fs.readFile("./random.txt", "utf8", (err, data) => {
                    whatCalled = request.input;
                    if (err) {
                        console.log(chalk.red.bold("Error: " + err));
                        runLiri();
                    } else if (data === "Search for information about a song.") {
                        checkSpotify();
                    } else if (data === "Look up information about a movie.") {
                        checkOMDB();
                    } else if (data === "Find out where a band you like is performing!") {
                        checkBandsInTown();
                    } else {
                        console.log(chalk.red.bold(("Unrecognized call! Please try again with another command.")));
                    }
                });
            })
        }
        else if (user.theChoice === "Quit Liri-Bot.   :( ") {
            console.log(chalk.white("\n\n\n\n\nWe're "))
            console.log(chalk.red("   sorry"))
            console.log(chalk.yellow("        to"))
            console.log(chalk.green("            see"))
            console.log(chalk.blue("                you"))
            console.log(chalk.cyan("                    go"))
            console.log(chalk.magenta("                        ..."))
            return;
        }
        else {
            return console.log(chalk.red.bold(("Unrecognized call! Please try again with another command.")));
        } //end of catch-all else for lack of call.
    });  // END OF THE THEN FROM INQUIRER
};  //End of runLiri function
runLiri();


//FUTURE ISSUES:  ADDRESS the .THEN issue since it's all async.  -  Add the log file  -   Make the interface prettier   -    

// ADD A LOG


