const { GraphQLClient } = require('graphql-request')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const config = require('./yellow.config')
const chalk = require("chalk")

let configWithDefaults = {
    welcome: chalk.yellow("yellow") + " here testing your dgraph",
    schema: "schema.graphql",
    url: "http://localhost",
    claims: "https://my.app.io/jwt/claims",
    secret: "secret",
    image: 'dgraph/standalone:master',
    port: '8080',
    schemaFooter: (c) => `# Dgraph.Authorization {"VerificationKey":"${c.secret}","Header":"Authorization","Namespace":"${c.claims}","Algo":"HS256","Audience":["aud1","aud5"]}`,
    ...config
}

async function dropData(){
    await axios.post(`${configWithDefaults.url}:${configWithDefaults.port}` + "/alter", {drop_op: "DATA"})
}

function token(claims){
    return jwt.sign({ [configWithDefaults.claims]: claims }, configWithDefaults.secret);
}

function tokenizedGraphQLClient(token){
    return new GraphQLClient(`${configWithDefaults.url}:${configWithDefaults.port}` + "/graphql", { headers: {Authorization: `Bearer ${token}`} })
}

function client(claims){
    return tokenizedGraphQLClient(token(claims))
}

module.exports = {
    dropData,
    client,
    config: configWithDefaults
}