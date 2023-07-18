from flask import Flask, jsonify
import pymysql.cursors
import random

app = Flask(__name__)

connection = pymysql.connect(
    host='127.0.0.1',
    user='root',
    password='*****',
    db='game',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

@app.route('/quiz/qa')
def get_question():
    print ("in api")
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM qq ORDER BY RAND() LIMIT 1;')
        result = cursor.fetchone()
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(port=5200)
