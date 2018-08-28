# -*- coding: utf-8 -*-
# @Author: chandan
# @Date:   2017-07-08 00:32:24
# @Last Modified by:   chandan
# @Last Modified time: 2018-08-28 18:58:18

from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.models import load_model
from keras.optimizers import Adam

from keras.callbacks import TensorBoard, ModelCheckpoint

from sklearn.preprocessing import MinMaxScaler

from config import MODEL_DIR, LOG_DIR

import os.path as osp

def build_model(seq_len, n_features, n_classes):
	# create and fit the LSTM network
	model = Sequential()
	model.add(LSTM(4, input_shape=(seq_len, n_features)))
	model.add(Dense(n_classes))
	opt = Adam(lr=0.00001)
	model.compile(loss='categorical_crossentropy', optimizer=opt, 
					metrics=['accuracy'])

	return model

def train_model(X, Y, seq_len, n_features, n_classes):
	tb = TensorBoard(log_dir=LOG_DIR, histogram_freq=0,  
          write_graph=True, write_images=True)

	ckpt_path = osp.join(MODEL_DIR, 'weights.{epoch:02d}-{val_loss:.2f}.hdf5')

	ckpt = ModelCheckpoint(ckpt_path, monitor='val_loss', verbose=0, 
		save_best_only=False, save_weights_only=False, mode='auto', period=1)

	model = build_model(seq_len, n_features, n_classes)
	model.fit(X, Y, epochs=100, validation_split=0.2, batch_size=128, 
				callbacks=[tb, ckpt])
	model.save(osp.join(MODEL_DIR, 'lstm.h5'))

def test_model(X, Y):
	model = load_model(osp.join(MODEL_DIR, 'lstm.h5'))
	loss = model.evaluate(X, Y)

	return loss
