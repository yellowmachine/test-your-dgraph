<a href="https://vshymanskyy.github.io/StandWithUkraine">
		<img src="https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg">
</a>

# Test your [dgraph](https://dgraph.io/) schema with your favorite test tool

*(Prerequiste: [docker](https://www.docker.com/) installed)*

```bash
docker pull dgraph/standalone:master # you can use the image you want, see config below. But you must pull the image

npx degit yellowmachine/test-your-dgraph my-test-dgraph

cd my-test-dgraph

npm i

npm run test
```

You can change default settings:

```js
{
    //pretty welcome ;)
    welcome: chalk.yellow("yellow") + " here testing your dgraph",
    schema: "./schema/schema.graphql", //schema.js
    url: "http://localhost",
    port: '8080',
    claims: "https://my.app.io/jwt/claims",
    secret: "secret",
    image: 'dgraph/standalone:master',
    schemaFooter: (c) => `# Dgraph.Authorization {"VerificationKey":"${c.secret}","Header":"Authorization","Namespace":"${c.claims}","Algo":"HS256","Audience":["aud1","aud5"]}`,
 }   
```

Example

```js
// test example

//client is a tokenized instance of graphql-request "GraphQLClient"
const tap = require('tap')
const { dropData, client, gql} = require('../setup')

SETUP = gql`
mutation MyMutation {
  addJob(input: {title: "send mails", completed: false, command: "mail ..."}){
    job{
      id
    }
  }
}
`
QUERY = gql`
query MyQuery {
  queryJob {
    id
    title
    completed
  }
}
`

tap.beforeEach(async () => {
  await dropData()
});

tap.test('wow!', async (t) => {
    await client({ROLE: 'ADMIN'}).request(SETUP)
    let response = await client({ROLE: 'NONO'}).request(QUERY)
    t.equal(response.queryJob.length, 0)
});
```

Here an example of a splited schema:

File: ```enum.graphql```
```graphql
enum Role {
  ADMIN
  DEVELOPER
}
```

File: ```schema.graphql```
```graphql
#include enum.graphql

type Job @auth(
    query: {
        rule:  "{$ROLE: { eq: \"ADMIN\" } }" 
    }
){
    id: ID!
    title: String!
    completed: Boolean!
    command: String!
}
```

Later you can ```npm run print``` to print full schema to stdout.

If you want more flexibility you can do this:

File: ```yellow.config.js```
```js
module.exports = {
    ...
    schema: "./schema/schema.js",
    ...
```

File: ```schema.js```

```js
const { quote, gql } = require('../setup')

const ADMIN = quote("ADMIN")

module.exports = gql`
type Job @auth(
    query: {
        rule:  "{$ROLE: { eq: ${ADMIN} } }" 
    }
){
    id: ID!
    title: String!
    completed: Boolean!
    command: String!
}
`
```

You can split or do whatever you want, it's javascript and gql.