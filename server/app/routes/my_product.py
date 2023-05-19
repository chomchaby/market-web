from app import app, db
from flask import jsonify,request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Category, Product, Subproduct, ProductImage
from app.models import product_schema, subproducts_schema, productimages_schema

@app.route('/api/my-store/products/<category_name>', methods=['GET'])
@jwt_required()
def my_products(category_name):
    print('Received GET request for /api/my-store/products/<category_name>')
    user_id = get_jwt_identity()
    store_id = User.query.filter_by(id=user_id).first().store.id

    if store_id == None:
        return jsonify({'message':'Store does not exist'}), 404
    
    my_products = Product.query.filter_by(store_id=store_id)
    results = {}

    if (category_name!='all'):

        category_id = Category.query.filter_by(category_name=category_name).first().id
        if category_id == None:
            return jsonify({'message':'Category does not exist'}), 404
                  
        products = []
        for pro in my_products.filter_by(category_id=category_id):
            product = product_schema.dump(pro)

            price_min  = 1000_000_000; price_max = -1
            for sub in pro.subproducts:
                price_min = min(price_min, sub.price)
                price_max = max(price_max, sub.price)
            product['price_min'] = price_min
            product['price_max'] = price_max
            for img in pro.images:
                if img.isDefault==True:
                    product['image_default_url'] = img.url
                    break
            products.append(product)

        if len(products)>0 :
            results[category_name] = products
        return jsonify(results)

    for cat in Category.query.all():
        products = []
        for pro in my_products.filter_by(category_id=cat.id):
            product = product_schema.dump(pro)
            price_min = 1000_000_000; price_max = -1
            for sub in pro.subproducts:
                price_min = min(price_min, sub.price)
                price_max = max(price_max, sub.price)
            product['price_min'] = price_min
            product['price_max'] = price_max
            for img in pro.images:
                if img.isDefault==True:
                    product['image_default_url'] = img.url
                    break
            products.append(product)

        if len(products)>0 :
            results[cat.category_name] = products
    return jsonify(results)
    

@app.route('/api/my-store/product/<product_id>', methods=['GET'])
@jwt_required()
def my_product(product_id):
    print('Received GET request for /api/my-store/product/<product_id>')
    user_id = get_jwt_identity()
    
    product = Product.query.filter_by(id=product_id).first()

    results = product_schema.dump(product)
    results['subproducts'] = subproducts_schema.dump(product.subproducts)
    results['images'] = productimages_schema.dump(product.images)
    results['category_name'] = Category.query.filter_by(id=product.category_id).first().category_name

    return jsonify(results)


@app.route('/api/my-store/add-product', methods=['POST'])
@jwt_required()
def add_product():
    print('Received POST request for /api/my-store/add-product')
    user_id = get_jwt_identity()
    store_id = User.query.filter_by(id=user_id).first().store.id
    if store_id == None:
        return jsonify({'message':'Store does not exist'}), 404
    
    product_name = request.json['name']
    category = request.json['category']
    description = request.json['desc']
    subproducts = request.json['subproducts']
    images = request.json['images']
    defaultImageTitle = request.json['defaultImageTitle']

    category_id = Category.query.filter_by(category_name=category).first().id
    if category_id == None:
        return jsonify({'message':'Category does not exist'}), 404
    
    try:
        product = Product(category_id=category_id, store_id=store_id, product_name=product_name, description=description)
        for subproduct in subproducts:
            new_subproduct = Subproduct(product=product, variation=subproduct['variation'], stock=subproduct['stock'], price=subproduct['price'])
            db.session.add(new_subproduct)
        for image in images:
            if (image['title']==defaultImageTitle):
                new_image = ProductImage(product=product, url=image['url'], title=image['title'], isDefault=True)
            else:
                new_image = ProductImage(product=product, url=image['url'], title=image['title'], isDefault=False)
            db.session.add(new_image)
        db.session.add(product)
        db.session.commit()
            
        return jsonify({'message':'Sucessfully added'})

    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500


@app.route('/api/my-store/edit-product', methods=['POST'])
@jwt_required()
def edit_product():
    print('Received POST request for /api/my-store/edit-product')
    user_id = get_jwt_identity()
    store_id = User.query.filter_by(id=user_id).first().store.id
    if store_id == None:
        return jsonify({'message':'Store does not exist'}), 404
    
    product_name = request.json['name']
    category = request.json['category']
    description = request.json['desc']
    subproducts = request.json['subproducts']
    images = request.json['images']
    defaultImageTitle = request.json['defaultImageTitle']
    product_id = request.json['productId']

    category_id = Category.query.filter_by(category_name=category).first().id
    if category_id == None:
        return jsonify({'message':'Category does not exist'}), 404

    try:
        product = Product.query.filter_by(id=product_id).first()
        if product.store_id != store_id:
            return jsonify({'message':'No right to access data'}), 403
        
        product.product_name = product_name
        product.category_id = category_id
        product.description = description
        for sub in product.subproducts:
            db.session.delete(sub)
        for img in product.images:
            db.session.delete(img)
        for subproduct in subproducts:
            new_subproduct = Subproduct(product=product, variation=subproduct['variation'], stock=subproduct['stock'], price=subproduct['price'])
            db.session.add(new_subproduct)
        for image in images:
            if (image['title']==defaultImageTitle):
                new_image = ProductImage(product=product, url=image['url'], title=image['title'], isDefault=True)
            else:
                new_image = ProductImage(product=product, url=image['url'], title=image['title'], isDefault=False)
            db.session.add(new_image)
        db.session.commit()
        return jsonify({'message':'Successfully edited'})
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
    

@app.route('/api/my-store/delete-product/<product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    print('Received DELETE request for /api/my-store/delete-product/<product_id>')
    user_id = get_jwt_identity()

    store_id = User.query.filter_by(id=user_id).first().store.id
    if store_id == None:
        return jsonify({'message':'Store does not exist'}), 404
    
    product = Product.query.filter_by(id=product_id).first()
    if product.store_id != store_id:
           return jsonify({'message':'No right to access data'}), 403
    
    try:
        # for sub in product.subproducts:
        #     db.session.delete(sub)
        # for img in product.images:
        #     db.session.delete(img)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message':'Successfully deleted'})
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
                  


