import { bot } from '../core/bot.js'
import { Composer, Markup } from 'telegraf'
const composer = new Composer()
composer.hears('🏠 Bosh sahifa', async (ctx) => {
  await ctx.reply(`<b>Bosh sahifa!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([["🔍 E'lonlarni ko'rish", "📣 E'lon berish"]])
      .oneTime()
      .resize(),
  })
})
composer.hears('🏠 Главная страница', async (ctx) => {
  await ctx.reply(`<b>Главная страница!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([['🔍 Посмотреть объявление', '📣 Подать объявление']])
      .oneTime()
      .resize(),
  })
})

bot.use(composer.middleware())
