import { Markup } from 'telegraf';
import { User } from '../models/user.model.js';
export async function getLang(user_id) {
    let lang = 'UZB';
    await User.findOne({ where: { user_id: `${user_id}` } }).then((user) => {
        if (user) {
            lang = user.dataValues.user_lang;
        }
    });
    return lang;
}
export async function selectLang(ctx) {
    return await ctx.reply('<b>Tilni tanlang / Виберите язык</b>', {
        parse_mode: 'HTML',
        ...Markup.keyboard([['Ozbek tili', 'Rus tili']])
            .oneTime()
            .resize(),
    });
}
export async function saveLang(ctx, lang) {
    var _a;
    const user_id = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.from) === null || _a === void 0 ? void 0 : _a.id;
    await User.findOne({ where: { user_id: `${user_id}` } }).then(async (user) => {
        if (!user) {
            await selectLang(ctx);
        }
        else {
            await user.update({ user_lang: lang });
            if (lang === 'UZB') {
                await ctx.reply('<b>Bosh sahifa</b>', {
                    parse_mode: 'HTML',
                    ...Markup.keyboard([['Elonlarni korish', 'Elon berish']])
                        .oneTime()
                        .resize(),
                });
            }
            else if (lang === 'RUS') {
                await ctx.reply('<b>Glavnaya stranitsa</b>', {
                    parse_mode: 'HTML',
                    ...Markup.keyboard([['Posmotrite obyavleniya', 'Podat zayavleniya']])
                        .oneTime()
                        .resize(),
                });
            }
        }
    });
}
//# sourceMappingURL=lang.js.map