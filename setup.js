const { GraphQLClient, gql } = require('graphql-request')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const config = require('./yellow.config')
const chalk = require("chalk")
const fs = require('fs')
const path = require('path')

let configWithDefaults = {
    welcome: chalk.yellow("yellow") + " here testing your dgraph",
    schema: "./schema/schema.graphql",
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

async function loadSchema(name){
    let data = await fs.promises.readFile(name, 'utf8')
    data =  data.toString()
    let lines = data.split("\n")
    let i = 0
    let line = lines[i]
    let header = ""
    while(line.startsWith("#include")){
      header = header + await loadSchema(path.join(path.dirname(name), line.substring(9).trim())) + "\n"
      i += 1
      line = lines[i]
    }
    return header + data
  }

function quote(txt){
    return `\\"${txt}\\"`
}

module.exports = {
    quote,
    dropData,
    gql,
    client,
    loadSchema,
    config: configWithDefaults
}