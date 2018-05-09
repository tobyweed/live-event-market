import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder="../client/build", template_folder="../client/build")

@app.route('/', defaults={'path': ''})

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists('../client/build/' + path):
        return send_from_directory('../client/build', path)
    else:
        return send_from_directory('../client/build', 'index.html')

if __name__ == "__main__":
    app.run()
