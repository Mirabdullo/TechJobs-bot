import { Ads } from '../models/ads.model.js'
import { Context } from 'telegraf'

export async function add_elon(ctx: Context, selectedCategory: string, lang: string) {
  const userId = String(ctx?.from?.id)
  await Ads.create({
    user_id: userId,
    category: selectedCategory,
    elon_state: 'name',
    //elon_state: "select_category",
  }).then(async (elon) => {
    if (!elon) {
      if (lang === 'UZB') await ctx.replyWithHTML("Xatolik, e'lon kiritishni qaytadan boshlang.")
      else if (lang === 'RUS') {
        await ctx.replyWithHTML('-> /Start ')
      }
    } else {
      if (lang === 'UZB') {
        let txt = 'Familiya va ismingizni kiriting:'
        if (selectedCategory === 'hodim') txt = 'Firma yoki tashkilot nomini kiriting:'
        else if (selectedCategory === 'uquvchi') txt = "O'quv markazi nomini kiriting:"

        await ctx.reply(txt)
      } else if (lang === 'RUS') {
        let txt = 'Введите свою фамилию и имя:'
        if (selectedCategory === 'hodim') txt = 'Введите название компании или организации:'
        else if (selectedCategory === 'uquvchi') txt = 'Введите название учебного центра:'

        await ctx.reply(txt)
      }
    }
  })
}
