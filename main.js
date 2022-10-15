const nodemon = require('nodemon');
const {Docker} = require('node-docker-api');
const waitOn = require('wait-on');
const { config } = require('./setup') 

function nodemonHelper(container){
    nodemon({
        script: 'app.js',
        ext: 'js json graphql gql'
    });
    
    nodemon.on('start', async function () {
        console.log('App has started');
    }).on('quit', async function () {
        console.log('App has quit');
        await container.stop()
        console.log('docker dgraph.io stopped')
        await container.delete({ force: true })
        console.log('docker dgraph.io deleted')
        process.exit();
    }).on('restart', async function (files) {
        console.log('App restarted due to: ', files);
    });
}

async function main(){
    const docker = new Docker();
    try {
        //c = await docker.container.list()
        //console.log(c)

        const container = await docker.container.create({
            Image: config.image,
            name: 'testdgraphv6',
            PortBindings: {
                "8080/tcp": [{
                    "HostIP":"0.0.0.0",
                    "HostPort": config.port
                }]
            }
          })
        await container.start()
        await waitOn({
            resources: [`${config.url}:${config.port}`]
        });
        console.log('docker dgraph.io started')
        nodemonHelper(container)
    }catch(err){
        console.log(err)
        if(container){
            await container.stop()
            console.log('docker dgraph.io stopped')
            await container.delete({ force: true })
            console.log('docker dgraph.io deleted')
        }
    }
}

main()