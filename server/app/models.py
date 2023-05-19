from app import db, ma, bcrypt
import datetime
from sqlalchemy.ext.associationproxy import association_proxy

class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    cart = db.relationship('Cart', uselist=False, backref='owner')
    store = db.relationship('Store', uselist=False, backref='owner') 
    transactions = db.relationship('Transaction', backref='buyer')

    username = db.Column(db.String(length=24), nullable=False, unique=True)
    email_address = db.Column(db.String(length=50), unique = True, nullable=False)
    password_hash = db.Column(db.String(length=60), nullable=False)
    balance = db.Column(db.Integer(), nullable=False, default=0)
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    @property
    def password(self):
        return self.password
    
    @password.setter
    def password(self, plain_text_password):
        self.password_hash = bcrypt.generate_password_hash(plain_text_password).decode('utf-8')

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'firstname', 'lastname' ,'email_address', 'balance', 'time_created','last_updated')
user_schema = UserSchema()

# ------------------------------------------------------ #

class CartSubproduct(db.Model):
    cart_id = db.Column('cart_id', db.Integer(), db.ForeignKey('cart.id'), primary_key=True)
    subproduct_id = db.Column('subproduct_id', db.Integer, db.ForeignKey('subproduct.id'), primary_key=True)

    cart = db.relationship('Cart', back_populates='subproduct_association')
    subproduct = db.relationship('Subproduct', back_populates='cart_association')

    quantity = db.Column(db.Integer(), nullable=False)
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    __table_args__ = (
        db.PrimaryKeyConstraint(cart_id, subproduct_id),
    )

   
# ------------------------------------------------------ #

class Cart(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), unique=True, nullable=False)

    subproduct_association = db.relationship('CartSubproduct', back_populates='cart', cascade="all, delete-orphan")
    subproducts = association_proxy('subproduct_association', 'subproduct')

    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CartSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time_created','last_updated')
cart_schema = CartSchema()

# ------------------------------------------------------ #

class Subproduct(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    onsale = db.relationship('Onsale', uselist=False, backref='subproduct')

    cart_association = db.relationship('CartSubproduct', back_populates='subproduct', cascade="all, delete-orphan")
    carts = association_proxy('cart_association','cart')

    variation = db.Column(db.String(length=50), nullable=False)
    stock = db.Column(db.Integer(), nullable=False)
    price = db.Column(db.Integer(), nullable=False)
    # pic_url = db.Column(db.String(2048))

    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class SubproductSchema(ma.Schema):
    class Meta:
        fields = ('id', 'product_id', 'variation', 'stock', 'price', 'time_created','last_updated')
subproduct_schema = SubproductSchema()
subproducts_schema = SubproductSchema(many=True)

# ------------------------------------------------------ #

# class TransactionProduct(db.Model):
#     ของทุกชิ้นซื้อพร้อมกันที่อยู่ในร้านเดียวกัน -> transaction เดียวกัน
#       transaction แยกตามร้าน เหมือนให้ส่งพร้อมกัน

#     id = db.Column(db.Integer(), primary_key=True)
#     transaction_id = db.Column('transaction_id', db.Integer, db.ForeignKey('transaction.id'))
#     product_id = db.Column('product_id', db.Integer, db.ForeignKey('product.id'))
#     subproduct_id = db.Column('subproduct_id', db.Integer, db.ForeignKey('subproduct.id'))
    
#     transaction = db.relationship('Transaction', back_populates='product_association')
#     product = db.relationship('Product', back_populates='transaction_association')

#     product_name = db.Column(db.String(length=30), nullable=False)  # duplicate
#     variation = db.Column(db.String(length=50), nullable=False)     # duplicate
#     purchase_price = db.Column(db.Integer(), nullable=False)        # duplicate
#     quantity = db.Column(db.Integer, nullable=False)
#     time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
#     last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


# ------------------------------------------------------ #

class Transaction(db.Model):
#   1 transaction ต่อ 1 subproduct
    id = db.Column(db.Integer(), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)

    product_id = db.Column('product_id', db.Integer, db.ForeignKey('product.id'))
    subproduct_id = db.Column('subproduct_id', db.Integer, db.ForeignKey('subproduct.id'))
    # product_association = db.relationship('TransactionProduct', back_populates='transaction')
    # products = association_proxy('product_association', 'product')

    product_name = db.Column(db.String(length=30), nullable=False)  # duplicate
    variation = db.Column(db.String(length=50), nullable=False)     # duplicate
    purchase_price = db.Column(db.Integer(), nullable=False)        # duplicate
    quantity = db.Column(db.Integer, nullable=False)

    receiver = db.Column(db.String(length=60)) #, nullable=False)
    shipping_address = db.Column(db.String(length=500)) #, nullable=False)
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class TransactionSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time_created','last_updated')
transaction_schema = TransactionSchema()

# ------------------------------------------------------ #

class Product(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('store.id'), nullable=False)

    subproducts = db.relationship('Subproduct', backref='product',cascade="all, delete-orphan")
    images = db.relationship('ProductImage', backref='product', cascade="all, delete-orphan")

    # transaction_association = db.relationship('TransactionProduct', back_populates='product')
    # transactions = association_proxy('transaction_association','transaction')

    product_name = db.Column(db.String(length=30), nullable=False)
    description = db.Column(db.String(400), nullable=False)

    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
class ProductSchema(ma.Schema):
    class Meta:
        fields = ('id','product_name', 'description','pic_url','time_created','last_updated')
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

# ------------------------------------------------------ #


class Category(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    products = db.relationship('Product', backref='category') # must be change

    category_name = db.Column(db.String(length=30), unique=True, nullable=False)
    # pic_url = db.Column(db.String(2048))
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CategorySchema(ma.Schema):
    class Meta:
        fields = ('id', 'time_created','last_updated')
category_schema = CategorySchema()


# ------------------------------------------------------ #

class Onsale(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    subproduct_id = db.Column(db.Integer, db.ForeignKey('subproduct.id'), nullable=False, unique=True)

    onsale_price = db.Column(db.Integer(), nullable=False)
    expire_at = db.Column(db.DateTime(), nullable=False)
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class OnsaleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'time_created','last_updated')
onsale_schema = OnsaleSchema()

# ------------------------------------------------------ #

class Store(db.Model):
    id = db.Column(db.Integer(), primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    products = db.relationship('Product', backref='store')
    transactions = db.relationship('Transaction', backref='seller')

    store_name = db.Column(db.String(length=30), nullable=False)
    pic_url = db.Column(db.String(2048))
    description = db.Column(db.String(1000))
    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class StoreSchema(ma.Schema):
    class Meta:
        fields = ('id', 'store_name', 'pic_url','description', 'time_created','last_updated')
store_schema = StoreSchema()


class ProductImage(db.Model):

    id = db.Column(db.Integer(), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)

    url = db.Column(db.String(2048), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    isDefault = db.Column(db.Boolean, default=True)

    time_created = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow)
    last_updated = db.Column(db.DateTime(), nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ProductImageSchema(ma.Schema):
    class Meta:
        fields = ('id', 'url', 'title','isDefault', 'time_created','last_updated')
productimages_schema = ProductImageSchema(many=True)


# ------------------------------------------------------ #