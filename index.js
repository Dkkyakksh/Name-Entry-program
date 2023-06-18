document.addEventListener('DOMContentLoaded', ()=>{
    fetch("http://localhost:5000/getALL")
    .then(response => response.json())
    //response.json will parse the data
    //this returns a new promise that resolves to the parsed json data
    //data is an object
    //in order to access the array we need to get the data key
    .then(data => loadHTMLtable(data['data']));
    //the parsed data is passed to above function as data to be put in table
});

document.querySelector('table tbody').addEventListener('click',function(event){
    if(event.target.className == "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className == "edit-row-btn"){
        handleEditRow(event.target.dataset.id);
    }
});

const addBtn = document.querySelector('#add-btn');
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function(){
    const searchValue = document.querySelector('#search-input').value;

    fetch("http://localhost:5000/search/" + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLtable(data['data']));
} 

function deleteRowById(id){
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success){
            location.reload();
        }
    });
}
function handleEditRow(id){
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    let updateNameInput = document.querySelector('#update-name-input');
    updateNameInput.dataset.id = id;
}
updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input');
    fetch('http://localhost:5000/update/',{
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    })

} 

addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response=>response.json())
    .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data){
    // console.log(data); //--->this getting passed is an object
    //                          therefore we cannot use an forEach function
    const table = document.querySelector('table tbody');
    //checking if no-data class exists
    const isTableData = table.querySelector('.no-data');
    
    let tableHTML = "<tr>"

    for(var key in data){
        if(data.hasOwnProperty(key)){
            if(key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHTML += `<td>${data[key]}</td>`;
        }
    }
    tableHTML += `<td><button class="delete-row-btn" data-id=${data.id}>DELETE</td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${data.id}>EDIT</td>`;
    //we cannot use forEach function here therefor we use 'for in' loop
    tableHTML +="</tr>";

    if(isTableData){
        table.innerHTML = tableHTML;
        
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHTML;
    }
    
}

function loadHTMLtable(data){
    const table = document.querySelector('table tbody')
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan=5>No data</td></tr>";
        return;
    }
    let tableHTML = "";
    table.innerHTML = tableHTML;
    

    data.forEach(function({id, Name, date_added}){
        tableHTML += "<tr>";
        tableHTML += `<td>${id}</td>`;
        tableHTML += `<td>${Name}</td>`;
        tableHTML += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHTML += `<td><button class="delete-row-btn" data-id=${id}>DELETE</td>`;
        tableHTML += `<td><button class="edit-row-btn" data-id=${id}>EDIT</td>`;
        tableHTML += "</tr>";
    });

    table.innerHTML = tableHTML;


}