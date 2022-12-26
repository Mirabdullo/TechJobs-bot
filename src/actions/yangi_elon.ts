import { Ads } from '../models/ads.model.js'
import { bot } from '../core/bot.js'
import { Composer, Markup } from 'telegraf'
import { getLang } from '../libs/lang.js'
import { add_elon } from '../libs/add_ads.js'
import { Op } from 'sequelize'
import { keyboards } from '../libs/keyboards.js'

const composer = new Composer()

composer.hears('❌ Bekor qilish', async (ctx) => {
  await Ads.findOne({
    where: { user_id: `${ctx.from.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      await Ads.destroy({ where: { id: `${elon.id}` } })
      await ctx.reply(`<b> Yangi e'lonni qo'shish 👇</b>`, {
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
  })
})
composer.hears('❌ Отменить публикацию', async (ctx) => {
  await Ads.findOne({
    where: { user_id: `${ctx.from.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      await Ads.destroy({ where: { id: `${elon.id}` } })
      await ctx.reply(`<b> Добавить новое объявление 👇</b>`, {
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
  })
})

composer.hears("Men bergan e'lonlar", async (ctx) => {
  await Ads.findAll({
    where: { user_id: `${ctx.from.id}`, post_id: { [Op.not]: '' } },
    order: [['post_id', 'DESC']],
  }).then(async (elon) => {
    if (!elon || elon.length == 0) {
      await ctx.reply(`Sizda birorta ham faol elon yo'q`)
    } else {
      elon.forEach(async (element) => {
        try {
          await ctx.telegram
            .copyMessage(ctx.from.id, String(process.env.CHANEL), Number(element.post_id), {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "❌ O'chirish",
                      callback_data: `del=${element.id}`,
                      // hide: false,
                    },
                  ],
                  [
                    {
                      text: '‼️ Reklama',
                      callback_data: `rek=${element.id}`,
                      // hide: false,
                    },
                  ],
                ],
              },
            })
            .then()
        } catch (error) {
          console.log("xatolik-Men bergan e'lonlar")
        }
      })
    }
  })
  await ctx.reply(`<b>Yangi e'lonni qo'shish </b>👇`, {
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

composer.hears('Мои объявления', async (ctx) => {
  await Ads.findAll({
    where: { user_id: `${ctx.from.id}`, post_id: { [Op.not]: '' } },
    order: [['post_id', 'DESC']],
  }).then(async (elon) => {
    if (!elon || elon.length == 0) {
      await ctx.reply(`У вас нет активное объявление`)
    } else {
      elon.forEach(async (element) => {
        try {
          await ctx.telegram
            .copyMessage(ctx.from.id, String(process.env.CHANEL), Number(element.post_id), {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '❌ Удалить',
                      callback_data: `del=${element.id}`,
                      // hide: false,
                    },
                  ],
                  [
                    {
                      text: '‼️ Реклама',
                      callback_data: `rek=${element.id}`,
                      // hide: false,
                    },
                  ],
                ],
              },
            })
            .then()
        } catch (error) {
          console.log('xatolik-Мои скидки')
        }
      })
    }
  })
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

composer.hears('✅ Tasdiqlash', async (ctx) => {
  await Ads.findOne({
    where: { user_id: `${ctx.from.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      let ads = ''
      let photo_path = ''
      let doc_path = ''
      let file_name = ''
      if (elon.category === 'hodim')
        ads = `<b>HODIM QIDIRILMOQDA:</b>\n\n🏦 Tashkilot: ${elon.name}\n📞 Telefon: ${elon.phone}\n✉️ Telegram: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalar: ${elon.technology}\n📈 Daraja: ${elon.degree}\n⏳ Ish vaqti: ${elon.work_time}\n💵 Maosh: ${elon.price}\n🌏 Hudud: ${elon.region}\n😇 Qo'shimcha ma'lumot: ${elon.info}`
      else if (elon.category === 'ustoz')
        ads = `<b>USTOZ QIDIRILMOQDA:</b>\n\n🧑‍💻 Shogird: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Talab qilinayotgan bilim-ko'nikmalar: ${elon.technology}\n📈 Daraja: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n💵 Shogirdlik badali: ${elon.price}\n🌏 Hudud: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`
      else if (elon.category === 'shogird')
        ads = `<b>SHOGIRD QIDIRILMOQDA:</b>\n\n🧑‍💻 Ustoz: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalar: ${elon.technology}\n📈 Daraja: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n💵 Shogirdlik badali: ${elon.price}\n🌏 Hudud: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`
      else if (elon.category === 'sherik')
        ads = `<b>SHERIK QIDIRILMOQDA:</b>\n\n🧑‍💻 Sherik: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalar: ${elon.technology}\n📈 Daraja: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n💵 Sheriklik badali: ${elon.price}\n🌏 Hudud: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`
      else if (elon.category === 'uquv_markazi')
        ads = `<b>O'QUV MARKAZI QIDIRILMOQDA:</b>\n\n🧑‍💻 O'quvchi: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalar: ${elon.technology}\n📈 Darajasi: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n⏳ Ma'qul o'qish vaqti: ${elon.work_time}\n💵 To'lov imkoniyati: ${elon.price}\n🌏 Hudud: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`
      else if (elon.category === 'uquvchi')
        ads = `<b>O'QUV MARKAZI TAKLIF QILADI:</b>\n\n🏦 O'quv markazi: ${elon.name}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Kurs nomi: ${elon.technology}\n📈 Davomiyligi: ${elon.degree}\n💵 Narxi: ${elon.price}\n🌏 Manzili: ${elon.region}\n📍 Mo'ljal: ${elon.work_place}\n😇 Qo'shimcha ma'lumot: ${elon.info}`
      else if (elon.category === 'loyiha')
        ads = `<b>LOYIHA QIDIRILMOQDA:</b>\n\n🧑‍💻 Mutaxassis: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalari: ${elon.technology}\n📈 Darajasi: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n🌏 Ko'zlagan hududi: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`
      else if (elon.category === 'erkin') {
        ads = `${elon.info}`
        if (elon.name === 'photo') photo_path = String(elon.technology)
        if (elon.name === 'doc') {
          doc_path = String(elon.technology)
          file_name = String(elon.degree)
        }
      } else
        ads = `<b>ISH QIDIRILMOQDA:</b>\n\n🧑‍💻 Nomzod: ${elon.name}\n📆 Yoshi: ${elon.age}\n📞 Telefoni: ${elon.phone}\n✉️ Telegrami: @${elon.tg_link}\n⏰ Murojaat vaqti: ${elon.call_time}\n📚 Bilim-ko'nikmalari: ${elon.technology}\n📈 Darajasi: ${elon.degree}\n🏦 Hozirgi o'qish-ish joyi: ${elon.work_place}\n⏳ Ma'qul ish vaqti: ${elon.work_time}\n💵 Ko'zlagan maoshi: ${elon.price}\n🌏 Ko'zlagan hududi: ${elon.region}\n😇 Xohish-istak va maqsadi: ${elon.info}`

      if (photo_path != '')
        await ctx.telegram.sendPhoto(
          String(process.env.ADMIN),
          { url: `${photo_path}` },
          {
            caption: ads,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✅ Tasdiqlansin',
                    callback_data: `ok=${elon.id}`,
                    // hide: false,
                  },
                  {
                    text: '❌ Inkor qilinsin',
                    callback_data: `no=${elon.id}`,
                    // hide: false,
                  },
                ],
              ],
            },
          },
        )
      else if (doc_path != '')
        await ctx.telegram.sendDocument(
          String(process.env.ADMIN),
          { url: doc_path, filename: file_name },
          {
            caption: ads,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✅ Tasdiqlansin',
                    callback_data: `ok=${elon.id}`,
                    // hide: false,
                  },
                  {
                    text: '❌ Inkor qilinsin',
                    callback_data: `no=${elon.id}`,
                    // hide: false,
                  },
                ],
              ],
            },
          },
        )
      else
        await ctx.telegram.sendMessage(String(process.env.ADMIN), ads, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ Tasdiqlansin',
                  callback_data: `ok=${elon.id}`,
                  // hide: false,
                },
                {
                  text: '❌ Inkor qilinsin',
                  callback_data: `no=${elon.id}`,
                  // hide: false,
                },
              ],
            ],
          },
        })
    }
  })
  await ctx.reply(`E'lon ko'rib chiqish va kanalga joylashtirish uchun operatorga yuborildi!`, {
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

composer.hears('✅ Подтвердить', async (ctx) => {
  await Ads.findOne({
    where: { user_id: `${ctx.from.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      let ads
      let photo_path = ''
      let doc_path = ''
      let file_name = ''
      if (elon.category === 'hodim')
        ads = `<b>ПОИСК СОТРУДНИКА:</b>\n\n🏦 Организация: ${elon.name}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n⏳ Время работы: ${elon.work_time}\n💵 Предлагаемая зарплата: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'ustoz')
        ads = `<b>ПОИСК НАСТАВНИКА:</b>\n\n🧑‍💻 Ученик: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Требуемые знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'shogird')
        ads = `<b>ПОИСК УЧЕНИКА:</b>\n\n🧑‍💻 Наставник: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'sherik')
        ads = `<b>ПОИСК ПАРТНЕРА:</b>\n\n🧑‍💻 Партнер: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Партнерский взнос: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'uquv_markazi')
        ads = `<b>ПОИСК УЧЕБНОГО ЦЕНТРА:</b>\n\n🧑‍💻 Слушатель: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобное время: ${elon.work_time}\n💵 Платежеспособность: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'uquvchi')
        ads = `<b>УЧЕБНЫЙ ЦЕНТР ПРИГЛАШАЕТ:</b>\n\n🏦 УЧЕБНЫЙ ЦЕНТР: ${elon.name}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Название курса: ${elon.technology}\n📈 Продолжительность: ${elon.degree}\n💵 Стоимость курса: ${elon.price}\n🌏 Адрес: ${elon.region}\n📍 Ориентир: ${elon.work_place}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'loyiha')
        ads = `<b>ПОИСК ПРОЕКТА:</b>\n\n🧑‍💻 Специалист: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      else if (elon.category === 'erkin') {
        ads = `${elon.info}`
        if (elon.name === 'photo') photo_path = String(elon.technology)
        if (elon.name === 'doc') {
          doc_path = String(elon.technology)
          file_name = String(elon.degree)
        }
      } else
        ads = `<b>ПОИСК РАБОТЫ:</b>\n\n🧑‍💻 Кандидат: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобное время: ${elon.work_time}\n💵 Целевая зарплата: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      if (photo_path != '')
        await ctx.telegram.sendPhoto(
          String(process.env.ADMIN),
          { url: `${photo_path}` },
          {
            caption: ads,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✅ Tasdiqlansin',
                    callback_data: `ok=${elon.id}`,
                    // hide: false,
                  },
                  {
                    text: '❌ Inkor qilinsin',
                    callback_data: `no=${elon.id}`,
                    // hide: false,
                  },
                ],
              ],
            },
          },
        )
      else if (doc_path != '')
        await ctx.telegram.sendDocument(
          String(process.env.ADMIN),
          { url: doc_path, filename: file_name },
          {
            caption: ads,
            parse_mode: 'HTML',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '✅ Tasdiqlansin',
                    callback_data: `ok=${elon.id}`,
                    // hide: false,
                  },
                  {
                    text: '❌ Inkor qilinsin',
                    callback_data: `no=${elon.id}`,
                    // hide: false,
                  },
                ],
              ],
            },
          },
        )
      else
        await ctx.telegram.sendMessage(String(process.env.ADMIN), ads, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✅ Tasdiqlansin',
                  callback_data: `ok=${elon.id}`,
                  // hide: false,
                },
                {
                  text: '❌ Inkor qilinsin',
                  callback_data: `no=${elon.id}`,
                  // hide: false,
                },
              ],
            ],
          },
        })
    }
  })
  await ctx.reply(`Объявление отправлено оператору для проверки!`, {
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



composer.action('erkin', async (ctx) => {
  const lang = await getLang(String(ctx?.from?.id))
  await Ads.create({
    user_id: String(ctx?.from?.id),
    category: 'erkin',
    elon_state: 'erkin',
    //elon_state: "select_category",
  }).then(async (elon) => {
    if (!elon) {
      if (lang === 'UZB') await ctx.replyWithHTML("Xatolik, e'lon kiritishni qaytadan boshlang.")
      else if (lang === 'RUS') {
        await ctx.replyWithHTML('-> /Start ')
      }
    } else {
      if (lang === 'UZB') {
        const txt = "Erkin shaklda tayyorlangan e'lonni yuboring:"
        await ctx.reply(txt)
      } else if (lang === 'RUS') {
        const txt = 'Отправте объявление в произвольной форме:'
        await ctx.reply(txt)
      }
    }
  })
})

composer.action('andoza', async (ctx) => {
  const lang = await getLang(String(ctx?.from?.id))
  if (lang === 'UZB')
    await ctx.editMessageText('<b>Kerakli andoza tanlang:</b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_andoza'],
    })
  else
    await ctx.editMessageText('<b> Выберите нужный шаблон:</b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_andoza_rus'],
    })
})
composer.action('asosiy', async (ctx) => {
  const lang = await getLang(String(ctx?.from?.id))

  if (lang === 'UZB')
    await ctx.editMessageText("<b>Yangi e'lon qo'shish uchun kerakli bo'limni tanlang:</b>", {
      parse_mode: 'HTML',
      ...keyboards['inline_menu_elon_berish'],
    })
  else
    await ctx.editMessageText('<b> Выберите нужный раздел </b>', {
      parse_mode: 'HTML',
      ...keyboards['inline_menu_elon_berish_rus'],
    })
})






composer.action('ish', async (ctx) => {
  add_elon(ctx, 'ish', await getLang(String(ctx?.from?.id)))
})

composer.action('hodim', async (ctx) => {
  add_elon(ctx, 'hodim', await getLang(String(ctx?.from?.id)))
})
composer.action('ustoz', async (ctx) => {
  add_elon(ctx, 'ustoz', await getLang(String(ctx?.from?.id)))
})
composer.action('shogird', async (ctx) => {
  add_elon(ctx, 'shogird', await getLang(String(ctx?.from?.id)))
})
composer.action('sherik', async (ctx) => {
  add_elon(ctx, 'sherik', await getLang(String(ctx?.from?.id)))
})
composer.action('uquv_markazi', async (ctx) => {
  add_elon(ctx, 'uquv_markazi', await getLang(String(ctx?.from?.id)))
})
composer.action('uquvchi', async (ctx) => {
  add_elon(ctx, 'uquvchi', await getLang(String(ctx?.from?.id)))
})
composer.action('loyiha', async (ctx) => {
  add_elon(ctx, 'loyiha', await getLang(String(ctx?.from?.id)))
})

bot.use(composer.middleware())
