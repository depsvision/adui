#!/usr/bin/python

import os
import re
import shutil


# traverse root directory, and list directories as dirs and files as files
for root, dirs, files in os.walk("."):
    path = root.split(os.sep)
    print((len(path) - 1) * '---', os.path.basename(root))

    vues = []
    src_vue = None
    for file in files:
        x = re.search("^.*\s\(\d\)\.vue$", file)
        x2 = re.search("^.*\s\(1\)\.vue$", file)
        if x:
            print(len(path) * '---', root + file)
            vues.append(file)
        if x2:
            src_vue = file
    if src_vue:
        shutil.copyfile(root + '/' + src_vue, root + '/' + src_vue.split(' ')[0] + '.vue')
    for vue in vues:
        os.remove(root + '/' + vue)

