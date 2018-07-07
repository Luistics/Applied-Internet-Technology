function main() {

    let url = 'http://localhost:3000/api/reviews';

    handleGetRequest(url);
    handleFilterButton();
    handleAddButton();

}

function handleGetRequest(url){

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function(){

        if(req.status >= 200 && req.status < 400){

            let reviews = JSON.parse(req.responseText);
            let table = document.querySelector("#reviews-table");

            //clean up table from previous requests
            while(table.firstChild){
                table.removeChild(table.firstChild);
            }

            for(let i = 0; i < reviews.length; i++){

                let row = document.createElement('tr');
                row.appendChild(elementWithContent('td', reviews[i]['name']));
                row.appendChild(elementWithContent('td', reviews[i]['semester']));
                row.appendChild(elementWithContent('td', reviews[i]['year']));
                row.appendChild(elementWithContent('td', reviews[i]['review']));
                table.appendChild(row);
            }

        }

    };

    req.send();
}



function handleFilterButton(){

    const filterButton = document.getElementById('filterBtn');
    filterButton.addEventListener('click', function clicked(evt){

        evt.preventDefault();

        const req = new XMLHttpRequest();
        let url = 'http://localhost:3000/api/reviews';


        let query = [];

        if(document.getElementById('filterSemester').value !== ''){
            query.push('semester=' + encodeURIComponent(document.getElementById('filterSemester').value));
        }

        if(document.getElementById('filterYear').value !== ''){
            query.push('year=' + encodeURIComponent(document.getElementById('filterYear').value));
        }

        if(query.length !== 0){
            url += '?' + query.join('&');
        }


        handleGetRequest(url);

    });
}

function handleAddButton() {

    const addButton = document.getElementById('addBtn');
    addButton.addEventListener('click', function(evt){

        evt.preventDefault();
        let url = 'http://localhost:3000/api/review/create';

        const review = [
            'name=' + document.getElementById('name').value,
            'semester=' + document.getElementById('semester').value,
            'year=' + document.getElementById('year').value,
            'review=' + document.getElementById('review').value,
        ];

        const req = new XMLHttpRequest();
        req.open('POST', url, true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        url = 'http://localhost:3000/api/reviews';

        req.onload = function(){
            handleGetRequest(url);
        };
        req.send(review.join('&'));

    });

}

function elementWithContent(tagType, text){

    let tag = document.createElement(tagType);
    tag.appendChild(document.createTextNode(text));
    return tag;
}


document.addEventListener("DOMContentLoaded", main);
