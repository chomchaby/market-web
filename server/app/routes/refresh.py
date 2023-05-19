from app import app
from app.models import User
from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta

@app.route('/api/refresh', methods = ['GET'])
@jwt_required(refresh=True)
def refresh_token():
    print('Received GET request for /api/refresh')
    print('refresh_token : ' + request.cookies.get('refresh_token_cookie'))
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            return jsonify(error='User not found'), 404

        new_token = create_access_token(identity=user_id, fresh=False)
        return jsonify(accessToken=new_token, username=user.username, balance=user.balance)

    except Exception as e:
        print(str(e))
        return jsonify(error='Internal server error'), 500
