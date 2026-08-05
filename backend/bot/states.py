from aiogram.fsm.state import State, StatesGroup

class ProductForm(StatesGroup):
    waiting_for_name = State()
    waiting_for_category = State()
    waiting_for_price = State()
    waiting_for_sku = State()
    waiting_for_description = State()
    waiting_for_material = State()
    waiting_for_photo = State()
    waiting_for_stock = State()

class EditProductForm(StatesGroup):
    waiting_for_search = State()
    select_product = State()
    select_field = State()
    waiting_for_new_value = State()

class CategoryForm(StatesGroup):
    waiting_for_name = State()
    waiting_for_description = State()

class ServiceForm(StatesGroup):
    waiting_for_title = State()
    waiting_for_description = State()
    waiting_for_price_range = State()
