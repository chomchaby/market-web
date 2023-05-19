from app import app, db
from flask import jsonify,request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models import User, Store
from app.models import store_schema, products_schema

@app.route('/api/my-store', methods = ['GET'])
@jwt_required()
def mystore():
    print('Received GET request for /api/my-store')
    # print("authorization : " + request.headers['Authorization'])
    # print("cookie : " +request.cookies.get('refresh_token_cookie'))
    user_id = get_jwt_identity()
    store = User.query.filter_by(id=user_id).first().store
    if store == None:
        return jsonify(hasStore=False)
    mystore = Store.query.get(store.id)
    data = store_schema.dump(mystore)
    # products = products_schema.dump(mystore.products)
    # data['products'] = products
    return jsonify(data)
    

@app.route('/api/my-store/register', methods = ['POST'])
@jwt_required()
def mystore_register():
    print('Received POST request for /api/my-store/register')
    # print("authorization : " + request.headers['Authorization'])
    # print("cookie : " +request.cookies.get('refresh_token_cookie'))
    user_id = get_jwt_identity()
    store = User.query.filter_by(id=user_id).first().store
    if store != None:
        return jsonify(hasStore=True), 409

    name = request.json['name']
    desc = request.json['desc']
    img = request.json['img']

    
    try:
        new_store = Store(user_id=user_id, store_name=name, description=desc, pic_url=img)
        db.session.add(new_store)
        db.session.commit()
        return store_schema.jsonify(new_store), 201
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
    

@app.route('/api/my-store/edit-profile', methods = ['PUT'])
@jwt_required()
def edit_profile():
    print('Received POST request for /api/my-store/edit-profile')
    # print("authorization : " + request.headers['Authorization'])
    # print("cookie : " +request.cookies.get('refresh_token_cookie'))
    user_id = get_jwt_identity()
    store = User.query.filter_by(id=user_id).first().store
    if store == None:
        return jsonify(hasStore=False), 404
    
    name = request.json['name']
    desc = request.json['desc']
    img = request.json['img']
    try:
        store.store_name = name
        store.description = desc
        store.pic_url = img
        db.session.commit()
        return store_schema.jsonify(store)
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
    

