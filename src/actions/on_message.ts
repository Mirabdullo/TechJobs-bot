import { User } from '../models/user.model.js'
import { Ads } from '../models/ads.model.js'
import { bot } from '../core/bot.js'
import { Composer } from 'telegraf'
import { getLang } from '../libs/lang.js'
import { menuTasdiqlash, menuTasdiqlashRus } from '../libs/confirm.js'
import { see_elon } from '../libs/see_ads.js'
const composer = new Composer()

composer.on('message', async (ctx) => {
  let lang = ''
  let tg_link = ''
  await User.findOne({ where: { user_id: `${ctx.from.id}` } }).then(async (user) => {
    if (!user) {
      await ctx.reply(`👉 "/start" `)
    } else {
      lang = user.dataValues.user_lang
      tg_link = user.dataValues.username
    }
  })

  let elon_state
  let selectedCategory

  const elon = await Ads.findOne({
    where: { user_id: `${ctx.from.id}` },
    order: [['createdAt', 'DESC']],
  })
  if (elon) {
    elon_state = elon.elon_state
    selectedCategory = elon.category

    if (elon_state == 'name') {
      if ('text' in ctx.message) {
        elon.name = ctx.message.text
        elon.tg_link = tg_link
        if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi') elon.elon_state = 'phone'
        else elon.elon_state = 'age'
        await elon.save()
        if (lang === 'UZB') {
          let txt = '<b>Yoshingizni kiriting:</b> (namuna: 25)'
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi')
            txt = '<b>Telefon raqamini kiriting:</b> (namuna: 931234567)'
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Введите свой возраст:</b> (обр.: 25)'
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi')
            txt = '<b>Введите номер телефона:</b> (обр.: 931234567)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') await ctx.replyWithHTML('<b>Familiya va ismingizni kiriting:</b>')
        else await ctx.replyWithHTML('<b>Введите свою фамилию и имя:</b>')
      }
    } else if (elon_state == 'age') {
      if ('text' in ctx.message) {
        if (isNaN(Number(ctx.message.text)) || parseInt(ctx.message.text) == 0) {
          if (lang === 'UZB') await ctx.replyWithHTML('<b>Yoshingizni kiriting:</b> (namuna: 25)')
          else await ctx.replyWithHTML('<b>Введите свой возраст:</b> (обр.: 25)')
        } else {
          elon.age = ctx.message.text
          elon.elon_state = 'phone'
          await elon.save()
          if (lang === 'UZB') await ctx.replyWithHTML('<b>Telefon raqamini kiriting:</b> (namuna: 931234567)')
          else await ctx.replyWithHTML('<b>Введите номер телефона:</b> (обр.: 931234567)')
        }
      } else {
        if (lang === 'UZB') await ctx.replyWithHTML('<b>Yoshingizni kiriting:</b> (namuna: 25)')
        else await ctx.replyWithHTML('<b>Введите свой возраст:</b> (обр.: 25)')
      }
    } else if (elon_state == 'phone') {
      if ('text' in ctx.message) {
        const res = ctx.message.text.replace(/[^.\d]/g, '')
        if (isNaN(Number(res)) || parseInt(res) == 0 || res.length != 9) {
          if (lang === 'UZB')
            await ctx.replyWithHTML("<b>Iltimos telefon raqamini to'g'ri kiriting (namuna: 931234567):</b>")
          else await ctx.replyWithHTML('<b>Пожалуйста, введите правильный номер телефона (обр.: 931234567):</b>')
        } else {
          elon.phone = ctx.message.text
          elon.elon_state = 'technology'
          await elon.save()
          if (lang === 'UZB') {
            let txt = "<b>Bilim va ko'nikmalaringizni kiriting:</b> (namuna: Python, PHP)"
            if (selectedCategory === 'hodim')
              txt = "<b>Kerakli bilim va ko'nikmalarni kiriting:</b> (namuna: Python, PHP)"
            else if (selectedCategory === 'ustoz')
              txt = "<b>Talab qilingan bilim va ko'nikmalar:</b> (namuna: Python, PHP)"
            else if (selectedCategory === 'uquvchi')
              txt = "<b>O'quv kursida o'rgatiladigan bilim va ko'nikmalarni kiriting:</b> (namuna: Python)"
            await ctx.replyWithHTML(txt)
          } else {
            let txt = '<b>Введите свои знания и навыки:</b> (обр.: Python, PHP)'
            if (selectedCategory === 'hodim') txt = '<b>Введите необходимые знания и навыки:</b> (обр.: Python, PHP)'
            else if (selectedCategory === 'ustoz') txt = 'Требуемые знания и навыки: (namuna: Python, PHP)'
            else if (selectedCategory === 'uquvchi')
              txt = '<b>Введите знания и навыки, которые будут преподавать в рамках учебного курса:</b> (обр.: Python)'

            await ctx.replyWithHTML(txt)
          }
        }
      } else {
        if (lang === 'UZB')
          await ctx.replyWithHTML("<b>Iltimos telefon raqamini to'g'ri kiriting (namuna: 931234567):</b>")
        else await ctx.replyWithHTML('<b>Пожалуйста, введите правильный номер телефона (обр.: 931234567):</b>')
      }
    } else if (elon_state == 'technology') {
      if ('text' in ctx.message) {
        elon.technology = ctx.message.text
        elon.elon_state = 'degree'
        await elon.save()
        if (lang === 'UZB') {
          let txt = '<b>Darajangiz:</b> (namuna: Middle)'
          if (selectedCategory === 'hodim') txt = '<b>Kerakli darajani kiriting:</b> (namuna: Middle)'
          else if (selectedCategory === 'ustoz') txt = '<b>Talab qilingan darajani kiriting:</b> (namuna: Middle)'
          else if (selectedCategory === 'uquvchi') txt = "<b>O'quv kursi davomiyligi:</b> (namuna: 3 oy)"

          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Введите уровень знаний:</b> (обр.: Middle)'
          if (selectedCategory === 'hodim' || selectedCategory === 'ustoz')
            txt = '<b>Требуемый уровень:</b> (обр.: Middle)'
          else if (selectedCategory === 'uquvchi') txt = '<b>Продолжительность курса:</b> (обр.: 3 месяца)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') {
          let txt = "<b>Bilim va ko'nikmalaringizni kiriting:</b> (namuna: Python, PHP)"
          if (selectedCategory === 'hodim')
            txt = "<b>Kerakli bilim va ko'nikmalarni kiriting:</b> (namuna: Python, PHP)"
          else if (selectedCategory === 'uquvchi')
            txt = "<b>O'quv kursida o'rgatiladigan bilim va ko'nikmalarni kiriting:</b> (namuna: Python)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Введите свои знания и навыки:</b> (обр.: Python, PHP)'
          if (selectedCategory === 'hodim') txt = '<b>Введите необходимые знания и навыки:</b> (обр.: Python, PHP)'
          else if (selectedCategory === 'uquvchi')
            txt = '<b>Введите знания и навыки, которые будут преподавать в рамках учебного курса:</b> (обр.: Python)'

          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'degree') {
      if ('text' in ctx.message) {
        elon.degree = ctx.message.text
        if (selectedCategory === 'hodim') elon.elon_state = 'work_time'
        else if (selectedCategory === 'uquvchi') elon.elon_state = 'price'
        else elon.elon_state = 'work_place'
        await elon.save()
        if (lang === 'UZB') {
          let txt = "<b>Hozirgi o'qish yoki ish joyingiz:</b> (namuna: GO IT Academy talabasi)"
          if (selectedCategory === 'hodim') txt = "Ish vaqti: (namuna: to'liq, masofadan)"
          else if (selectedCategory === 'uquvchi') txt = "<b>Kurs narxi:</b> (namuna: 700 000 so'm)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Ваше текущее место учебы или работы:</b> (обр.: Слушатель GO IT Academy)'
          if (selectedCategory === 'hodim') txt = 'Удобный формат и время: (обр.: удаленно, 9:00-19:00)'
          else if (selectedCategory === 'uquvchi') txt = 'Стоимость курса: (обр.: 700 000)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') {
          let txt = '<b>Darajangiz:</b> (namuna: Middle)'
          if (selectedCategory === 'hodim') txt = '<b>Kerakli darajani kiriting:</b> (namuna: Middle)'
          else if (selectedCategory === 'uquvchi') txt = "<b>O'quv kursi davomiyligi:</b> (namuna: 3 oy)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Введите уровень знаний:</b> (обр.: Middle)'
          if (selectedCategory === 'hodim') txt = '<b>Требуемый уровень:</b> (обр.: Middle)'
          else if (selectedCategory === 'uquvchi') txt = '<b>Продолжительность курса:</b> (обр.: 3 месяца)'
          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'work_place') {
      if ('text' in ctx.message) {
        elon.work_place = ctx.message.text
        if (selectedCategory === 'ustoz' || selectedCategory === 'shogird' || selectedCategory === 'sherik')
          elon.elon_state = 'price'
        else if (selectedCategory === 'uquvchi') elon.elon_state = 'call_time'
        else if (selectedCategory === 'loyiha') elon.elon_state = 'region'
        else elon.elon_state = 'work_time'
        await elon.save()

        if (lang === 'UZB') {
          let txt = "<b>Sizga ma'qul ish vaqti:</b> (namuna: to'liq, masofadan)"
          if (selectedCategory === 'ustoz' || selectedCategory === 'shogird')
            txt = 'Shogirdlik badali: (namuna: 300$ yoki tekin)'
          else if (selectedCategory === 'sherik') txt = 'Sheriklik badali: (namuna: 300$ yoki tekin)'
          else if (selectedCategory === 'uquv_markazi')
            txt = "<b>Sizga ma'qul o'qish vaqti:</b> (namuna: kechki payt, masofadan)"
          else if (selectedCategory === 'uquvchi') txt = "<b>Bog'lanish uchun qulay vaqt:</b> (namuna: 14:00-21:30)"
          else if (selectedCategory === 'loyiha') txt = '<b>Viloyatni kiriting:</b> (namuna: Toshkent)'
          await ctx.replyWithHTML(txt)
        } else {
          let txt = 'Удобный формат и время: (обр.: удаленно, 9:00-19:00)'
          if (selectedCategory === 'ustoz' || selectedCategory === 'shogird')
            txt = 'Плата за обучение: (обр.: 300$ или бесплатно)'
          else if (selectedCategory === 'sherik') txt = 'Партнерский взнос: (обр.: 300$ или бесплатно)'
          else if (selectedCategory === 'uquv_markazi') txt = 'Удобный формат и время: (обр.: вечером)'
          else if (selectedCategory === 'uquvchi') txt = '<b>Время для обратной связи:</b> (обр.: 14:00–21:30)'
          else if (selectedCategory === 'loyiha') txt = 'Регион: (обр.: Ташкент)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') {
          let txt = "<b>Hozirgi o'qish yoki ish joyingiz:</b> (namuna: GO IT Academy talabasi)"
          if (selectedCategory === 'uquvchi') txt = "Mo'ljal:"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Ваше текущее место учебы или работы:</b> (обр.: Слушатель GO IT Academy)'
          if (selectedCategory === 'uquvchi') txt = 'Ориентир:'
          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'work_time') {
      if ('text' in ctx.message) {
        elon.work_time = ctx.message.text
        elon.elon_state = 'price'
        await elon.save()
        if (lang === 'UZB') {
          let txt = "<b>Ko'zlagan maoshingiz:</b> (namuna: 500-600$)"
          if (selectedCategory === 'hodim') txt = 'Maosh: (namuna: 500-600$)'
          else if (selectedCategory === 'uquv_markazi')
            txt = "<b>To'lov imkoniyatingiz:</b> (namuna: 500 000 - 1 000 000 so'm)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Желаемая зарплата:</b> (обр.: 500-600$)'
          if (selectedCategory === 'hodim') txt = 'Предлагаемая зарплата: (обр.: 500-600$)'
          else if (selectedCategory === 'uquv_markazi')
            txt = '<b>Ваша платежеспособность:</b> (обр.: 500 000 - 1 000 000)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') await ctx.replyWithHTML("Ish vaqti: (namuna: to'liq, masofadan)")
        else await ctx.replyWithHTML('Время работы: (обр.: удаленно, 9:00-19:00)')
      }
    } else if (elon_state == 'price') {
      if ('text' in ctx.message) {
        elon.price = ctx.message.text
        elon.elon_state = 'region'
        await elon.save()

        if (lang === 'UZB') {
          let txt = "<b>Ishlamoqchi bo'lgan viloyatingiz:</b> (namuna: Toshkent)"
          if (
            selectedCategory === 'hodim' ||
            selectedCategory === 'ustoz' ||
            selectedCategory === 'shogird' ||
            selectedCategory === 'sherik' ||
            selectedCategory === 'uquv_markazi'
          )
            txt = '<b>Viloyatni kiriting:</b> (namuna: Toshkent)'
          else if (selectedCategory === 'uquvchi')
            txt = "<b>O'quv markazi manzilini kiriting:</b> (namuna: Toshkent sh., Mustaqillik shox ko'chasi, 29-uy)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Предпочитаемый регион работы:</b> (обр.: Ташкент)'
          if (
            selectedCategory === 'hodim' ||
            selectedCategory === 'ustoz' ||
            selectedCategory === 'shogird' ||
            selectedCategory === 'sherik' ||
            selectedCategory === 'uquv_markazi'
          )
            txt = 'Регион: (обр.: Ташкент)'
          else if (selectedCategory === 'uquvchi')
            txt = '<b>Введите адрес учебного центра: </b> (обр.: г. Ташкент, проспект Мустакиллик, 29)'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') {
          let txt = "<b>Ko'zlagan maoshingiz:</b> (namuna: 500-600$)"
          if (selectedCategory === 'hodim') txt = 'Maosh: (namuna: 500-600$)'
          else if (selectedCategory === 'ustoz' || selectedCategory === 'shogird')
            txt = 'Shogirdlik badali: (namuna: 300$ yoki tekin)'
          else if (selectedCategory === 'sherik') txt = 'Sheriklik badali: (namuna: 300$ yoki tekin)'
          else if (selectedCategory === 'uquv_markazi')
            txt = "<b>To'lov imkoniyatingiz:</b> (namuna: 500 000 - 1 000 000 so'm)"
          else if (selectedCategory === 'uquvchi') txt = "<b>Kurs narxi:</b> (namuna: 700 000 so'm)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Желаемая зарплата:</b> (обр.: 500-600$)'
          if (selectedCategory === 'hodim') txt = 'Предлагаемая зарплата: (обр.: 500-600$)'
          else if (selectedCategory === 'ustoz' || selectedCategory === 'shogird')
            txt = 'Плата за обучение: (обр.: 300$ или бесплатно)'
          else if (selectedCategory === 'sherik') txt = 'Партнерский взнос: (обр.: 300$ или бесплатно)'
          else if (selectedCategory === 'uquv_markazi')
            txt = '<b>Ваша платежеспособность:</b> (обр.: 500 000 - 1 000 000)'
          else if (selectedCategory === 'uquvchi') txt = 'Стоимость курса: (обр.: 700 000)'
          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'region') {
      if ('text' in ctx.message) {
        elon.region = ctx.message.text
        if (selectedCategory === 'uquvchi') elon.elon_state = 'work_place'
        else elon.elon_state = 'call_time'
        await elon.save()
        if (lang === 'UZB') {
          let txt = "<b>Bog'lanish uchun qulay vaqt:</b> (namuna: 14:00-21:30)"
          if (selectedCategory === 'uquvchi') txt = "Mo'ljal: (namuna: Hamid Olimjon metrosi, Kitob Olami)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Время для обратной связи:</b> (обр.: 14:00–21:30)'
          if (selectedCategory === 'uquvchi') txt = 'Ориентир:'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') {
          let txt = '<b>Viloyatni kiriting:</b> (namuna: Toshkent)'
          if (selectedCategory === 'uquvchi')
            txt = "<b>O'quv markazi manzilini kiriting:</b> (namuna: Toshkent sh., Mustaqillik shox ko'chasi, 29-uy)"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = 'Регион: (обр.: Ташкент)'
          if (selectedCategory === 'uquvchi')
            txt = '<b>Введите адрес учебного центра: </b> (обр.: г. Ташкент, проспект Мустакиллик, 29)'
          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'call_time') {
      if ('text' in ctx.message) {
        elon.call_time = ctx.message.text
        elon.elon_state = 'info'
        await elon.save()
        if (lang === 'UZB') {
          let txt = '<b>Xohish-istaklar va maqsadingizni yoritib bering:</b> '
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi')
            txt = "<b>Qo'shimcha ma'lumotlarni kiriting:</b>"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Дополнительная информация:</b>'
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi') txt = '<b>Дополнительная информация:</b>'
          await ctx.replyWithHTML(txt)
        }
      } else {
        if (lang === 'UZB') await ctx.replyWithHTML("<b>Bog'lanish uchun qulay vaqt:</b> (namuna: 14:00-21:30)")
        else await ctx.replyWithHTML('<b>Время для обратной связи:</b> (обр.: 14:00–21:30)')
      }
    } else if (elon_state == 'info') {
      if ('text' in ctx.message) {
        elon.info = ctx.message.text
        elon.elon_state = 'finish'
        await elon.save()
        if (lang === 'UZB') {
          await ctx.replyWithHTML("E'lon ma'lumotlarini kiritish yakunlandi!")
          await menuTasdiqlash(ctx)
        } else {
          await ctx.replyWithHTML('Ввод данных объявления завершен!')
          await menuTasdiqlash(ctx)
        }
      } else {
        if (lang === 'UZB') {
          let txt = '<b>Xohish-istaklar va maqsadingizni yoritib bering:</b> '
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi')
            txt = "<b>Qo'shimcha ma'lumotlarni kiriting:</b>"
          await ctx.replyWithHTML(txt)
        } else {
          let txt = '<b>Дополнительная информация:</b>'
          if (selectedCategory === 'hodim' || selectedCategory === 'uquvchi') txt = '<b>Дополнительная информация:</b>'
          await ctx.replyWithHTML(txt)
        }
      }
    } else if (elon_state == 'erkin') {
      if ('text' in ctx.message) {
        elon.info = ctx.message.text
        elon.name = 'text'
        elon.tg_link = tg_link
        elon.elon_state = 'finish'
        await elon.save()
        if (lang === 'UZB') {
          await ctx.replyWithHTML("E'lon ma'lumotlarini kiritish yakunlandi!")
          await menuTasdiqlash(ctx)
        } else {
          await ctx.replyWithHTML('Ввод данных объявления завершен!')
          await menuTasdiqlashRus(ctx)
        }
      } else if ('photo' in ctx.message) {
        const photo_link = await bot.telegram.getFileLink(ctx.message.photo[ctx.message.photo.length - 1].file_id)
        elon.technology = photo_link.href
        elon.info = String(ctx.message.caption)
        elon.name = 'photo'
        elon.tg_link = tg_link
        elon.elon_state = 'finish'
        await elon.save()
        if (lang === 'UZB') {
          await ctx.replyWithHTML("E'lon ma'lumotlarini kiritish yakunlandi!")
          await menuTasdiqlash(ctx)
        } else {
          await ctx.replyWithHTML('Ввод данных объявления завершен!')
          await menuTasdiqlashRus(ctx)
        }
      } else if ('document' in ctx.message) {
        const doc_link = await bot.telegram.getFileLink(ctx.message.document.file_id)
        elon.technology = doc_link.href
        elon.info = String(ctx.message.caption)
        elon.degree = String(ctx.message.document.file_name)
        elon.name = 'doc'
        elon.tg_link = tg_link
        elon.elon_state = 'finish'
        await elon.save()
        if (lang === 'UZB') {
          await ctx.replyWithHTML("E'lon ma'lumotlarini kiritish yakunlandi!")
          await menuTasdiqlash(ctx)
        } else {
          await ctx.replyWithHTML('Ввод данных объявления завершен!')
          await menuTasdiqlashRus(ctx)
        }
      }
    }
  }
})

composer.action(/.+/, async (ctx) => {
  const message = ctx.match[0]
  if (message.slice(0, 2) == 'ok') {
    const elon = await Ads.findOne({
      where: { id: `${message.slice(3, message.length)}` },
    })
    if (elon) {
      const lang = await getLang(String(elon.user_id))
      let msgText
      let ads = ''
      let photo_path = ''
      let doc_path = ''
      let file_name = ''
      // const tg = '\nTelegram: '
      if (lang === 'UZB') {
        msgText = `Tabriklayman! Ushbu e'lon operator tomonidan ma'qullandi! `
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
      } else {
        msgText = `Поздравляю! Данная объявления одобрена оператором!`
        if (elon.category === 'hodim')
          ads = `<b>ПОИСК СОТРУДНИКА:</b>\n\n🏦 Организация: ${elon.name}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n⏳ Время работы: ${elon.work_time}\n💵 Предлагаемая зарплата: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'ustoz')
          ads = `<b>ПОИСК НАСТАВНИКА:</b>\n\n🧑‍💻 Ученик: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Требуемые знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'shogird')
          ads = `<b>ПОИСК УЧЕНИКА:</b>\n\n🧑‍💻 Наставник: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'sherik')
          ads = `<b>ПОИСК ПАРТНЕРА:</b>\n\n🧑‍💻 Партнер: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Партнерский взнос: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'uquv_markazi')
          ads = `<b>ПОИСК УЧЕБНОГО ЦЕНТРА:</b>\n\n🧑‍💻 Слушатель: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобный формат и время: ${elon.work_time}\n💵 Платежеспособность: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
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
          ads = `<b>ПОИСК РАБОТЫ:</b>\n\n🧑‍💻 Кандидат: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобный формат и время: ${elon.work_time}\n💵 Целевая зарплата: ${elon.price}\n🌏 Предпочитаемый регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      }

      let post
      if (photo_path != '') {
        if (ads.length < 950) {
          ads += `\n\n👍 @UzbekDev_IT_Jobs`
          ads += `\n\n🤖 @UzbekDev_IT_Jobs_Bot`
        }
        post = await ctx.telegram.sendPhoto(
          String(process.env.CHANEL),
          { url: photo_path },
          {
            caption: ads,
            parse_mode: 'HTML',
          },
        )
        ctx.editMessageCaption('Tasdiqlandi')
      } else if (doc_path != '') {
        if (ads.length < 950) {
          ads += `\n\n👍 @UzbekDev_IT_Jobs`
          ads += `\n\n🤖 @UzbekDev_IT_Jobs_Bot`
        }
        post = await ctx.telegram.sendDocument(
          String(process.env.CHANEL),
          { url: doc_path, filename: file_name },
          {
            caption: ads,
            parse_mode: 'HTML',
          },
        )
        ctx.editMessageCaption('Tasdiqlandi')
      } else {
        ads += `\n\n👍 @UzbekDev_IT_Jobs`
        ads += `\n\n🤖 @UzbekDev_IT_Jobs_Bot`

        post = await ctx.telegram.sendMessage(String(process.env.CHANEL), ads, {
          parse_mode: 'HTML',
        })
        ctx.editMessageText('Tasdiqlandi')
      }

      await ctx.telegram.sendMessage(`${elon.user_id}`, `${msgText} https://t.me/UzbekDev_IT_Jobs/${post.message_id}`, {
        parse_mode: 'HTML',
      })
      elon.post_id = String(post.message_id)
      await elon.save()
    }
  } else if (message.slice(0, 2) == 'no') {
    const elon = await Ads.findOne({
      where: { id: `${message.slice(3, message.length)}` },
    })

    if (elon) {
      const lang = await getLang(String(elon.user_id))
      let ads = ''
      let msgText
      let photo_path = ''
      let doc_path = ''
      let file_name = ''
      // let tg = '\nTelegram: '
      if (lang === 'UZB') {
        msgText = `Afsus! Usbu e'lon operator tomonidan ma'qullanmadi. Ma'lumotlarni to'g'rilab qayta yuboring!`
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
      } else {
        msgText = `Данное объявление не одобрено оператором! `
        if (elon.category === 'hodim')
          ads = `<b>ПОИСК СОТРУДНИКА:</b>\n\n🏦 Организация: ${elon.name}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n⏳ Время работы: ${elon.work_time}\n💵 Предлагаемая зарплата: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'ustoz')
          ads = `<b>ПОИСК НАСТАВНИКА:</b>\n\n🧑‍💻 Ученик: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Требуемые знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'shogird')
          ads = `<b>ПОИСК УЧЕНИКА:</b>\n\n🧑‍💻 Наставник: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Плата за обучение: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'sherik')
          ads = `<b>ПОИСК ПАРТНЕРА:</b>\n\n🧑‍💻 Партнер: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n💵 Партнерский взнос: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
        else if (elon.category === 'uquv_markazi')
          ads = `<b>ПОИСК УЧЕБНОГО ЦЕНТРА:</b>\n\n🧑‍💻 Слушатель: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобный формат и время: ${elon.work_time}\n💵 Платежеспособность: ${elon.price}\n🌏 Регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
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
          ads = `<b>ПОИСК РАБОТЫ:</b>\n\n🧑‍💻 Кандидат: ${elon.name}\n📆 Возраст: ${elon.age}\n📞 Телефон: ${elon.phone}\n✉️ Телеграм: @${elon.tg_link}\n⏰ Время обратной связи: ${elon.call_time}\n📚 Знания и навыки: ${elon.technology}\n📈 Уровень: ${elon.degree}\n🏦 Текущее место работы/учебы: ${elon.work_place}\n⏳ Удобный формат и время: ${elon.work_time}\n💵 Целевая зарплата: ${elon.price}\n🌏 Предпочитаемый регион: ${elon.region}\n😇 Доп. информация: ${elon.info}`
      }
      if (photo_path != '') {
        await ctx.telegram.sendPhoto(
          `${elon.user_id}`,
          { url: photo_path },
          {
            caption: ads,
            parse_mode: 'HTML',
          },
        )
        ctx.editMessageCaption('Inkor qilindi')
      } else if (doc_path != '') {
        await ctx.telegram.sendDocument(
          `${elon.user_id}`,
          { url: doc_path, filename: file_name },
          {
            caption: ads,
            parse_mode: 'HTML',
          },
        )
        ctx.editMessageCaption('Inkor qilindi')
      } else {
        await ctx.telegram.sendMessage(`${elon.user_id}`, ads, {
          parse_mode: 'HTML',
        })
        ctx.editMessageText('Inkor qilindi')
      }
      await ctx.telegram.sendMessage(`${elon.user_id}`, msgText)
    }

    // ctx.editMessageText('Inkor qilindi')
  } else if (message.slice(0, 3) == 'del') {
    const elon = await Ads.findOne({
      where: { id: `${message.slice(4, message.length)}` },
    })
    const lang = await getLang(String(ctx?.from?.id))
    if (!elon) {
      if (lang === 'UZB') await ctx.reply(`Bu elon avval o'chirilgan`)
      else await ctx.reply(`Это объявление ранее удалено`)
    } else {
      if (elon.post_id != null) {
        try {
          await ctx.telegram.deleteMessage(String(process.env.CHANEL), Number(elon.post_id))
        } catch (error) {
          console.log(error)
        }
      }

      await Ads.destroy({ where: { id: `${elon.id}` } })
      if (lang === 'UZB') await ctx.reply(`E'lon o'chirildi`)
      else await ctx.reply(`Объявление удалено`)
    }
  } else if (message.slice(0, 6) == 'offset') {
    const result = message.split(' ')
    // let line1 = result[0].toString()
    await see_elon(
      ctx,
      result[1].slice(4, result[1].length),
      result[2].slice(5, result[2].length),
      Number(result[0].slice(7, result[0].length)),
    )
  }
})

bot.use(composer.middleware())
