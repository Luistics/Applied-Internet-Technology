// hoffy.js
// Luis Olivar


const fs = require('fs');


function sum (...numbers){

    if(numbers.length === 0){
        return 0;
    }

    const ret = numbers.reduce(function(sum, a){
        return sum + a;
    },0);

    return ret;

}

function repeatCall(fn, n, arg){

    fn(arg);
    if(--n){
        repeatCall(fn, n, arg);
    }

}

function repeatCallAllArgs(fn, n, ...args){

    if(args.length === 1){
        repeatCall(fn,n,args[0]);
    }

    fn(...args);
    if(--n){
        repeatCallAllArgs(fn, n, ...args);
    }

}

function makePropertyChecker(prop){

    return function(obj){

        if(obj.hasOwnProperty(prop)){
            return true;
        }
        else{
            return false;
        }

    };
}


function constrainDecorator(fn, min, max){

    return function(){

        if(fn.apply(this, arguments) < min){
            return min;
        }
        else if(fn.apply(this, arguments) > max){
            return max;
        }
        else{
            return fn.apply(this, arguments);
        }

    };
}

function limitCallsDecorator(fn, n){

    let count = 0;

    return function(...args){

        count++;
        if(count > n){
            return undefined;
        }
        else{
            return fn(...args);
        }
    };

}

function mapWith(fn){

    return function(f){
        return Array.prototype.map.call(f, function (current){
            return fn.call(this, current);
        });
    };

}

function simpleINIParse(s){

    const map = {};
    const arrays = s.split("\n");

    arrays.map(function(f){

        if(f.split("=") !== f){

            const elements = f.split("=");

            if(elements[0] !== undefined && elements[1] !== undefined){

                const name = elements[0];
                const value = elements[1];
                map[name] = value;

            }
        }
    });

    return map;

}

function readFileWith(fn){

    return function(fileName, callBack){

        let fileData = {};
        fs.readFile(fileName, 'utf8', function(err, data){

            if(data){

                fileData = fn(data);
                callBack(err, fileData);

            }
            else{
                callBack(err, undefined);
            }


        });
    };
}

module.exports = {

    sum: sum,
    repeatCall: repeatCall,
    repeatCallAllArgs: repeatCallAllArgs,
    makePropertyChecker: makePropertyChecker,
    constrainDecorator: constrainDecorator,
    limitCallsDecorator: limitCallsDecorator,
    mapWith: mapWith,
    simpleINIParse: simpleINIParse,
    readFileWith: readFileWith,

};