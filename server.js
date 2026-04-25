const http = require('http');
const fs = require('fs');
const path=require('path');

const dataFilePath=path.join(__dirname, 'data.json');

function readMoviesFromFile(){
    try{
        const data = fs.readFileSync(dataFilePath, 'utf8');
        const parsed= JSON.parse(data);
        return parsed.movies || [];
    }
    catch(error){
        console.error('Error reading file:', error);
        return [];
    }
}