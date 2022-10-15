const npm = require('npm-commands');
const axios = require('axios')
const chalk = require('chalk');
const fs = require('fs')
const { config } = require('./setup')
const colorize = require('json-colorizer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
    let data = await fs.promises.readFile(`./${config.schema}`, 'utf8')
    data = data + "\n" + config.schemaFooter(config)
    const schema = data.toString()

    console.log(chalk.blue(config.welcome))
    let test = true

    while(true){
        
        let response = await axios({
          url: `${config.url}:${config.port}` + "/admin",
          method: 'post',
          data: {
            query: `mutation($schema: String!) {
              updateGQLSchema(input: { set: { schema: $schema } }) {
                gqlSchema {
                  schema
                }
              }
            }
            `,
            variables: {
              schema,
            },
          },
        })

        if(!response.data.errors){
          test = true
          break
        }
        console.log(colorize(response.data.errors, {
          colors: {
            BRACE: 'blue',
            BRACKET: 'magenta',
            COLON: 'yellow',
            COMMA: 'white',
            STRING_KEY: 'green',
            STRING_LITERAL: 'red.bold',
            NUMBER_LITERAL: '#FF0000'
          }, 
          pretty: true 
        }));

        if(!response.data.errors[0].message.startsWith('failed to lazy-load GraphQL schema')){
          test = false
          break
        }
        await sleep(2000)
    }
    if(test) npm().run('devtest');
}

main()