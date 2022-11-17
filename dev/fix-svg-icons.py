#!/usr/bin/python
import ast
import os
import re
import shutil
from pathlib import Path
# Path("/my/directory").mkdir(parents=True, exist_ok=True)

# traverse root directory, and list directories as dirs and files as files
for root, dirs, files in os.walk("../src/icons"):
    # path = root.split(os.sep)
    # print((len(path) - 1) * '---', os.path.basename(root))
    for file in files:
        if re.match("^.*\.svg$", file):
            with open(root + '/' + file, 'r') as f:
                content = f.read().replace('\n', '')
                result = re.search("<symbol.*</symbol>", content)
                if result:
                    svg_tag = result[0].replace('symbol', 'svg')
                    dst_root = root.replace('src/icons/svg', 'src/icons/svg2')
                    Path(dst_root).mkdir(parents=True, exist_ok=True)
                    with open(dst_root + '/' + file, 'w') as dst_file:
                        escaped_str = svg_tag.encode('utf-8').decode('unicode_escape')
                        dst_file.write(escaped_str)

   

