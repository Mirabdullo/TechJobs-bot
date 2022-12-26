import { User } from '../models/user.model.js'
import { Markup, Context } from 'telegraf'

export async function getLang(user_id: string) {
  let lang = 'UZB'
  await User.findOne({ where: { user_id: `${user_id}` } }).then((user) => {
    if (user) {
      lang = user.dataValues.user_lang
    }
  })
  return lang
}

export async function selectLang(ctx: Context) {
  return await ctx.reply(`<b>Tilni tanlang / Выберите язык:</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([["🇺🇿 O'zbek tili", '🇷🇺 Русский язык']])
      .oneTime()
      .resize(),
  })
}

export async function saveLang(ctx: Context, lang: string) {
  const user_id = ctx?.from?.id
  await User.findOne({ where: { user_id: `${user_id}` } }).then(async (user) => {
    if (!user) {
      await selectLang(ctx)
    } else {
      await user.update({ user_lang: lang })
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
}
