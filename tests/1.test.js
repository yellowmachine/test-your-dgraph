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