import { Ads } from '../models/ads.model.js'
import { Context } from 'telegraf'
import { Op } from 'sequelize'

export async function see_elon(ctx: Context, selectedCategory: string, lang: string, offset: number) {
  const elon = await Ads.findAll({
    where: { category: selectedCategory, post_id: { [Op.not]: '' } },
    order: [['id', 'ASC']],
    offset: offset,
    limit: 1,
  })
  if (!elon || elon.length == 0) {
    if (lang === 'UZB') await ctx.reply(`Tanlangan bo'limda boshqa faol e'lon yo'q`)
    else await ctx.reply(`В выбранном разделе нет больше активное объявление`)
  } else {
    elon.forEach(async (element) => {
      try {
        let txt = ''
        if (lang === 'UZB') txt = `Keyingi elonni ko'rish ➡️ `
        else txt = `См. следующую объявлению ➡️ `
        await ctx.telegram
          .copyMessage(String(ctx?.from?.id), String(process.env.CHANEL), Number(element.post_id), {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: txt,
                    callback_data: `offset=${offset + 1} cat=${selectedCategory} lang=${lang}`,
                    // hide: false,
                  },
                ],
              ],
            },
          })
          .then()
      } catch (error) {
        console.log(error)
        console.log('xatolik-Мои скидки11')
      }
    })
  }
}
