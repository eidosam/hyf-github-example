
const GitHubApi = require("github");
const async = require("async");

const github = new GitHubApi({
    // optional
    debug: false,
    protocol: 'https',
    headers: {
        'user-agent': 'HackYourFuture Project5'
    },
    Promise: require('bluebird'),
    followRedirects: false,
    timeout: 5000
});

github.authenticate({
    type: 'oauth',
    token: process.env['GITHUB_TOKEN']
});

function testIt(next) {
    github.repos.getContent({
        owner: 'eidosam',
        repo: 'easy-slack',
        path: 'README.md'
    })
    .then((readmeData) => {
        let buf = Buffer.from(readmeData.content, 'base64');
        next(null, buf.toString());
    })
    .catch(next);
}

async.timesLimit(500, 10, function(n, next) {
    testIt(function(err, res) {
        if(res) console.log(n, res);
        else console.error(n, err.message);
        next(err, res);
    });
}, function(err, results) {
    console.log('done', results.length);
});

