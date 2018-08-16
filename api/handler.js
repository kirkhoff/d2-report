const Traveler = require('the-traveler').default;

const traveler = new Traveler({
  apikey: '00503d2de9d14b17b5baed537fe29ab4',
  userAgent: 'd2.report'
});

const successfulResponse = rsp => callback => callback(null, {
  statusCode: 200,
  body: JSON.stringify(rsp)
});

const errorResponse = err => callback => callback(null, {
  statusCode: err.statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: err.message || 'Unknown Error'
});

module.exports.getManifest = (event, context, callback) => {
  traveler.getDestinyManifest()
    .then(rsp => successfulResponse(rsp)(callback))
    .catch(err => errorResponse(err)(callback));
};
