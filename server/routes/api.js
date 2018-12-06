const express = require('express');
const couchBase = require('couchbase');
const router = express.Router();
const flights = require('../../flight-docs/flight-sample.json');

const cluster = new couchBase.Cluster('couchbase://localhost/');
cluster.authenticate('Administrator', 'password');
const N1qlQuery = couchBase.N1qlQuery;
const clusterManager = cluster.manager('Administrator', 'password');
let bucket;

clusterManager.createBucket('flights', { flushEnabled: 0, replicaIndex: 0, replicaNumber: 0 }, (err, result) => {
    if (err) {
        if (err.message === "Bucket with given name already exists") {
            console.log('Aw! The bucket already exists!');
            return;
        }
        console.log('Unable to create flights bucket at initialization:' + '' + err.message);
    } else {
        console.log('Successfully created flights bucket at initialization:' + '' + result);
    }
});

// Delay is needed as clusterManager is not capable of opening a bucket when it is just created while the node is pending.
// Also we cannot leverage a promise here because bucket creation would resolve it but node will be still pending as to open bucket.
setTimeout(() => {
    bucket = cluster.openBucket('flights', (err) => {
        if (err) {
            console.log('Error retreiving the flights bucket:' + ' ' + err);
            return;
        }
    });
}, 2000);

function unnestDocuments(incomingDocs) {
    let outgoingDocs = [];
    incomingDocs.forEach(doc => {
        outgoingDocs.push(Object.assign({}, doc.flights));
    });
    return outgoingDocs;
}

function getLandingData(req, res, next) {
    const fromArr = [];
    const toArr = [];
    const flightArr = [];
    function setAndGetFlight (flight, resolve, reject) {
        flight.departure = JSON.stringify(new Date()).replace('"', '').split('T')[0];
        flight.arrival = JSON.stringify(new Date()).replace('"', '').split('T')[0];
        bucket.manager().createPrimaryIndex(function () { 
            bucket.upsert(flight.flightNumber, flight, function (err, result) {
                if (err) {
                    console.log('Error while inserting document at app Initialization' + err);
                    reject(err);
                } 
                bucket.get(flight.flightNumber, function (err, result) {
                    if (err) {
                        console.log('Not all pre-load data is fetched:' + ' ' + err.message);
                    }
                    fromArr.push(result.value.origin);
                    toArr.push(result.value.destination);
                    flightArr.push(result.value.flightNumber);
                    console.log('Got all information?' + ' ' + JSON.stringify(result.value));
                    resolve();
                });
            });
        });
    }

    let flightOperations = flights.map((flight) => {
        return new Promise((resolve, reject) => {
            setAndGetFlight(flight, resolve, reject);
        });
    });

    return Promise.all(flightOperations)
        .then(() => {
            const loadDoc = {
                origins: [...new Set(fromArr)],
                destinations: [...new Set(toArr)],
                flights: [...new Set(flightArr)]
            };
            res.json(loadDoc);
            console.log('Pre load data for form-fields sent:' + ' ' + JSON.stringify(loadDoc));
        }).catch((err) => {
            res.status(err.statusCode || 500).json(err);
            console.log('Pre load data for form-fields not sent:' +  ' ' + err);
        });
}

function getResultsByCity(req, res, next) {
    return new Promise((resolve, reject) => {
        const source = req.query.origin;
        const destination = req.query.destination;
        const date = req.query.date;

        const query = N1qlQuery.fromString('SELECT * FROM flights WHERE origin=$1 AND destination=$2 AND departure=$3');
        bucket.query(query, [source, destination, date], (err, rows) => {
            if (err) {
                console.log('Unable to fetch the requested flight details:' + ' ' + err);
                reject(err);
                res.status(err.statusCode || 500).json(err);
            } else {
                const flightDocs = unnestDocuments(rows);
                console.log('Successfully fetched the requested flight details:' + ' ' + JSON.stringify(flightDocs));
                resolve(flightDocs);
                res.json(flightDocs);
            }
        });
    });
}

function getResultsByFlight(req, res, next) {
    return new Promise((resolve, reject) => {
        const flight = req.query.flightNumber;
        const date = req.query.date;

        const query = N1qlQuery.fromString('SELECT * FROM flights WHERE flightNumber=$1 AND departure=$2');
        bucket.query(query, [flight, date], (err, rows) => {
            if (err) {
                console.log('Unable to fetch the requested flight details:' + ' ' + err);
                reject(err);
                res.status(err.statusCode || 500).json(err);
            } else {
                const flightDocs = unnestDocuments(rows);
                console.log('Successfully fetched the requested flight details:' + ' ' + JSON.stringify(flightDocs));
                resolve(flightDocs);
                res.json(flightDocs);
            }
        });
    });
}

function getResultsByAll(req, res, next) {
    return new Promise((resolve, reject) => {
        const flight = req.query.flightNumber;
        const date = req.query.date;
        const source = req.query.origin;
        const destination = req.query.destination; 

        const query = N1qlQuery.fromString('SELECT * FROM flights WHERE flightNumber=$1 AND departure=$2 AND origin=$3 AND destination=$4');
        bucket.query(query, [flight, date, source, destination], (err, rows) => {
            if (err) {
                console.log('Unable to fetch the requested flight details:' + ' ' + err);
                reject(err);
                res.status(err.statusCode || 500).json(err);
            } else {
                const flightDocs = unnestDocuments(rows);
                console.log('Successfully fetched the requested flight details:' + ' ' + JSON.stringify(flightDocs));
                resolve(flightDocs);
                res.json(flightDocs);
            }
        });
    });
}
/* GET home page. */
router.get('/', getLandingData);
router.get('/searchByCity', getResultsByCity);
router.get('/searchByFlight', getResultsByFlight);
router.get('/searchByAll', getResultsByAll);


module.exports = router;