# -*- coding: utf-8 -*-
# @Author: chandan
# @Date:   2017-07-08 00:32:17
# @Last Modified by:   chandan
# @Last Modified time: 2018-08-28 17:11:51

import pandas as pd

def read_file(fname):
	df = pd.read_csv(fname, header=None)
	return df
	