const env = require('../config');
const https = require('https');

const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic "+ env.pushToken
};

const options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
};

const message = {
    app_id: env.pushApiId,
    contents: {"en": "English Message"},
    included_segments: ["All"]
};

exports.sendPush = (type, title) => {
switch (type) {
    case 'new':
        message.contents = {"en": "nouvelle tache "+title};
        break;
    case 'update' :
        message.contents = {"en": " tache "+title+ " mise à jour"};
        break;
    case 'delete' :
        message.contents = {"en": " tache "+title+" supprimée"};
        break;

}
    const req = https.request(options, function(res) {
        res.on('message', function(message) {
            console.log("Response:");
            console.log(JSON.parse(message));
        });
    });

    req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(message));
    req.end();
};
