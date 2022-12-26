import { User } from '../models/user.model.js'
import { bot } from '../core/bot.js'
import { Composer, Markup } from 'telegraf'
import { selectLang } from '../libs/lang.js'

const composer = new Composer()

composer.start(async (ctx) => {
  const new_user_id = ctx.from.id
  const username = ctx.from.username ? ctx.from.username : ''
  const first_name = ctx.from.first_name ? ctx.from.first_name : ''
  const last_name = ctx.from.last_name ? ctx.from.last_name : ''
  const user = await User.findOne({ where: { user_id: `${new_user_id}` } })

  if (!user) {
    await User.create({
      user_id: new_user_id,
      username,
      first_name,
      last_name,
    })
    await selectLang(ctx)
  } else if (user.dataValues.user_lang == '' || user.dataValues.user_lang == null) {
    await selectLang(ctx)
  } else {
    const lang = user.dataValues.user_lang

    if (lang === 'UZB') {
      await ctx.reply(`<b>Bosh sahifa!</b>`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([["🔍 E'lonlarni ko'rish", "📣 E'lon berish"]])
          .oneTime()
          .resize(),
      })
    } else if (lang === 'RUS') {
      await ctx.reply(`<b>Главная страница!</b>`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([['🔍 Посмотреть объявление', '📣 Подать объявление']])
          .oneTime()
          .resize(),
      })
    }
  }
})

bot.use(composer.middleware())
