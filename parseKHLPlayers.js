const remote = require('@electron/remote');
const dialog = remote.dialog;
let isPackaged = remote.app.isPackaged;
const Store = require('./store.js');


const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        matchIDKey: "",
        savePathKey: "G:/DB/KHLParser/parseKHL.json",
        updateIntervalKey: "5",
    }
});



let fPath = null;
let lastFPath = store.get("savePathKey");
let isUpdated = false;
let matchID = null;
let updateInterval = null;

// const select =  document.getElementById("period");
// let period = "2";
// select.addEventListener('change', function(e) {
//     period = select.options[select.selectedIndex].value.toString();
//     document.getElementById("updatedTime").innerHTML = select.options[select.selectedIndex].value;
// });


let saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", function () {
    shDialog();
});

function shDialog() {
    let options = {
        properties: ['openFile'],
        title: "Open file",
        defaultPath: "",
        buttonLabel: "Open",
        filters: [
            { name: 'json', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    };
    dialog.showOpenDialog(options).then(function (response) {
        if (!response.canceled) {
            // handle fully qualified file name
            fPath = response.filePaths[0];
            let sP = document.getElementById('savePath');
            let mID = document.getElementById("matchID");
            if (response.canceled) {
                sP.innerText = lastFPath;
                mID.value = lastFPath.replace(/^.*[\\\/]/, '').split('.')[0];
                store.set("savePathKey", lastFPath);
                store.set("matchIDKey", mID.value);
            }
            else {
                sP.innerText = fPath;
                mID.value = fPath.replace(/^.*[\\\/]/, '').split('.')[0];
                lastFPath = fPath;
                store.set("savePathKey", fPath);
                store.set("matchIDKey", mID.value);

            }
            console.log(response.filePaths[0].replace(/^.*[\\\/]/, '').split('.')[0]);
        } else {
            console.log("no file selected");
        }
    });
};

function parseFile() {
    let fs = require('fs');
    let obj = JSON.parse(fs.readFileSync(fPath, 'utf8'));

    for (let player in obj.players.A) {
        data.homeMapping[player] = obj.players.A[player].id;
    }

    for (let player in obj.players.B) {
        data.guestMapping[player] = obj.players.B[player].id;
    }
}

let updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", function () {
    let sP = document.getElementById('savePath');
    fPath = sP.innerText;
    matchID = document.getElementById("matchID").value;
    updateInterval = document.getElementById("updateInterval").value;

    parseFile();

    if (!isUpdated && fPath !== undefined && matchID !== "") {
        isUpdated = true;
        if (matchID !== null) {
            updateData();
        }
        updateButton.innerText = 'Stop update';
        saveButton.disabled = true;
    }
    else {
        updateButton.innerText = 'Start update';
        isUpdated = false;
        if (matchID !== null) {
            updateData();
        }
        saveButton.disabled = false;
    }
});


const http = require('http')
const port = 80

const puppeteer = require('puppeteer');

const data = {
    value: null,
    homeMapping: {
        // "number": "id"
        // "23": "1"
    },
    guestMapping: {
        // "number": "id"
        // "24": "2"
    }
}


console.log(data);

function myFunc() {
    return new Promise((res, rej) => {
        setTimeout(() => {

            let scrape = async () => {

                let options;
                if (isPackaged) {
                    options = { 
                        executablePath: __dirname + ".unpacked\\node_modules\\puppeteer\\.local-chromium\\win64-901912\\chrome-win\\chrome.exe",
                        args: ['--proxy-server="direct://"', '--proxy-bypass-list=*'],
                    }
                }
                else options = {args: ['--proxy-server="direct://"', '--proxy-bypass-list=*']};
                const browser = await puppeteer.launch(options);
                //const browser = await puppeteer.launch({headless: false});
                const page = await browser.newPage();

                await page.goto(`https://text.khl.ru/en/${matchID}.html`);

                const result = await page.evaluate(() => {

                    const playersATable = document.querySelector("#tab-statsA-part0 > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody");
                    //const playersBTable = document.querySelector(`#DataTables_Table_${period} > tbody`);
                    const playersBTable = document.querySelector("#tab-statsB-part0 > div > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > table > tbody");
                    const teamA = [];
                    const teamB = [];
                    const playersObj = [teamA, teamB];

                    for (let i = 1; i < playersATable.rows.length + 1; i++) {
                        let playerNumber = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(1)`).innerHTML;
                        let playerName = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(2) > div`).innerHTML;
                        let playerG = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(3)`).innerHTML;
                        let playerA = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(4)`).innerHTML;
                        let playerPTS = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(5)`).innerHTML;
                        let playerSOG = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(6)`).innerHTML;
                        let playerPIM = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(7)`).innerHTML;
                        let playerFO = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(8)`).innerHTML;
                        let playerFOW = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(9)`).innerHTML;
                        let playerFOWPCT = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(10)`).innerHTML;
                        let playerBLS = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(11)`).innerHTML;
                        let playerHITS = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(12)`).innerHTML;
                        let playerFOA = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(13)`).innerHTML;
                        let playerTOI = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(14)`).innerHTML;
                        let playerTOA = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(15)`).innerHTML;
                        let playerMS = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(16)`).innerHTML;
                        let playerDT = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(17)`).innerHTML;
                        let playerCpC = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(18)`).innerHTML;
                        let playerPCD = playersATable.querySelector(`tr:nth-child(${i}) > td:nth-child(19)`).innerHTML;
                        playersObj[0].push({
                            playerNumber,
                            playerName,
                            playerG,
                            playerA,
                            playerPTS,
                            playerSOG,
                            playerPIM,
                            playerFO,
                            playerFOW,
                            playerFOWPCT,
                            playerBLS,
                            playerHITS,
                            playerFOA,
                            playerTOI,
                            playerTOA,
                            playerMS,
                            playerDT,
                            playerCpC,
                            playerPCD
                        });
                    }


                    for (let i = 1; i < playersBTable.rows.length + 1; i++) {
                        let playerNumber = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(1)`).innerHTML;
                        let playerName = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(2) > div`).innerHTML;
                        let playerG = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(3)`).innerHTML;
                        let playerA = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(4)`).innerHTML;
                        let playerPTS = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(5)`).innerHTML;
                        let playerSOG = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(6)`).innerHTML;
                        let playerPIM = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(7)`).innerHTML;
                        let playerFO = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(8)`).innerHTML;
                        let playerFOW = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(9)`).innerHTML;
                        let playerFOWPCT = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(10)`).innerHTML;
                        let playerBLS = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(11)`).innerHTML;
                        let playerHITS = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(12)`).innerHTML;
                        let playerFOA = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(13)`).innerHTML;
                        let playerTOI = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(14)`).innerHTML;
                        let playerTOA = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(15)`).innerHTML;
                        let playerMS = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(16)`).innerHTML;
                        let playerDT = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(17)`).innerHTML;
                        let playerCpC = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(18)`).innerHTML;
                        let playerPCD = playersBTable.querySelector(`tr:nth-child(${i}) > td:nth-child(19)`).innerHTML;
                        playersObj[1].push({
                            playerNumber,
                            playerName,
                            playerG,
                            playerA,
                            playerPTS,
                            playerSOG,
                            playerPIM,
                            playerFO,
                            playerFOW,
                            playerFOWPCT,
                            playerBLS,
                            playerHITS,
                            playerFOA,
                            playerTOI,
                            playerTOA,
                            playerMS,
                            playerDT,
                            playerCpC,
                            playerPCD
                        });
                    }

                    return playersObj;


                });

                browser.close();
                return result;
            };


            scrape().then((value) => {
                data.value = value;
                createLogTable(value);
            });
            res()
        }, updateInterval * 1000)
    })
}

function createLogTable(value) {

    document.getElementById('updatedTime').innerHTML = new Date().toTimeString();

    let tableA = document.getElementById("logTableA");
    tableA.removeChild(tableA.getElementsByTagName("tbody")[0]);

    let tbodyA = document.createElement("tbody");

    for (let j = 0; j < value[0].length; j++) {
        let tr = document.createElement("tr");
        for (obj in value[0][j]) {
            let td = document.createElement("td");
            td.innerHTML = value[0][j][obj];
            tr.appendChild(td);
        }
        tbodyA.appendChild(tr);
    }
    tableA.appendChild(tbodyA);

    let tableB = document.getElementById("logTableB");
    tableB.removeChild(tableB.getElementsByTagName("tbody")[0]);

    let tbodyB = document.createElement("tbody");

    for (let j = 0; j < value[1].length; j++) {
        let tr = document.createElement("tr");
        for (obj in value[1][j]) {
            let td = document.createElement("td");
            td.innerHTML = value[1][j][obj];
            tr.appendChild(td);
        }
        tbodyB.appendChild(tr);
    }
    tableB.appendChild(tbodyB);

}

function mapStats(array, mapping) {
    return array.map(player => {
        const id = mapping[player.playerNumber];
        if (!id) {
            return null;
        }
        return {
            player: {
                id: id,
                jersey: player.playerNumber,
                lastName: player.playerName.split(" (")[0]
            },
            totalStatistics: {
                topSpeed: 0,
                timeOnIce: getTimeOnIce(player.playerTOI),
                distanceTravelled: 0,
                averageSpeedWithPuck: 0
            },
            totalPuckContestStatistics: {
                puckContestsWon: player.playerFOW,
                puckContestsLost: (player.playerFO - player.playerFOW).toString(),
                puckContestParticipations: player.playerFO
            },
            goalieStatistics: {
                saves: 0
            }
        }
    })
        .filter(value => !!value);
}

const requestHandler = (request, response) => {
    console.log(request.url)
    if (request.url === '/v3/seasons') {
        response.end(JSON.stringify({
            seasons: [
                {
                    id: '0',
                    name: 'Name'
                }
            ]
        }))
    } else if (request.url.startsWith('/v3/seasons/0/matches?')) {
        response.end(JSON.stringify({
            matches: [
                {
                    id: matchID.toString(),
                    date: new Date().toJSON(),
                    homeTeam: {
                        id: 1,
                        fullName: 'Home teame',
                        shortName: 'home'
                    },
                    awayTeam: {
                        id: 1,
                        fullName: 'Away teame',
                        shortName: 'away'
                    }
                }
            ]
        }))
    } else if (request.url === `/v3/seasons/0/matches/${matchID}/stats` && data.value) {
        response.end(JSON.stringify({
            homeTeamStatistics: mapStats(data.value[0], data.homeMapping),
            awayTeamStatistics: mapStats(data.value[1], data.guestMapping)
        }))
    } else {
        response.end('Hello Node.js Server!')
    }
}
const server = http.createServer(requestHandler)
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});

function getTimeOnIce(timeOnIceString) {
    const endTime = timeOnIceString.indexOf('(')
    let subTime = timeOnIceString.substr(0, endTime);
    if (subTime.length < 5) {
        subTime = '0' + subTime;
    }
    const date = Date.parse(`1970-01-01T00:${subTime}.000Z`)
    return date / 1000;
}

function updateData() {

    (async () => {
        while (isUpdated) await myFunc()
    })()
}

