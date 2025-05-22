# Flask Backend for Student Searcher
# This script defines a REST API using Flask to manage student data, integrating with student_searcher.py.

from flask import Flask, request, jsonify
from flask_cors import CORS
import student_searcher
import os
from shutil import copyfile

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Health Check Endpoint
@app.route('/', methods=['GET', 'HEAD'])
def health_check():
    return jsonify({"status": "ok", "message": "Student Searcher Backend is running"}), 200

# Initialize Student Data
students = []
try:
    data_path = os.getenv('DATA_PATH', 'students.txt')  # Use environment variable or default
    if not os.path.exists(data_path):
        default_path = 'students.txt'
        if os.path.exists(default_path):
            copyfile(default_path, data_path)
    students = student_searcher.load_students(filename=data_path)
    print("Loaded students:", students)
except Exception as e:
    print(f"Error initializing students: {str(e)}")

# Get All Students Endpoint
@app.route('/students', methods=['GET'])
def get_students():
    print("Returning students:", students)
    return jsonify(students)

# Add Student Endpoint
@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    name = data.get('name')
    grades = data.get('grades')
    if not name or not grades:
        return jsonify({"error": "Name and grades are required."}), 400
    try:
        student_searcher.add_student(students, name, grades)
        student_searcher.save_students(students)
        print(f"Saved students after adding {name}:", students)
        return jsonify({"message": f"Added {name} successfully!"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to save: {str(e)}"}), 500

# Edit Student Grades Endpoint
@app.route('/students/<name>', methods=['PUT'])
def edit_student(name):
    data = request.json
    grades = data.get('grades')
    if not grades:
        return jsonify({"error": "Grades are required."}), 400
    student = student_searcher.search_student(students, name)
    if student:
        try:
            if not student_searcher.validate_grades(grades):
                return jsonify({"error": "Grades must be between 0 and 100."}), 400
            student["grades"] = grades
            student_searcher.save_students(students)
            print(f"Saved students after editing {name}:", students)
            return jsonify({"message": f"Updated grades for {name} successfully!"})
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": f"Failed to save: {str(e)}"}), 500
    return jsonify({"error": f"Student {name} not found."}), 404

# Remove Student Endpoint
@app.route('/students/<name>', methods=['DELETE'])
def remove_student(name):
    student = student_searcher.search_student(students, name)
    if student:
        students.remove(student)
        student_searcher.save_students(students)
        print(f"Saved students after removing {name}:", students)
        return jsonify({"message": f"Removed {name} successfully!"})
    return jsonify({"error": f"Student {name} not found."}), 404

# Search by Exact Name Endpoint
@app.route('/search/name/<name>', methods=['GET'])
def search_by_name(name):
    student = student_searcher.search_student(students, name)
    if student:
        return jsonify(student)
    return jsonify({"error": f"Student {name} not found."}), 404

# Search by Partial Name Endpoint
@app.route('/search/partial/<partial_name>', methods=['GET'])
def search_by_partial_name(partial_name):
    results = student_searcher.search_students_by_partial_name(students, partial_name)
    return jsonify(results)

# Search by Average Grade Range Endpoint
@app.route('/search/average', methods=['GET'])
def search_by_average():
    min_avg = request.args.get('min_avg')
    max_avg = request.args.get('max_avg')
    if min_avg is None or max_avg is None:
        return jsonify({"error": "Missing min_avg or max_avg parameters."}), 400
    try:
        min_avg = float(min_avg)
        max_avg = float(max_avg)
        if min_avg > max_avg:
            return jsonify({"error": "min_avg cannot be greater than max_avg."}), 400
        results = student_searcher.search_students_by_average(students, min_avg, max_avg)
        return jsonify(results)
    except ValueError:
        return jsonify({"error": "Invalid average range: must be numbers."}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

# Get Class Statistics Endpoint
@app.route('/statistics', methods=['GET'])
def get_statistics():
    if not students:
        return jsonify({"error": "No students available."}), 404
    try:
        averages = [student_searcher.calculate_average(student["grades"]) for student in students]
        class_avg = sum(averages) / len(averages) if averages else 0
        highest_avg = max(averages) if averages else 0
        lowest_avg = min(averages) if averages else 0
        highest_student = next((student["name"] for student in students if student_searcher.calculate_average(student["grades"]) == highest_avg), None)
        lowest_student = next((student["name"] for student in students if student_searcher.calculate_average(student["grades"]) == lowest_avg), None)
        return jsonify({
            "class_average": class_avg,
            "highest_average": highest_avg,
            "highest_student": highest_student,
            "lowest_average": lowest_avg,
            "lowest_student": lowest_student
        })
    except Exception as e:
        return jsonify({"error": f"Error calculating statistics: {str(e)}"}), 500

# Run Flask Application
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)