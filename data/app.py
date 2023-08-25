from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

app = Flask(__name__)

# ... Import other necessary modules ...

# Load data from the Database file
from wildfires_db import wildfires_sizeG

# Route to produce your main home page.
# Feel free to add additional HTML routes to add additional pages

# This is the main data route, it will produce JSON for your JavaScript to use
@app.route("/LoadData")
def LoadData():
    engine = create_engine(f"postgresql+psycopg2://{userName}:{password}@localhost:5432/{database}")
    session = Session(engine) 

    fireData = wildfires_sizeG

    # Perform your data processing here
    data = fireData.groupby("Category")["Size"].mean()

    # Convert the processed data to a list of dictionaries
    dataList = [{"Category": category, "AvgSize": avg_size} for category, avg_size in data.items()]

    # Return the processed data as JSON
    return jsonify(dataList)

@app.route("/getWildfiresData")
def get_wildfires_data():
    # Load and process data from your DataFrame or database
    # Replace this with your actual data processing logic
    data = [
        {"Year": 2021, "Count": 100},
        {"Year": 2022, "Count": 150},
        # Add more data entries as needed
    ]
    return jsonify(data)

# ... Your existing /dataconn, /recommender, and /home routes ...

if __name__ == "__main__":
    app.run(debug=True)
