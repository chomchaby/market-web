from app import app
from flask import jsonify,request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Product, Category, Store
from app.models import product_schema, subproducts_schema, productimages_schema

@app.route('/api')
@app.route('/api/home', methods = ['GET'])
def home_page():
    print('Received GET request for /api/home')
    print("authorization : " + request.headers['Authorization'])
    print("cookie : " +request.cookies.get('refresh_token_cookie'))
    
    return jsonify({'Hello':'World'})

@app.route('/api/products/category=<category_name>/maxprice=<max_price>/sort=<sort>', methods = ['GET'])

def home_products(category_name, max_price, sort):
    print('Received GET request for /api/home/products/category/')
    print(category_name, max_price, sort)

    category_id = Category.query.filter_by(category_name=category_name).first().id
    if category_id == None:
            return jsonify({'message':'Category does not exist'}), 404
    
    candidate_products = Product.query.filter_by(category_id=category_id)
    
    products = []
    for pro in candidate_products:
        price_min  = 1000_000_000; price_max = -1
        for sub in pro.subproducts:
            price_min = min(price_min, sub.price)
            price_max = max(price_max, sub.price)

        if max_price != 'undefined':
            if (price_min>int(max_price)): continue

        product = product_schema.dump(pro)
        product['price_min'] = price_min
        product['price_max'] = price_max

        for img in pro.images:
            if img.isDefault==True:
                product['image_default_url'] = img.url
                break
        products.append(product)
        
        if sort == 'desc':
            products.sort(key=lambda x: x['price_min'], reverse=True)
        elif sort == 'asc':
            products.sort(key=lambda x: x['price_min'])

    return jsonify(products)


@app.route('/api/product/<product_id>', methods=['GET'])
def home_product(product_id):
    print('Received GET request for /api/home/product/<product_id>')
    
    product = Product.query.filter_by(id=product_id).first()

    results = product_schema.dump(product)
    results['subproducts'] = subproducts_schema.dump(product.subproducts)
    results['images'] = productimages_schema.dump(product.images)
    results['category_name'] = Category.query.get(product.category_id).category_name
    results['vendor'] = Store.query.get(product.store_id).store_name

    return jsonify(results)


