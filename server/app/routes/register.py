# from flask_cors import cross_origin
from app import app,db
from app.models import User, Cart
from flask import jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies


@app.route('/api/register', methods = ['POST'])
def register():
    username = request.json['username']
    email_address = request.json['email_address']
    password = request.json['password']
    
    exist_email = db.session.query(User.id).filter_by(email_address=email_address).first()
    if exist_email != None:
        return jsonify({'message':'This email is already registered'}), 409
    valid_username = User.query.filter_by(username=username).first()
    if valid_username != None:
        return jsonify({'message':'This username is already used'}), 409
    try:
        new_user = User(username=username, email_address = email_address, password = password)
        new_cart = Cart(owner=new_user)
        db.session.add(new_user)
        db.session.add(new_cart)
        db.session.commit()
        accessToken = create_access_token(identity=new_user.id, fresh=True)
        refresh_token = create_refresh_token(identity=new_user.id)
        res = jsonify(accessToken=accessToken)
        set_refresh_cookies(res, refresh_token)
        return res, 201
    
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'message':'Internal server error!'}), 500
    
