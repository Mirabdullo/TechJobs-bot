import { Markup, Context } from 'telegraf'
import { keyboards } from './keyboards.js'

export async function menu_elon_uzb(ctx: Context) {
  await ctx.reply(`"Yangi e'lonni qo'shish" tugmasini bosing`, {
    parse_mode: 'HTML',
    ...Markup.keyboard([
      ["🆕 Yangi e'lonni qo'shish"],
      ['☸ Tilni tanlash', "Men bergan e'lonlar"],
      ['🏠 Bosh sahifa', "💁 E'lon berish tartibi"],
    ])
      .oneTime()
      .resize(),
  })
}

export async function menu_elon_rus(ctx: Context) {
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
}

export async function inlineMenuElonBerish(ctx: Context, inlineElonText: string) {
  return await ctx.reply(inlineElonText, {
    parse_mode: 'HTML',
    ...keyboards['inline_menu_elon_berish'],
  })
}

export async function inlineMenuElonBerishRus(ctx: Context, inlineElonText: string) {
  return await ctx.reply(inlineElonText, {
    parse_mode: 'HTML',
    ...keyboards['inline_menu_elon_berish_rus'],
  })
}

export async function inlineMenuElonKurish(ctx: Context, inlineText: string) {
  return await ctx.reply(inlineText, {
    parse_mode: 'HTML',
    ...keyboards['inline_menu_elon_kurish'],
  })
}

export async function inlineMenuElonKurishRus(ctx: Context, inlineText: string) {
  return await ctx.reply(inlineText, {
    parse_mode: 'HTML',
    ...keyboards['inline_menu_elon_kurish_rus'],
  })
}
