from app import app, db
from flask import jsonify,request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Product, Subproduct, CartSubproduct
from app.models import subproduct_schema


@app.route('/api/products-in-cart', methods=['GET'])
@jwt_required()
def products_in_cart():
    print('Received GET request for /api/products-in-cart')
    user_id = get_jwt_identity()
    try:
        cart = User.query.get(user_id).cart
        subproducts = cart.subproducts
        cart_subproducts = []
        for subproduct in subproducts:
            sub = subproduct_schema.dump(subproduct)
            sub['quantity'] = CartSubproduct.query.get((cart.id, subproduct.id)).quantity
            product = Product.query.get(subproduct.product_id)
            sub['product_name'] = product.product_name
            for img in product.images:
                if img.isDefault == True:
                    sub['default_image'] = img.url
                    break
            cart_subproducts.append(sub)
        cart_number = CartSubproduct.query.filter_by(cart_id=cart.id).count()
        return jsonify({'cart_subproducts':cart_subproducts, 'cart_number':cart_number})
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
    
@app.route('/api/add-product-to-cart', methods=['POST'])
@jwt_required()
def add_product_to_cart():
    print('Received POST request for /api/add-to-cart')
    user_id = get_jwt_identity()
    try:
        cart = User.query.get(user_id).cart

        subproduct_id = request.json['subproduct_id']
        quantity = request.json['quantity']
        prev_subproduct_id = request.json['prev_subproduct_id']

        subproduct = Subproduct.query.get(subproduct_id)
        if subproduct == None:
            return jsonify({'message':'Product does not exist'}), 404
        
        existing_record = CartSubproduct.query.get((cart.id, subproduct_id))
        if existing_record is not None:
            existing_record.quantity = quantity
        else:
            new_cartsub = CartSubproduct(cart_id=cart.id, subproduct_id=subproduct_id, quantity=quantity)
            db.session.add(new_cartsub)
        if (prev_subproduct_id != None and prev_subproduct_id != subproduct_id):
            old_cart_subproduct = CartSubproduct.query.get((cart.id,prev_subproduct_id))
            db.session.delete(old_cart_subproduct)
        db.session.commit()
        cart_number = CartSubproduct.query.filter_by(cart_id=cart.id).count()
        return jsonify({'cart_number':cart_number})
        return jsonify({'message':'Sucessfully added product to cart'})
    
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500

@app.route('/api/delete-product-from-cart/<subproduct_id>', methods=['DELETE'])
@jwt_required()
def delete_product_from_cart(subproduct_id):
    print('Received DELETE request for /api/delete-product-from-cart/<subproduct_id>')
    user_id = get_jwt_identity()

    
    try:
        cart = User.query.get(user_id).cart
        cart_subproduct = CartSubproduct.query.get((cart.id,subproduct_id))
        if cart_subproduct == None:
            return jsonify({'message':'Order does not exist'}), 404
        
        db.session.delete(cart_subproduct)
        db.session.commit()
        cart_number = CartSubproduct.query.filter_by(cart_id=cart.id).count()
        return jsonify({'cart_number':cart_number})
        return jsonify({'message':'Successfully deleted'})
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500

@app.route('/api/cart-number', methods=['GET'])
@jwt_required()
def cart_number():
    user_id = get_jwt_identity()
    try:
        cart = User.query.get(user_id).cart
        cart_number = CartSubproduct.query.filter_by(cart_id=cart.id).count()
        return jsonify({'cart_number':cart_number})

    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
