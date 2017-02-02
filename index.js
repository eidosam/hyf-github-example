var GitHubApi = require("github");
 
var github = new GitHubApi({
    // optional 
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub 
    pathPrefix: "", // for some GHEs; none for GitHub 
    headers: {
        "user-agent": "Smith" // GitHub is happy with a unique user agent 
    },
    Promise: require('bluebird'),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects 
    timeout: 5000
});
 
// TODO: optional authentication here depending on desired endpoints. See below in README.

// github.orgs.get({
//     org: 'HackYourFuture'
// })

// .then((res) => {
//     console.log(res);
// })

// .catch(console.error);


github.repos.getForOrg({
    org: 'HackYourFuture'
})

.then((repos) => {
    console.log(repos);
    let result = repos.forEach((repo) => {
        // get readme from each repo
        console.log('grabbing README.md for ' + repo.name + ' and owner: '  + repo.owner.login + '\n');
        github.repos.getContent({
            owner: repo.owner.login,
            repo: repo.name,
            path: 'README.md'
        })
        .then((readmeData) => {
            let buf = Buffer.from(readmeData.content, 'base64');
            console.log(buf.toString());
        }).catch(console.error);
    });
    // console.log(result);

})

.catch(console.error);
