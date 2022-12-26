import { Markup } from 'telegraf'

export const keyboards = {
  inline_menu_elon_berish_rus: Markup.inlineKeyboard([
    [Markup.button.callback('ОБЪЯВЛЕНИЕ ПО ШАБЛОНУ', 'andoza')],
    [Markup.button.callback('ОБЪЯВЛЕНИЕ В СВОБОДНОЙ ФОРМЕ', 'erkin')],
  ]),

  inline_menu_elon_berish: Markup.inlineKeyboard([
    [Markup.button.callback("ANDOZA ASOSIDA E'LON BERISH", 'andoza')],
    [Markup.button.callback("ERKIN SHAKLDA E'LON BERISH", 'erkin')],
  ]),

  inline_menu_elon_kurish_rus: Markup.inlineKeyboard([
    [Markup.button.callback('ОБЪЯВЛЕНИЕ ПО ШАБЛОНУ', 'andoza1')],
    [Markup.button.callback('ОБЪЯВЛЕНИЕ В СВОБОДНОЙ ФОРМЕ', 'erkin1')],
  ]),

  inline_menu_elon_kurish: Markup.inlineKeyboard([
    [Markup.button.callback("ANDOZA ASOSIDA E'LON BERGANLAR", 'andoza1')],
    [Markup.button.callback("ERKIN SHAKLDA E'LON BERGANLAR", 'erkin1')],
  ]),

  inline_andoza: Markup.inlineKeyboard([
    [Markup.button.callback('ISH QIDIRISH', 'ish')],
    [Markup.button.callback('HODIM QIDIRISH', 'hodim')],
    [Markup.button.callback('USTOZ QIDIRISH', 'ustoz')],
    [Markup.button.callback('SHOGIRD QIDIRISH', 'shogird')],
    [Markup.button.callback('SHERIK QIDIRISH', 'sherik')],
    [Markup.button.callback("O'QUV MARKAZI QIDIRISH", 'uquv_markazi')],
    [Markup.button.callback("O'QUV MARKAZIGA O'QUVCHI QIDIRISH", 'uquvchi')],
    [Markup.button.callback('LOYIHA QIDIRISH', 'loyiha')],
    [Markup.button.callback('ASOSIY SAHIFAGA QAYTISH', 'asosiy')],
  ]),
  inline_andoza_rus: Markup.inlineKeyboard([
    [Markup.button.callback('ПОИСК РАБОТЫ', 'ish')],
    [Markup.button.callback('ПОИСК СОТРУДНИКОВ', 'hodim')],
    [Markup.button.callback('ПОИСК НАСТАВНИКА', 'ustoz')],
    [Markup.button.callback('ПОИСК УЧЕНИКА', 'shogird')],
    [Markup.button.callback('ПОИСК ПАРТНЕРА', 'sherik')],
    [Markup.button.callback('ПОИСК УЧЕБНОГО ЦЕНТРА', 'uquv_markazi')],
    [Markup.button.callback('ПОИСК СЛУШАТЕЛЯ для УЦ', 'uquvchi')],
    [Markup.button.callback('ПОИСК ПРОЕКТА для участия', 'loyiha')],
    [Markup.button.callback('ВЕРНУТЬСЯ НА ГЛАВНУЮ СТРАНИЦУ', 'asosiy')],
  ]),

  inline_andoza_kurish: Markup.inlineKeyboard([
    [Markup.button.callback('ISH QIDIRAYOTGANLAR', 'ish1')],
    [Markup.button.callback('HODIM QIDIRAYOTGANLAR', 'hodim1')],
    [Markup.button.callback('USTOZ QIDIRAYOTGANLAR', 'ustoz1')],
    [Markup.button.callback('SHOGIRD QIDIRAYOTGANLAR', 'shogird1')],
    [Markup.button.callback('SHERIK QIDIRAYOTGANLAR', 'sherik1')],
    [Markup.button.callback("O'QUV MARKAZI QIDIRAYOTGANLAR", 'uquv_markazi1')],
    [Markup.button.callback("O'QUV MARKAZIGA O'QUVCHI QIDIRAYOTGANLAR", 'uquvchi1')],
    [Markup.button.callback('LOYIHA QIDIRAYOTGANLAR', 'loyiha1')],
    [Markup.button.callback('ASOSIY SAHIFAGA QAYTISH', 'asosiy1')],
  ]),
  inline_andoza_kurish_rus: Markup.inlineKeyboard([
    [Markup.button.callback('ТЕ, КТО ИЩЕТ РАБОТУ', 'ish1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ СОТРУДНИКА', 'hodim1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ НАСТАВНИКА', 'ustoz1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ УЧЕНИКА', 'shogird1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ ПАРТНЕРА', 'sherik1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ УЧЕБНОГО ЦЕНТРА', 'uquv_markazi1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ СЛУШАТЕЛЯ', 'uquvchi1')],
    [Markup.button.callback('ТЕ, КТО ИЩЕТ ПРОЕКТА', 'loyiha1')],
    [Markup.button.callback('ВЕРНУТЬСЯ НА ГЛАВНУЮ СТРАНИЦУ', 'asosiy1')],
  ]),
}
