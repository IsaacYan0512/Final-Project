from contextlib import nullcontext
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers,models
from tensorflow.keras.layers import Dense, Activation, Flatten
from tensorflow.keras.preprocessing import image
# from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
import pandas as pd
import cv2
import os
import sys
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import load_model
from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
from io import BytesIO
import base64
import model
import threading
import warnings
import webbrowser

app = Flask(__name__)
cors = CORS(app)

image_folder = os.path.join('static', 'images')
app.config["UPLOAD_FOLDER"] = image_folder

# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
# port = 5000
# url = "http://127.0.0.1:{0}".format(port)

# threading.Timer(0, lambda: webbrowser.open(url)).start()
warnings.filterwarnings('ignore')
model=load_model("model/WasteClassificationModel.h5")


@app.route('/image', methods = ['GET', 'POST'])
def web():
    if (request.method == 'POST'):
        bytesOfImage = request.get_data()
        with open('image.jpeg', 'wb') as out:
            out.write(bytesOfImage)
        
        img_size = 200
        img = cv2.imread('image.jpeg')
        img = cv2.resize(img, (img_size, img_size))
        images = np.array(img).reshape(-1,img_size, img_size,3)
        predictions = model.predict(images)
        if (predictions[0]>0.5):
            return "Organic"
        else:
            return "Recycle"


    # imagefile = request.files['imagefile']
    # image_path = './static/images/' + imagefile.filename 
    # imagefile.save(image_path)
    # img_size = 200
    # img = cv2.imread(image_path)
    # img = cv2.resize(img, (img_size, img_size))
    # images = np.array(img).reshape(-1,img_size, img_size,3)
    # predictions = model.predict(images)
    # pic = os.path.join(app.config['UPLOAD_FOLDER'], imagefile.filename)
    # if predictions[0]>0.5:
    #     return render_template('web.html', user_image=pic, prediction_text='{} is Organic'.format(imagefile.filename))
    # else:
    #     return render_template('web.html', user_image=pic, prediction_text='{} is Recycle'.format(imagefile.filename))


if __name__ == "__main__":
    app.run(host='172.20.10.5', port=5000)