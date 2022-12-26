import { Composer } from "telegraf";
import { saveLang, selectLang } from "../libs/lang.js";
const composer = new Composer();
composer.hears('Tilni tanlash / Выбор языка', async (ctx) => {
    await selectLang(ctx);
});
composer.hears('Tilni tanlash', async (ctx) => {
    await selectLang(ctx);
});
composer.hears('Выбор языка', async (ctx) => {
    await selectLang(ctx);
});
composer.hears("🇺🇿 O'zbek tili", async (ctx) => {
    await saveLang(ctx, "UZB");
});
composer.hears("🇷🇺 Русский язык", async (ctx) => {
    await saveLang(ctx, 'RUS');
});
//# sourceMappingURL=settings.js.map