# Create Database Connection
# ----------------------------------
# Creates a connection to our DB

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

import os
import psycopg2
from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine

#you may need to run the following pip install: 
#pip install psycopg2-binary

app = Flask(__name__, static_url_path='')

def get_db_connection():
    conn = psycopg2.connect(host='localhost',
                            database='wildfires_db',
                            user='postgres',
                            password='postgres')
    return conn

#################################################
# Flask Routes Connects to postrgresql database
#################################################

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM wildfires_sizeG')
    data = cur.fetchall()
    cur.close()
    conn.close()
    # return jsonify(data)
    return render_template('index.html', data = data)
# @app.route("/error")
# def error():
#     return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

# userName = "postgres"
# password = "postgres" #use your postgres password if you changed it
# database = "wildfires_db" #you can use any db you want, I just happened to use this one

# #engine = create_engine("sqlite:///pets.sqlite")
# engine = create_engine(f"postgresql+psycopg2://{userName}:{password}@localhost:5432/{database}")


# conn = engine.connect()