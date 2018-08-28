# -*- coding: utf-8 -*-
# @Author: chandan
# @Date:   2018-08-28 17:35:33
# @Last Modified by:   chandan
# @Last Modified time: 2018-08-28 17:36:04

from sklearn.preprocessing import LabelBinarizer

lb = LabelBinarizer()
print (lb.fit_transform(['yes', 'no', 'maybe', 'yes']))
