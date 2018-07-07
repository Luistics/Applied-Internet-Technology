//report.js
// Luis Olivar

const fs = require('fs');
const rev = require('./bnbfunc.js');
const request = require('request');

/*
    Reading from a local file

fs.readFile('/home/luistics/Desktop/AITHome/FolderOutside/combined-airbnb-data.json', 'utf8', function(err, data){

    if(data){

        const fullData = data.toString();
        const array = new Array();
        let o = {};
        fullData.trim();

        for(let i = 0; i < fullData.length; i++){

            if(fullData.charAt(i) === "{"){

                let temp = "";

                while(fullData.charAt(i) != "\n" && i < fullData.length){

                    temp += fullData.charAt(i);
                    i++;
                }

                o = JSON.parse(temp);
                array.push(o);

            }
        }

        console.log(rev.processAirBnbData(array));


    }else{
        console.log("Error with file");
    }

});

*/

function readBnbData(url){

    request(url, function(err, response, body){

        if((!err) && response.statusCode == 200){

            const fullData = body.toString();
            const array = new Array();
            let o = {};
            fullData.trim();

            for(let i = 0; i < fullData.length; i++){

                if(fullData.charAt(i) === "{"){

                    let temp = "";

                    while(fullData.charAt(i) != "\n" && i < fullData.length){

                        temp += fullData.charAt(i);
                        i++;
                    }

                    o = JSON.parse(temp);
                    if(o.next_file){

                        let nextURL = 'http://jvers.com/csci-ua.0480-spring2018-008/homework/02/airbnb/' + o.next_file;
                        readBnbData(nextURL);
                    }
                    else {
                        array.push(o);
                    }

                }
            }

            console.log("URL: " + url);
            console.log("===================================");
            console.log(rev.processAirBnbData(array));


        }

    });
}

readBnbData('http://jvers.com/csci-ua.0480-spring2018-008/homework/02/airbnb/1a9c766e75e3ff17009936fc570fb8e1.json');