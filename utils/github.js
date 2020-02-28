const fetch = require('node-fetch')
const { GITHUB_AUTH_TOKEN } = require('../config/github.js')

module.exports = {

    get: (route) => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com${route}`, {
                    headers: {
                        Authorization: `token ${GITHUB_AUTH_TOKEN}`
                    },
                    method: "GET"
                })
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })
    },

    postJson: (route, jsonString) => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com${route}`, {
                    body: jsonString,
                    headers: {
                        Authorization: `token ${GITHUB_AUTH_TOKEN}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST"
                })
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })

    },

    putJson: (route, jsonString) => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com${route}`, {
                    body: jsonString,
                    headers: {
                        Authorization: `token ${GITHUB_AUTH_TOKEN}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PUT"
                })
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })

    },

    patchJson: (route, jsonString) => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.github.com${route}`, {
                    body: jsonString,
                    headers: {
                        Authorization: `token ${GITHUB_AUTH_TOKEN}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "PATCH"
                })
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })

    },

    checkGitUser: (email) => {
        module.exports.get(`/search/users?q=${email}+in%3Aemail`)
            .then(json => {
                if (json['total_count']) {
                    res(json.items[0].login)
                } else {
                    rej('Not Found')
                }
            }).catch(e => console.log(e))
    },

    newUserProcess: (email, jwt) => {
        return new Promise((res, rej) => {
            let result = {
                emailItems: []
            }
            module.exports.checkGitUser(email)
                .then(answer => {
                    if (answer === 'Not Found') {
                        result.emailItems.push(`We looked to see if your email was publicly associated with a github account but came up empty.
                         
                        <!-- You can follow this link to associate a user name with our system directly -->
                         /api/linkgithub?email=${email}&jwt=${credential}
                         `)
                        res(result)
                    } else {
                        module.exports.get(`orgs/hackforla/memberships/${answer}`)
                            .then(r => {
                                if (r.role) { //in org
                                    console.log(`${email} exists as ${r.role}`) //no action needed
                                    res(result)
                                } else { //not in org
                                    module.exports.putJson(`/orgs/hackforla/memberships/${answer}`, { role: 'member' })
                                        .then(r => { //maybe break these responses out to a templating function?
                                            result.emailItems.push(`It looks like your github account is @${answer} and we sent you and invitation email to join our HackForLA organization.
                                            If you'd like to asscociate a different github account with your email follow this link
                                            /api/linkgithub?email=${email}&jwt=${credential}`)
                                        })
                                    res(result)
                                }
                            })
                            .catch(e => rej(e))
                    }
                })
                .catch(e => rej(e))
        })
    }
}