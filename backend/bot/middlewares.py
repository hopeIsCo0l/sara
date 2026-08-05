from typing import Callable, Dict, Any, Awaitable
from aiogram import BaseMiddleware
from aiogram.types import Message, CallbackQuery
from config import settings

class AdminAuthMiddleware(BaseMiddleware):
    """Middleware checking if user Telegram ID is authorized to access admin features."""
    
    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message | CallbackQuery,
        data: Dict[str, Any]
    ) -> Any:
        user = event.from_user
        if not user:
            return

        allowed_ids = settings.admin_id_list

        # If no allowed IDs specified in env, allow access in dev mode but log warning
        if not allowed_ids:
            return await handler(event, data)

        if user.id not in allowed_ids:
            msg_text = f"⛔ ACCESS DENIED: Telegram ID {user.id} is not authorized for KITH Admin Desk."
            if isinstance(event, Message):
                await event.answer(msg_text)
            elif isinstance(event, CallbackQuery):
                await event.answer(msg_text, show_alert=True)
            return

        return await handler(event, data)
