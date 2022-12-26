import { Ads } from '../models/ads.model.js'
import { Markup, Context } from 'telegraf'

export async function menuTasdiqlash(ctx: Context) {
  let ads = ''
  let photo_path = ''
  let doc_path = ''
  let file_name = ''
  await Ads.findOne({
    where: { user_id: `${ctx?.from?.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      const {
        category,
        name,
        phone,
        age,
        tg_link,
        call_time,
        technology,
        degree,
        work_place,
        work_time,
        region,
        info,
        price,
      } = elon.dataValues
      if (category === 'hodim')
        ads = `<b>HODIM QIDIRILMOQDA:</b>\n\n🏦 Tashkilot: ${name}\n📞 Telefon: ${phone}\n✉️ Telegram: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalar: ${technology}\n📈 Daraja: ${degree}\n⏳ Ish vaqti: ${work_time}\n💵 Maosh: ${price}\n🌏 Hudud: ${region}\n😇 Qo'shimcha ma'lumot: ${info}`
      else if (category === 'ustoz')
        ads = `<b>USTOZ QIDIRILMOQDA:</b>\n\n🧑‍💻 Shogird: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Talab qilinayotgan bilim-ko'nikmalar: ${technology}\n📈 Daraja: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n💵 Shogirdlik badali: ${price}\n🌏 Hudud: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      else if (category === 'shogird')
        ads = `<b>SHOGIRD QIDIRILMOQDA:</b>\n\n🧑‍💻 Ustoz: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalar: ${technology}\n📈 Daraja: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n💵 Shogirdlik badali: ${price}\n🌏 Hudud: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      else if (category === 'sherik')
        ads = `<b>SHERIK QIDIRILMOQDA:</b>\n\n🧑‍💻 Sherik: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalar: ${technology}\n📈 Daraja: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n💵 Sheriklik badali: ${price}\n🌏 Hudud: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      else if (category === 'uquv_markazi')
        ads = `<b>O'QUV MARKAZI QIDIRILMOQDA:</b>\n\n🧑‍💻 O'quvchi: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalar: ${technology}\n📈 Darajasi: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n⏳ Ma'qul o'qish vaqti: ${work_time}\n💵 To'lov imkoniyati: ${price}\n🌏 Hudud: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      else if (category === 'uquvchi')
        ads = `<b>O'QUV MARKAZI TAKLIF QILADI:</b>\n\n🏦 O'quv markazi: ${name}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Kurs nomi: ${technology}\n📈 Davomiyligi: ${degree}\n💵 Narxi: ${price}\n🌏 Manzili: ${region}\n📍 Mo'ljal: ${work_place}\n😇 Qo'shimcha ma'lumot: ${info}`
      else if (category === 'loyiha')
        ads = `<b>LOYIHA QIDIRILMOQDA:</b>\n\n🧑‍💻 Mutaxassis: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalari: ${technology}\n📈 Darajasi: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n🌏 Ko'zlagan hududi: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      else if (category === 'erkin') {
        ads = `${info}`
        if (name === 'photo') photo_path = String(technology)
        if (name === 'doc') {
          doc_path = String(technology)
          file_name = String(degree)
        }
      } else
        ads = `<b>ISH QIDIRILMOQDA:</b>\n\n🧑‍💻 Nomzod: ${name}\n📆 Yoshi: ${age}\n📞 Telefoni: ${phone}\n✉️ Telegrami: @${tg_link}\n⏰ Murojaat vaqti: ${call_time}\n📚 Bilim-ko'nikmalari: ${technology}\n📈 Darajasi: ${degree}\n🏦 Hozirgi o'qish-ish joyi: ${work_place}\n⏳ Ma'qul ish vaqti: ${work_time}\n💵 Ko'zlagan maoshi: ${price}\n🌏 Ko'zlagan hududi: ${region}\n😇 Xohish-istak va maqsadi: ${info}`
      await elon.update({ elon_state: 'finish' })
    }
  })
  if (photo_path != '') {
    return await ctx.replyWithPhoto(
      { url: `${photo_path}` },
      {
        caption: ads,
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['✅ Tasdiqlash', '❌ Bekor qilish'],
          ['🏠 Bosh sahifa', "💁 E'lon berish tartibi"],
        ])
          .oneTime()
          .resize(),
      },
    )
  } else if (doc_path != '') {
    return await ctx.replyWithDocument(
      { url: `${doc_path}`, filename: file_name },
      {
        caption: ads,
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['✅ Tasdiqlash', '❌ Bekor qilish'],
          ['🏠 Bosh sahifa', "💁 E'lon berish tartibi"],
        ])
          .oneTime()
          .resize(),
      },
    )
  } else {
    return await ctx.reply(`${ads}\n\n<b>E'lon ma'qul bo'lsa "Tasdiqlash" tugmasini bosing!</b>`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([
        ['✅ Tasdiqlash', '❌ Bekor qilish'],
        ['🏠 Bosh sahifa', "💁 E'lon berish tartibi"],
      ])
        .oneTime()
        .resize(),
    })
  }
}

export async function menuTasdiqlashRus(ctx: Context) {
  let ads = ''
  let photo_path = ''
  let doc_path = ''
  let file_name = ''
  await Ads.findOne({
    where: { user_id: `${ctx?.from?.id}` },
    order: [['createdAt', 'DESC']],
  }).then(async (elon) => {
    if (elon) {
      const {
        category,
        name,
        phone,
        age,
        tg_link,
        call_time,
        technology,
        degree,
        work_place,
        work_time,
        region,
        info,
        price,
      } = elon.dataValues
      if (category === 'hodim')
        ads = `<b>ПОИСК СОТРУДНИКА:</b>\n\n🏦 Организация: ${name}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n⏳ Время работы: ${work_time}\n💵 Предлагаемая зарплата: ${price}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'ustoz')
        ads = `<b>ПОИСК НАСТАВНИКА:</b>\n\n🧑‍💻 Ученик: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Требуемые знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n💵 Плата за обучение: ${price}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'shogird')
        ads = `<b>ПОИСК УЧЕНИКА:</b>\n\n🧑‍💻 Наставник: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n💵 Плата за обучение: ${price}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'sherik')
        ads = `<b>ПОИСК ПАРТНЕРА:</b>\n\n🧑‍💻 Партнер: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n💵 Партнерский взнос: ${price}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'uquv_markazi')
        ads = `<b>ПОИСК УЧЕБНОГО ЦЕНТРА:</b>\n\n🧑‍💻 Слушатель: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n⏳ Удобный формат и время: ${work_time}\n💵 Платежеспособность: ${price}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'uquvchi')
        ads = `<b>УЧЕБНЫЙ ЦЕНТР ПРИГЛАШАЕТ:</b>\n\n🏦 УЧЕБНЫЙ ЦЕНТР: ${name}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Название курса: ${technology}\n📈 Продолжительность: ${degree}\n💵 Стоимость курса: ${price}\n🌏 Адрес: ${region}\n📍 Ориентир: ${work_place}\n😇 Доп. информация: ${info}`
      else if (category === 'loyiha')
        ads = `<b>ПОИСК ПРОЕКТА:</b>\n\n🧑‍💻 Специалист: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n🌏 Регион: ${region}\n😇 Доп. информация: ${info}`
      else if (category === 'erkin') {
        ads = `${info}`
        if (name === 'photo') photo_path = String(technology)
        if (name === 'doc') {
          doc_path = String(technology)
          file_name = String(degree)
        }
      } else
        ads = `<b>ПОИСК РАБОТЫ:</b>\n\n🧑‍💻 Кандидат: ${name}\n📆 Возраст: ${age}\n📞 Телефон: ${phone}\n✉️ Телеграм: @${tg_link}\n⏰ Время обратной связи: ${call_time}\n📚 Знания и навыки: ${technology}\n📈 Уровень: ${degree}\n🏦 Текущее место работы/учебы: ${work_place}\n⏳ Удобный формат и время: ${work_time}\n💵 Целевая зарплата: ${price}\n🌏 Предпочитаемый регион: ${region}\n😇 Доп. информация: ${info}`
      await elon.update({ elon_state: 'finish' })
    }
  })

  if (photo_path != '') {
    return await ctx.replyWithPhoto(
      { url: `${photo_path}` },
      {
        caption: ads,
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['✅ Подтвердить', '❌ Отменить публикацию'],
          ['🏠 Главная страница', '💁 Рекламная процедура'],
        ])
          .oneTime()
          .resize(),
      },
    )
  } else if (doc_path != '') {
    return await ctx.replyWithDocument(
      { url: `${doc_path}`, filename: file_name },
      {
        caption: ads,
        parse_mode: 'HTML',
        ...Markup.keyboard([
          ['✅ Подтвердить', '❌ Отменить публикацию'],
          ['🏠 Главная страница', '💁 Рекламная процедура'],
        ])
          .oneTime()
          .resize(),
      },
    )
  } else {
    return await ctx.reply(`${ads}\n\n<b>Если все ОК, нажмите «Подтвердить»</b>`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([
        ['✅ Подтвердить', '❌ Отменить публикацию'],
        ['🏠 Главная страница', '💁 Рекламная процедура'],
      ])
        .oneTime()
        .resize(),
    })
  }
}
