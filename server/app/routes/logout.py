from app import app
from flask import jsonify, request, Response
from flask_jwt_extended import unset_refresh_cookies

@app.route('/api/logout')
def logout():
    print('Received GET request for /api/logout')
    res = Response(status=204)
    unset_refresh_cookies(res)
    return res