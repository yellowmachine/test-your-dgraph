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