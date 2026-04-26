const http = require('http');
const fs = require('fs');
const path=require('path');

const dataFilePath=path.join(__dirname, 'data.json');
//Read
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

//Create
function writeMoviesToFile(movies){
    try{
        const data = JSON.stringify({movies: movies}, null, 2);
        fs.writeFileSync(dataFilePath,data, 'utf8');
        return true;
    }
    catch(error){
        console.error("Error writing file:", error);
        return false;
    }
}

//create a server
const server = http.createServer((req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    //to get all movies
    if(req.url === '/movies' && req.method === 'GET'){
        const movies = readMoviesFromFile();
        res.end(JSON.stringify(movies));
    }

    //to get movies by ID
    else if(req.url.match(/^\/movies\/([0-9]+)$/) && req.method === 'GET'){
        const id = parseInt(req.url.split('/')[2]);
        const movies = readMoviesFromFile();
        const movie = movies.find(b => b.id === id);

        if (movie){
            res.end(JSON.stringify(movie));
        }
        else{
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Movie Not Found');
        }
    }

    //to create new movie
    else if (req.url === '/movies' && req.method === 'POST') {
        let body = '';

        req.on('data',chunk =>{
            body+= chunk.toString();
        });

        req.on('end', () => {
            const movies = readMoviesFromFile();
            const newMovie = JSON.parse(body);

            newMovie.id= movies.length > 0 ? movies[movies.length -1].id + 1: 1;

            movies.push(newMovie);
            writeMoviesToFile(movies);

            res.writeHead(201, {'Content-Type': 'application/json' });
            res.end(JSON.stringify(newMovie));
        });
    }

    //PUT - Update
    else if (req.url.match(/^\/movies\/([0-9]+)$/) && req.method === 'PUT'){
        const id = parseInt(req.url.split('/')[2]);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const movies = readMoviesFromFile();
            const updatedData = JSON.parse(body);
            const index = movies.findIndex(m => m.id === id);

            if(index !==-1){
                movies[index] = { ...movies[index], ...updatedData };
                writeMoviesToFile(movies);
                res.end(JSON.stringify(movies[index]));
            }
            else{
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Movie Not Found');
            }
        });
    }
    else if (req.url.match(/^\/movies\/([0-9]+)$/) && req.method === 'DELETE'){
        const id=parseInt(req.url.split('/')[2]);
        const movies = readMoviesFromFile();
        const index = movies.findIndex(m=> m.id === id);

        if(index!== -1){
            movies.splice(index, 1);
            writeMoviesToFile(movies);
            res.end(JSON.stringify({message: 'Movie deleted successfully'}));
        }
        else{
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Movie not found');
        }
    }

    else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Route not found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Try: http://localhost:${PORT}/movies`);
});