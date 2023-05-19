from app import app, db
from flask import jsonify,request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Product, Subproduct, CartSubproduct, Transaction
 

@app.route('/api/checkout', methods=['POST'])
@jwt_required()
def purchase_product():
    print('Received POST request for /api/checkout')
    user_id = get_jwt_identity()
   
    with db.session.begin():
        try:
            user = User.query.get(user_id)
            cart = user.cart
            balance = user.balance
            items = request.json['items'] # list of subproduct id 
            for item in items:
                cart_subproduct = CartSubproduct.query.get((cart.id,item))
                if cart_subproduct == None:
                    return jsonify({'message':'Order does not exist'}), 404
                to_buy_sub = Subproduct.query.get(item)
                to_buy_pro = Product.query.get(to_buy_sub.product_id)
                if cart_subproduct.quantity > to_buy_sub.stock:
                    raise ValueError('No enough product left')
                balance -= cart_subproduct.quantity * to_buy_sub.price   
                if balance < 0:
                    raise ValueError('Not enough money') 
                new_transaction = Transaction(user_id=user_id, store_id=to_buy_pro.store_id, product_id=to_buy_pro.id, subproduct_id=to_buy_sub.id, product_name=to_buy_pro.product_name, variation=to_buy_sub.variation, purchase_price=to_buy_sub.price, quantity=cart_subproduct.quantity)
                db.session.add(new_transaction)
                
                to_buy_sub.stock -= cart_subproduct.quantity
                db.session.delete(cart_subproduct)
                
            user.balance = balance
            db.session.commit()
            return jsonify({'balance':balance})
            # return jsonify({'message':'Sucessfully purchased'})

        except Exception as e:
            print(str(e))
            db.session.rollback()
            return jsonify({'message':'Internal server error!'}), 500



                  


