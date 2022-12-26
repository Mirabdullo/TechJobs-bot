import { bot } from '../core/bot.js'
import { Composer, Markup } from 'telegraf'
import { getLang } from '../libs/lang.js'
import { keyboards } from '../libs/keyboards.js'
import { inlineMenuElonKurish, inlineMenuElonKurishRus } from '../libs/menu_elon.js'
import { see_elon } from '../libs/see_ads.js'
const composer = new Composer()

composer.hears("🔍 E'lonlarni ko'rish", async (ctx) => {
  await ctx.reply(`<b>Bosh sahifa!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([["🔍 E'lonlarni ko'rish", "📣 E'lon berish"]])
      .oneTime()
      .resize(),
  })
  await inlineMenuElonKurish(ctx, `<b>E'lonlarni ko'rish uchun kerakli bo'limni tanlang:</b>`)
})

composer.hears('🔍 Посмотреть объявление', async (ctx) => {
  await ctx.reply(`<b>Главная страница!</b>`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([['🔍 Посмотреть объявление', '📣 Подать объявление']])
      .oneTime()
      .resize(),
  })
  await inlineMenuElonKurishRus(ctx, `<b>Выберите нужный раздел:</b>`)
})

composer.action('andoza1', async (ctx) => {
  const lang = await getLang(String(ctx?.from?.id))
  if (lang === 'UZB')
    await ctx.editMessageText('<b>Quyidagilardan birini tanlang</b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_andoza_kurish'],
    })
  else
    await ctx.editMessageText('<b>Выберите нужный раздел:</b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_andoza_kurish_rus'],
    })
})

composer.action('asosiy1', async (ctx) => {
  const lang = await getLang(String(ctx?.from?.id))
  if (lang === 'UZB')
    await ctx.editMessageText("<b>E'lonlarni ko'rish uchun kerakli bo'limni tanlang:</b>", {
      parse_mode: 'HTML',
      ...keyboards['inline_menu_elon_kurish'],
    })
  else
    await ctx.editMessageText('<b> Выберите нужный раздел </b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_menu_elon_kurish_rus'],
    })
})

composer.action('ish1', async (ctx) => {
  await see_elon(ctx, 'ish', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('hodim1', async (ctx) => {
  await see_elon(ctx, 'hodim', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('ustoz1', async (ctx) => {
  await see_elon(ctx, 'ustoz', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('shogird1', async (ctx) => {
  await see_elon(ctx, 'shogird', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('sherik1', async (ctx) => {
  await see_elon(ctx, 'sherik', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('uquv_markazi1', async (ctx) => {
  await see_elon(ctx, 'uquv_markazi', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('uquvchi1', async (ctx) => {
  await see_elon(ctx, 'uquvchi', await getLang(String(ctx?.from?.id)), 0)
})

composer.action('loyiha1', async (ctx) => {
  await see_elon(ctx, 'loyiha', await getLang(String(ctx?.from?.id)), 0)
})
composer.action('erkin1', async (ctx) => {
  await see_elon(ctx, 'erkin', await getLang(String(ctx?.from?.id)), 0)
})

bot.use(composer.middleware())
