const express = require('express');
const path = require('path');
const hbs = require('hbs');
const request = require('request');
let {PythonShell} = require('python-shell');
const geolocation = require('./utils/geolocation');
const predict = './src/utils/predict.py';


const app = express();
const port = 3000;

// Defining paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const templatesPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setting up handlerbars
app.set('view engine', 'hbs');
app.set('views', templatesPath);
hbs.registerPartials(partialsPath);

// Setup static directory to use
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Trail_App',
        name: 'AubieHacks'
    })
})

app.get('/location', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    const location = req.query.address;
    const distance = req.query.distance;
    const difficulty = req.query.difficulty;

    geolocation(location, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({
                error
            });
        }
        const message = 'Latitude: ' + latitude + ' Longitude: ' + longitude + ' distance: ' + distance +
        ' difficulty: ' + difficulty;

        let params = {
            args: [latitude, longitude, distance, difficulty]
        }
        var recommendations = []
        PythonShell.run(predict, params, function(error, result) {
            if(error) {
                console.log(error);
                return res.send({
                    error
                })
            } else {
                recommendations = result;
            }
        })

        res.send({
            latitude: latitude,
            longitude: longitude,
            location: location,
        });
        console.log(message);
        console.log(result);
    })
})

app.listen(port, () => {
    console.log("Server is up and running at port 3000");
})