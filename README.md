## Application Description

Web-based audio player that allows user to play static audio file.

Allows users to comment at specific time stamps.

Basically a bootleg SoundCloud.

## Technologies used

**Backend - Flask (Python3)**

Lightweight framework with template functionality. Just the python framework I am most comfortable with.

**Frontend - HTML5, CSS3, JavaScript (ES6)**

Just to keep it simple. For this app, I don't need any frameworks like React so native is ok.

**Libraries - Wavesurfer.js (Audio waveform), Pymongo (helps connect to mongodb)**

Wavesurfer.js provides the functionalities I need, so why not?

**Database - MongoDB**

I chose MongoDB because I just need to be able to store information like name, comment, and timestamp. I didn't need to worry about schema or creating tables. So I thought this was a simple solution for what I needed.

I also already have mongodb atlas account. I can use a shared cluster for free. No need to startup a database on localhost.

## API Service

Go to "http://127.0.0.1:5000/api" for json data containing all comments.

## Set up

Clone repository

`git clone https://github.com/edmundcheng221/soundcloud-walmart-version.git`

Navigate to project directory

`cd walmart-soundcloud`

Activate environment on MacOS

`source venv/bin/activate`

Install dependencies

`pip3 install -r requirements.txt`

Enter development environment

`export FLASK_APP=app.py`

`export FLASK_ENV=development`

Run application locally

`flask run`