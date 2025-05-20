from flask import Flask, request, jsonify
from flask_cors import CORS
import student_searcher

app = Flask(__name__)
CORS(app)

try:
    students = student_searcher.load_students()
    print("Loaded students:", students)
except Exception as e:
    print("Error loading students:", str(e))
    students = []

@app.route('/students', methods=['GET'])
def get_students():
    print("Returning students:", students)
    return jsonify(students)

@app.route('/search/name/<name>', methods=['GET'])
def search_by_name(name):
    student = student_searcher.search_student(students, name)
    if student:
        return jsonify(student)
    return jsonify({"error": f"Student {name} not found."}), 404

@app.route('/search/partial/<partial_name>', methods=['GET'])
def search_by_partial_name(partial_name):
    results = student_searcher.search_students_by_partial_name(students, partial_name)
    return jsonify(results)

@app.route('/search/average', methods=['GET'])
def search_by_average():
    try:
        min_avg = float(request.args.get('min_avg'))
        max_avg = float(request.args.get('max_avg'))
        results = student_searcher.search_students_by_average(students, min_avg, max_avg)
        return jsonify(results)
    except ValueError:
        return jsonify({"error": "Invalid average range."}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)