# -*- coding: utf-8 -*-
# @Author: chandan
# @Date:   2017-07-08 00:32:09
# @Last Modified by:   chandan
# @Last Modified time: 2018-08-28 19:06:18

from data_utils import read_file
from config import DATA_DIR, SCORE_COLUMNS 
import os
from model import train_model, test_model

import pandas as pd
import numpy as np

from sklearn.preprocessing import LabelBinarizer
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

import os.path as osp

DATA_FILE = 'train.csv'

def main():
	# read acc, gps, veh det for multiple drivers, scenes
	X_dfs, Y_dfs = [], []

	data_path = osp.join(DATA_DIR, DATA_FILE)
	print (data_path)

	df = read_file(data_path)

	X = df.iloc[:, :-1].values.astype('float32')
	labels = df.iloc[:, -1]

	enc = LabelBinarizer()
	Y = enc.fit_transform(labels.values)
	n_classes = len(enc.classes_)
	print ('Number of classes:', n_classes)

	print ("X shape:", X.shape)
	print ("Y shape:", Y.shape)

	scaler = MinMaxScaler(feature_range=(0, 1))
	X = scaler.fit_transform(X)
	
	seq_len, stride = 50, 1

	X_seq = X_to_seq(X, seq_len, stride)
	Y = Y[seq_len:]
	
	X_tr, X_ts, Y_tr, Y_ts = train_test_split(X_seq, Y, test_size=0.2)

	# train
	print ("X Train shape:", X_tr.shape)
	print ("Y Train shape:", Y_tr.shape)
	
	print ("X test shape:", X_ts.shape)
	print ("Y test shape:", Y_ts.shape)

	n_features = X_tr.shape[-1]

	train_model(X_tr, Y_tr, seq_len, n_features, n_classes)

	loss = test_model(X_ts_seq, Y_ts)
	print (loss)

def X_to_seq(X, seq_len, stride):
	X_seqs = []

	for start_ndx in range(0, len(X) - seq_len, stride):
		X_seqs.append(X[start_ndx : start_ndx + seq_len])
	
	return np.array(X_seqs)

if __name__ == '__main__':
	main()