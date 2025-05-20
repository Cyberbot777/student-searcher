from flask import Flask, jsonify
from flask_cors import CORS
import student_searcher

app = Flask(__name__)
CORS(app)

# Load students and debug
try:
    students = student_searcher.load_students()
    print("Loaded students:", students)
except Exception as e:
    print("Error loading students:", str(e))
    students = []

@app.route('/students', methods=['GET'])
def get_students():
    print("Returning students:", students)  # Debug output
    return jsonify(students)

if __name__ == '__main__':
    app.run(debug=True, port=5000)