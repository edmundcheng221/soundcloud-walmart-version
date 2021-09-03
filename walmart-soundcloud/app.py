from flask import Flask, render_template, redirect, request, send_file
import pymongo
import ssl
import datetime
import json
from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app, support_credentials=True)

cluster = pymongo.MongoClient("mongodb+srv://embodydb:1234@cluster0.uyqkv.mongodb.net/embody?retryWrites=true&w=majority",ssl_cert_reqs=ssl.CERT_NONE)
db = cluster.get_database("embody")
collection = db.comments
def connectDB(post):
   collection.insert_one(post)
   

@app.route('/')
def read():
   results = collection.find({}).sort("created_at", -1)
   return render_template('index.html', results=results)

@app.route('/api')
def make_api():
   res = collection.find({}).sort("created_at", -1)
   json_data = []
   for ele in res:
      del ele["_id"]
      time_diff = datetime.datetime.utcnow().timestamp() - ele["created_at"]
      if time_diff < 60:
         ele["time_ago"] = str("{:0.0f}".format(time_diff)) + " seconds ago"
      elif time_diff < 3600:
         ele["time_ago"] = str("{:0.0f}".format(time_diff/60)) + " min ago"
      elif time_diff < 86400:
         ele["time_ago"] = str("{:0.0f}".format(time_diff/3600)) + " hour ago"
      elif time_diff < 2628000:
         ele["time_ago"] = str("{:0.0f}".format(time_diff/86400)) + " day ago"
      elif time_diff < 31536000:
         ele["time_ago"] = str("{:0.0f}".format(time_diff/2628000)) + " month ago"
      else:
         ele["time_ago"] = str("{:0.0f}".format(time_diff/31536000)) + " year ago"
      del ele["created_at"]
      json_data.append(ele)
   return json.dumps( json_data, indent=4 )

@app.route('/', methods=['POST'])
def handle_comment_post():
   name = request.form['commentor']
   message = request.form['comment']
   tiempo = request.form['timestamp']
   data = {
      "name": name, 
      "message": message, 
      "created_at": datetime.datetime.utcnow().timestamp(),
      "time_stamp": tiempo,
      "image": "https://edmundcheng221.github.io/img/" + str(name[0]).lower() + ".png"
   }
   connectDB(data)
   return redirect('/')

@app.route('/assets/audio.mp3')
def song_mp3():
   return send_file('static/assets/audio.mp3', attachment_filename='static/assets/audio.mp3')

@app.route('/assets/duck.png')
def duck():
   return send_file('static/assets/duck.png', attachment_filename='static/assets/duck.png')

@app.route('/assets/blank.png')
def blank():
   return send_file('static/assets/blank.png', attachment_filename='static/assets/blank.png')

@app.route('/assets/e.png')
def letter():
   return send_file('static/assets/e.png', attachment_filename='static/assets/e.png')

if __name__ == '__main__': 
   app.run(port=5000, debug=True)
   