import os
from flask import Flask, render_template, send_from_directory

# Mongo Config
import pymongo
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/') #this URI can and should be changed to an env variable eventually so that we can switch readily between production and testing dbs.
db = client['test-database']
collection = db['test-collection']

# EXAMPLE:
# post = {'author': 'Mike',
#     'text': 'My first blog post!',
#     'tags': ['mongodb', 'python', 'pymongo']
#   }
#
# posts = db.posts
# post_id = posts.insert_one(post).inserted_id
# print(post_id)

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
