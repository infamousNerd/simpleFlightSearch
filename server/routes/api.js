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
setTimeout(() => {
    bucket = cluster.openBucket('flights', (err) => {
        if (err) {
            console.log('Error retreiving the flights bucket:' + ' ' + err);
            return;
        }
    });
}, 2000);

/* GET home page. */
router.get('/', (req, res, next) => {
    const fromArr = [];
    const toArr = [];
    const flightArr = [];
    function setAndGetFlight (flight, resolve, reject) {
        flight.departure = new Date();
        flight.arrival = new Date();
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
            console.log('Pre load data for form-fields not sent:' +  ' ' + err);
        });
});   

module.exports = router;