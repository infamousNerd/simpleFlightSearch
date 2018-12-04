A Simple Flight Search functionality based off of a mock data sample. https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/flight-docs/flight-sample.json

Data from this sample is being inserted into a bucket that will be created on your local couchbase server running at http://localhost:8091/ (You should have installed couchbase server or atleast a sandbox).

Steps to launch this app:
1. clone / download the repository.
2. `npm install` from terminal on the  local clone path to populate the dependency packages.
3. Set your own couchbase credentials at this pasrt of your local clone. https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/server/routes/api.js#L7 and https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/server/routes/api.js#L9
4. `npm start` from terminal (updated the rule for 'start' in ```angular.json```).
5. visit http://localhos:3000/

Progress on the task:
1. Created an angular-cli project using @angular/cli and created a homepage closer to the actual United Airlines website UI.
2. Added NodeJS backend using express.
3. Replaced the @angular/cli provided webserver with express and created a production grade build that builds distributibles and serves the app with `npm start`.
4. Leveraged couchbase server's NodeJS SDK `couchbase` provide clusterManager API to create a bucket and subsequently inset the mock sample as documents into it using bucketManager API.
5. Fetched the required data from the bucket to be providing the available options to select on the form-fields of search functionality. Implemented auto-completion of these fields by user interaction.

Next Steps on the task:
1. create the search results component and add functionalityto display the results per search.
2. Write a couple web services with some N1Ql querys to fetch data and display by choice  `source and destination` and `flightNumber`.
3. Add dynamic real-time validations to form-fields per user interaction.
4. Write unit tests for the application if time permits.

