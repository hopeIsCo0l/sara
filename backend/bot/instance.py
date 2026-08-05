from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from config import settings
from bot.middlewares import AdminAuthMiddleware
from bot.handlers import admin, product_admin, service_admin

def create_bot_and_dp():
    bot = Bot(token=settings.BOT_TOKEN)
    dp = Dispatcher(storage=MemoryStorage())

    # Register Admin Security Middleware
    dp.message.outer_middleware(AdminAuthMiddleware())
    dp.callback_query.outer_middleware(AdminAuthMiddleware())

    # Include Router Handlers safely
    for r in [admin.router, product_admin.router, service_admin.router]:
        if r.parent_router is None:
            dp.include_router(r)

    return bot, dp
