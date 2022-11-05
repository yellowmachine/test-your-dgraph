const { quote, gql } = require('./setup')

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