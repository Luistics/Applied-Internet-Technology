// bnbfunc.js
//Luis Olivar

const fs = require('fs');


function processAirBnbData(listings){

    let report = "";

    //Average Rating and Price
    const copy = listings.slice(0);
    let ratingSum = 0;
    let priceSum = 0;

    copy.forEach(function(object){

        let rating = parseFloat(object.overall_satisfaction);
        ratingSum += rating;
        let price = parseFloat(object.price);
        priceSum += price;
    });

    const averageRating = parseFloat(ratingSum / listings.length).toFixed(2);
    const averagePrice = parseFloat(priceSum / listings.length).toFixed(2);

    report += "* Average rating of the current dataset is: " + averageRating + "\n";
    report += "* Average price of the current dataset is: " + averagePrice + "\n";


    //Listings with rating greater than 4.8, priced less than 55, accommodates > 6
    const filtered = copy.filter(function(object){

        const rating = parseFloat(object.overall_satisfaction).toFixed(2);
        const price = parseFloat(object.price).toFixed(2);
        const accommodation = parseFloat(object.accommodates);

        if(rating > 4.8 && price < 55 && accommodation > 6){
            return object;
        }
    });

    report += "* All listings in the current dataset with a rating greater than 4.8, priced less than 55, and accommodating more than 6 people: \n";

    filtered.forEach(function(object){

        report += "    * Listing ID: " + object.room_id + " with a rating of ";
        report += parseFloat(object.overall_satisfaction).toFixed(1) + " priced at " + parseFloat(object.price).toFixed(1);
        report += " in " + object.city + " accommodates " + object.accommodates + "\n";

    });

    //The two highest reviewed listings

    const mapped = copy.map(function(object, i){

        return {index: i, value: parseFloat(object.reviews)};
    });

    mapped.sort(function(a,b){

        if(a.value > b.value){
            return 1;
        }

        if(a.value < b.value){
            return -1;
        }

        return 0;
    });

    const result = mapped.map(function(object){
        return copy[object.index];
    });

    const highest = result[result.length - 1];
    const secondHighest = result[result.length - 2];

    report += "\n* The two highest reviewed listings of the current dataset are: \n";
    report += "    *ID: " + highest.room_id + " in " + highest.city + " reviewed " + highest.reviews + " times and rated " + highest.overall_satisfaction + "\n";
    report += "    *ID: " + secondHighest.room_id + " in " + secondHighest.city + " reviewed " + secondHighest.reviews + " times and rated " + secondHighest.overall_satisfaction + "\n";


    //Expensive listings in NYC
    //plan: filter array => city == nyc. if filtered.length == 0, report
    //

    const nycListings = copy.filter(function(object){

        if(object.city === "New York"){
            return object;
        }

    });

    if(nycListings.length === 0){
        report += "\n * This file has no data about NYC!\n\n";
    }
    else{

        function borough(name){
            return function(object){
                return object.borough === name;
            }
        }

        const bronxArray = copy.filter(borough("Bronx"));
        const manhattanArray = copy.filter(borough("Manhattan"));
        const brooklynArray = copy.filter(borough("Brooklyn"));
        const statenArray = copy.filter(borough("Staten Island"));
        const queensArray = copy.filter(borough("Queens"));


        //I could have boiled this down like above but running out of time

        const statenSum = statenArray.map(function(object){
            return parseFloat(object.price);
        }).reduce(function(p,c){
            return p + c;
        });

        const bronxSum = bronxArray.map(function(object){
            return parseFloat(object.price);
        }).reduce(function(p,c){
            return p + c;
        });

        const brooklynSum = brooklynArray.map(function(listing){
            return parseFloat(listing.price);
        }).reduce(function(p,c){
            return p + c;
        });

        const manhattanSum = manhattanArray.map(function(listing){
            return parseFloat(listing.price);
        }).reduce(function(p,c){
            return p + c;
        });

        const queensSum = queensArray.map(function(listing){
            return parseFloat(listing.price);
        }).reduce(function(p,c){
            return p + c;
        });

        const statenAggregate = statenSum / statenArray.length;
        const bronxAggregate = bronxSum / bronxArray.length;
        const brooklynAggregate = brooklynSum / brooklynArray.length;
        const manhattanAggregate = manhattanSum / manhattanArray.length;
        const queensAggregate = queensSum / queensArray.length;

        const tempArray = new Array();
        tempArray.push(statenAggregate,bronxAggregate,brooklynAggregate,manhattanAggregate,queensAggregate);

        let max = 0;

        for(let i = 0; i < tempArray.length; i++){

            max = Math.max(tempArray[i], max);
        }

        let output = "";

        if(max === statenAggregate){
            output += "Staten Island";
        }
        else if(max === brooklynAggregate){
            output += "Brooklyn";
        }
        else if(max === bronxAggregate){
            output += "Bronx";
        }
        else if(max === queensAggregate){
            output += "Queens";
        }
        else if(max === manhattanAggregate){
            output += "Manhattan";
        }

        report += "\n* For the current dataset, " + output + " has the most expensive listings in NYC with an average listing price of " + max + "\n\n";


    }


    return report;

}

module.exports = {

    processAirBnbData: processAirBnbData
};