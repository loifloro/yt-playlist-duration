import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";

export const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
