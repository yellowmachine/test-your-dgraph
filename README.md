# Test your [dgraph](https://dgraph.io/) schema with your favorite test tool

*(Prerequiste: [docker](https://www.docker.com/) installed)*

```bash
docker pull dgraph/standalone:master # you can use the image you want, see config below. But you must pull the image

npx degit yellowmachine/test-your-dgraph my-test-dgraph

cd my-test-dgraph

npm i

npm run test # it's using jest, but you can change it in package.json
```

You can change default settings:

```js
{
    //pretty welcome ;)
    welcome: chalk.yellow("yellow") + " here testing your dgraph",
    schema: "schema.graphql",
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
const { gql } = require('graphql-request')
const { dropData, client} = require('../setup')

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
beforeEach(async () => {
  await dropData()
});

test('wow!', async () => {
    await client({ROLE: 'ADMIN'}).request(SETUP)
    let response = await client({ROLE: 'NONO'}).request(QUERY)
    expect(response.queryJob.length).toBe(0)
});
```

