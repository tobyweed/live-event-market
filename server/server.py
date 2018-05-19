import os
from flask import Flask, jsonify

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])

@app.route('/')
def index():
    return jsonify({'message': 'Hello, World!'})

@app.route('/yo')
def yo():
    return 'yo'

if __name__ == '__main__':
    app.run()
