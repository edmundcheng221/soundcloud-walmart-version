import pymongo
import ssl
import json
import datetime

cluster = pymongo.MongoClient("mongodb+srv://embodydb:1234@cluster0.uyqkv.mongodb.net/embody?retryWrites=true&w=majority",ssl_cert_reqs=ssl.CERT_NONE)
db = cluster.get_database("embody")
collection = db.comments

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

make_api()