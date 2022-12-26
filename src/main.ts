import * as dotenv from 'dotenv'
dotenv.config()
console.log(process.env.BOT_TOKEN)

export * from './core/index.js'
export * from './actions/index.js'
