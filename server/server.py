import os
from flask import Flask, render_template, send_from_directory, jsonify

app = Flask(__name__)

@app.route('/yo')
def yo():
    return 'yo'

if __name__ == '__main__':
    app.run()
