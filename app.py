import sys,os
root_path  =  os.path.dirname(os.path.realpath(__file__))
LOG_FILE = os.path.join(root_path,'logs/flaskserver.log')
sys.stderr = sys.stdout = open(LOG_FILE,"a")

from flask import Flask, redirect, render_template, request, session, url_for, send_from_directory
from flask_uploads import UploadSet, configure_uploads, IMAGES
from flask import jsonify, Response
from flask_cors import CORS,cross_origin
import base64
import time
import io
import json
from urllib.request import Request as urlRequest
from urllib.request import urlopen

app = Flask(__name__, static_folder='static')
CORS(app)
app.config['SECRET_KEY'] = 'supersecretkeygoeshere'

# Uploads settings
app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd() + '/uploads'

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

@app.route('/', methods=['GET', 'POST'])
def index():
    return redirect(url_for('homeApp'))

@app.route('/check')
def check():
    status_code = Response(status=200)
    return status_code


@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('./', path)


@app.route('/homeApp', methods=['GET', 'POST'])
def editingDashboard():
    return render_template('index.html')

@app.route('/sampleApi', methods=['POST'])
@cross_origin(origin='*',methods=['GET', 'POST'])
def applyPresets():
    
    return jsonify({'status':'success',"message": "None"})

if __name__ == '__main__':

    context = ('flaskserver.crt','flaskserver.key')
    app.run(host='0.0.0.0', port=8000, debug = True,ssl_context = context)