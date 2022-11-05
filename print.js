const { config, loadSchema } = require('./setup')

async function print(){ 
    const name = `./${config.schema}`
    let data = ""
    if(name.endsWith(".js"))
        data = require(name)
    else
        data = await loadSchema(name)

    console.log(data)
}

print()