A Simple Flight Search functionality based off of a mock data sample. https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/flight-docs/flight-sample.json

Data from this sample is being inserted into a bucket that will be created on your local couchbase server running at http://localhost:8091/ (You should have installed couchbase server or atleast a sandbox).

Steps to launch this app:
1. clone / download the repository.
2. `npm install` from terminal on the  local clone path to populate the dependency packages.
3. Set your own couchbase credentials at this pasrt of your local clone. https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/server/routes/api.js#L7 and https://github.com/infamousNerd/simpleFlightSearch/blob/flightSearch/server/routes/api.js#L9
4. `npm start` from terminal (updated the rule for 'start' in ```angular.json```).
5. visit http://localhos:3000/

Core Functionalities:

The app comprises of a reactive search form that will be availanble at all times and has pre-filled options as populated by the leverage of APP_INTIALIZE token that can make an initial REST call to the Express Backend which will have created a bucket on local `couchBase` server and upserted the flight data as documents into it. 
A Results component is dynamically available via the Router Outlet plced as the second half of app-wide bootstrap grid, per user interaction with the search form. Once the search results in a succesful display of results (look for details into search criteria in the next paragraph), A user will be able to use a list group of navigable links, each formatted to show the much needed information on each flight. As a next step any list Item can be clicked to route to a flight detail page on the router outlet which has all the information fetched about the flight.
A user is allowed to either search using `origin` and `destination` and `date` (or) `flightNumber` and `date`. There are some custom validations in place to avoid user from searching with a different criteria. However a user is allowed to use all search field to search for a flight if any. There are four Web Services in place which run N1Ql queries to fetch data from the database per search criteria.


