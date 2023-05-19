from app import app,bcrypt
from app.models import User
from flask import jsonify, request, make_response
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies

@app.route('/api/auth', methods = ['POST'])
def login():
    try:
        auth_username = request.json['username']
        auth_password = request.json['password']
        if not auth_username or not auth_password:
            return make_response('Could not verify', 400, {'WWW-Authenticate' : 'Basic realm="Login required"'})

        user = User.query.filter_by(username=auth_username).first()
        if not user:
            return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required"'})

        if bcrypt.check_password_hash(user.password_hash, auth_password):
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(identity=user.id)

            res = jsonify(accessToken=access_token, username = user.username, balance=user.balance)
            set_refresh_cookies(res, refresh_token)
            # res.set_cookie('refresh_token_cookie',refresh_token,max_age=60*60,samesite='None',secure=True)

            return res
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required"'})
    
    except Exception as e:
        print(str(e))
        return jsonify(error='Internal server error'), 500