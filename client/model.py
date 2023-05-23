    # %%
def model(img):
    import tensorflow as tf
    from tensorflow import keras
    from keras import layers,models
    from keras.layers import Dense, Activation, Flatten
    import numpy as np
    import pandas as pd
    import cv2
    import os
    import matplotlib.pyplot as plt
    from sklearn.model_selection import train_test_split
    #import seaborn as sn
    from keras.models import Model
    from keras.models import load_model

        # %%
        # load model
    savedModel=load_model(r'C:\Users\Isaac\Desktop\Project1\gfgModel.h5')
    savedModel.summary()

    # %%
    #img = cv2.imread(file_name)
    img_size = 200
    new_img = cv2.resize(img,(img_size, img_size))
    plt.imshow(new_img)

    # %%
    new_img = np.array(new_img).reshape(-1,img_size, img_size,3)

    # %%
    new_img

    # %%
    print(new_img.shape)

    # %%
    predictions = savedModel.predict(new_img)

    # %%
    if predictions >0.5:
        predictions = "Organic"
    else:
        predictions = "Recycle"

    # %%
    print(predictions)

    return predictions