from flask import Flask, request, jsonify, render_template

from flask_cors import CORS

import json
app = Flask(__name__)

cors = CORS(app)
import time
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True
@app.route("/", methods = ['POST', 'GET'])
# hard reset for browser - necessary for javascript reset - ctrl + shift + r
def func():
    if request.method == "POST":
        # print('hi')
        data = request.get_json() # dictionary!!
        # data = json.loads(data)
        print(data[0].get("what's up"))
        otherdata = jsonify(data)
        # print("data:")
        print("returning...")
        
        return otherdata
    print('what')
    return render_template('index.html', host = '0.0.0.0')

if __name__ == "__main__":
 app.run(debug = True)

