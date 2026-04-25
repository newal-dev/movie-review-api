const http = require('http');
const fs = require('fs');
const path=require('path');

const dataFilePath=path.join(__dirname, 'data.json');
//R
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

//C
function writeMoviesformFile(movies){
    try{
        const data = JSON.stringify({movies: movies}, null 2);
        fs.writeFileSync(dataFilePath,data, 'utf8');
        return true;
    }
    catch{
        console.error("Error wrting file:", error);
        return false;
    }
}