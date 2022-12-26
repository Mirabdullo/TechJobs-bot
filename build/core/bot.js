import { Telegraf } from 'telegraf';
import { sequelize } from './db.js';
const token = String(process.env.BOT_TOKEN);
export const bot = new Telegraf(token);
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    }
    catch (error) {
        console.log("DB ERROR");
        console.log(error);
    }
};
start();
bot.launch();
//# sourceMappingURL=bot.js.map