
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

let etag = undefined;

function testIt(_etag, next) {
    github.repos.getContent({
        owner: 'eidosam',
        repo: 'easy-slack',
        path: 'README.md',
        headers: {
            'If-None-Match': _etag? _etag: ''
        },
    })
    .then((readmeData) => {
        console.log(readmeData.meta.status);
        // replace etag for next request
        etag = readmeData.meta.etag;
        let buf = Buffer.from(readmeData.content, 'base64');
        next(null, buf.toString());
    })
    .catch(next);
}

async.timesSeries(2, (n, next) => {
    testIt(etag, (err, res) => {
        if(res) console.log(n, res);
        else console.error(n, err.message);
        next(err, res);
    });
}, (err, results) => {
    console.log('done', results.length);
});
