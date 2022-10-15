# test your [dgraph](https://dgraph.io/) schema with your favorite test tool

*(Prerequiste: [docker](https://www.docker.com/) installed)*

```bash
npx degit yellowmachine/test-your-dgraph my-test-dgraph

cd my-test-dgraph

npm i

npm run test # edit package.json to change test tool
```

Now you can edit your schema or your tests and see the test report on the console.

You can change default settings on *yellow.config.js*:

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
