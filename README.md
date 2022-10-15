#test your [dgraph](https://dgraph.io/) database with your favorite test tool

*(Prerequiste: [docker](https://www.docker.com/) installed)*

```bash
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
    schema: "schema.graphql",
    url: "http://localhost",
    port: '8080',
    claims: "https://my.app.io/jwt/claims",
    secret: "secret",
    image: 'dgraph/standalone:master',
    schemaFooter: (c) => `# Dgraph.Authorization {"VerificationKey":"${c.secret}","Header":"Authorization","Namespace":"${c.claims}","Algo":"HS256","Audience":["aud1","aud5"]}`,
 }   
```
