import { bot } from '../core/bot.js'
import { Composer, Markup } from 'telegraf'
import { selectLang, saveLang } from '../libs/lang.js'
const composer = new Composer()

composer.hears('Tilni tanlash / Выбор языка', async (ctx) => {
  await selectLang(ctx)
})

composer.hears('☸ Tilni tanlash', async (ctx) => {
  await selectLang(ctx)
})

composer.hears('☸ Выбор языка', async (ctx) => {
  await selectLang(ctx)
})

composer.hears("🇺🇿 O'zbek tili", async (ctx) => {
  await saveLang(ctx, 'UZB')
})

composer.hears('🇷🇺 Русский язык', async (ctx) => {
  await saveLang(ctx, 'RUS')
})

composer.hears("💁 E'lon berish tartibi", async (ctx) => {
  ctx.reply("Bu yerda e'lon berish tartibi yoziladi!")
  await ctx.reply("<b>Yangi e'lonni qo'shish 👇</b>", {
    parse_mode: 'HTML',
    ...Markup.keyboard([
      ["🆕 Yangi e'lonni qo'shish"],
      ['☸ Tilni tanlash', "Men bergan e'lonlar"],
      ['🏠 Bosh sahifa', "💁 E'lon berish tartibi"],
    ])
      .oneTime()
      .resize(),
  })
})

composer.hears('💁 Рекламная процедура', async (ctx) => {
  ctx.reply('Вот вам порядок объявления!')
  await ctx.reply('<b>Добавить новое объявление</b> 👇', {
    parse_mode: 'HTML',
    ...Markup.keyboard([
      ['🆕 Добавить новое объявление'],
      ['☸ Выбор языка', 'Мои объявления'],
      ['🏠 Главная страница', '💁 Рекламная процедура'],
    ])
      .oneTime()
      .resize(),
  })
})
composer.hears('addusertg', async (ctx) => {
  if (ctx?.from?.id == Number(process.env.ADMIN))
    try {
      await ctx.telegram.sendMessage('559790934', 'Hello man')
    } catch (error) {
      console.log(error)
    }
})

bot.use(composer.middleware())
