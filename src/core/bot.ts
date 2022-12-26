import { Telegraf } from 'telegraf'
import { sequelize } from './db.js'

// interface SessionData {
//   heyCounter: number
// }

// interface BotContext extends Context {
//   session?: SessionData
// }

const token = String(process.env.BOT_TOKEN)
export const bot = new Telegraf(token)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
  } catch (error) {
    console.log('BD ERROR')
    console.log(error)
  }
}

start()
// // @ts-ignore
// function sendLiveLocation(ctx: any) {
//   let lat = 42.0
//   let lon = 42.0
//   // @ts-ignore
//   ctx.replyWithLocation(lat, lon, { live_period: 60 }).then((message) => {
//     const timer = setInterval(() => {
//       lat += Math.random() * 0.001
//       lon += Math.random() * 0.001
//       ctx.telegram
//         .editMessageLiveLocation(lat, lon, message?.chat?.id, message?.message_id)
//         .catch(() => clearInterval(timer))
//     }, 1000)
//   })
// }
// bot.start(sendLiveLocation)
bot.launch()
