from app import *
from app.models import Category

with app.app_context():
    db.drop_all()
    db.create_all()
    db.session.commit()

categories = ['Clothes', 'Shoes', 'Bags', 'Beauty & Personal Care', 'Fashion Accessories', 'Computers & Laptops', 'Mobile & Gadgets', 'Food & Beverages', 'Home Appliances']
with app.app_context():
    for cat in categories:
        item = Category(category_name=cat)
        db.session.add(item)
    db.session.commit()

# ERROR [flask_migrate] Error: Can't locate revision identified by '041b9fffbdde'
# in mysql shell
# delete from alembic_version;