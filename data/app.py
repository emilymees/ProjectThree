from flask import Flask, render_template, jsonify

#Load From the Database file that I created. It is in this same directory
from wildfires_sizeG import Fire_Size

app = Flask(__name__)

#Route to produce your main home page. 
#Feel free to add additional HTML routes to add additional pages
@app.route("/")
def index(): 
    return render_template("index.html")

#This is the main data route, it will produce JSON for your javascript to use
#You will wind up calling into it using d3.json("/LoadData/1") to get period 1
@app.route("/LoadData/<period>")
def LoadData(period): 

    scoreData = LoadScoresPerPeriod(period)

    data = scoreData.groupby(["Sex"]).mean()

    #Produce a JSON object (aka a list of python dictionaries)
    scoreList = []
    for sex in data.index: 

        scoreList.append({
            "Sex" : sex, 
            "AvgScore" :  data.loc[sex]['Score']
        })

    #Return the JSON that you created
    return jsonify(scoreList)


if __name__ == "__main__":
    app.run(debug=True)