# Flask Backend for Student Searcher
# This script defines a REST API using Flask to manage student data, integrating with student_searcher.py.

from flask import Flask, request, jsonify
from flask_cors import CORS
import student_searcher
import os

# Initialize Flask app and enable CORS for all endpoints
app = Flask(__name__)
CORS(app)

# Health Check Endpoint
@app.route('/', methods=['GET', 'HEAD'])
def health_check():
    return jsonify({"status": "ok", "message": "Student Searcher Backend is running"}), 200

# Get All Students Endpoint
@app.route('/students', methods=['GET'])
def get_students():
    students = student_searcher.load_students()
    print("Returning students:", students)
    return jsonify(students)

# Add Student Endpoint
@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or missing JSON data in request body."}), 400
    name = data.get('name')
    grades = data.get('grades')
    if not name or not grades:
        return jsonify({"error": "Name and grades are required."}), 400
    
    # Validate name on the backend
    if not student_searcher.validate_name(name):
        return jsonify({"error": "Name must include a first and last name (e.g., John Doe) with letters and spaces only."}), 400

    try:
        students = student_searcher.load_students()
        student_searcher.add_student(students, name, grades)
        # Reload students to ensure the list is up-to-date
        students = student_searcher.load_students()
        print(f"Saved students after adding {name}:", students)
        return jsonify({"message": f"Added {name} successfully!"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to save: {str(e)}"}), 500

# Update Student Grades Endpoint
@app.route('/students/<name>', methods=['PUT'])
def update_grades(name):
    data = request.json
    grades = data.get('grades')
    if not grades:
        return jsonify({"error": "Grades are required."}), 400
    students = student_searcher.load_students()
    student = student_searcher.search_student(students, name)
    if student:
        try:
            if not student_searcher.validate_grades(grades):
                return jsonify({"error": "Grades must be between 0 and 100."}), 400
            student_searcher.update_grades(students, name, grades)
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
    students = student_searcher.load_students()
    student = student_searcher.search_student(students, name)
    if student:
        student_searcher.remove_student(students, name)
        print(f"Saved students after removing {name}:", students)
        return jsonify({"message": f"Removed {name} successfully!"})
    return jsonify({"error": f"Student {name} not found."}), 404

# Search by Exact Name Endpoint
@app.route('/search/name/<name>', methods=['GET'])
def search_by_name(name):
    students = student_searcher.load_students()
    student = student_searcher.search_student(students, name)
    if student:
        return jsonify(student)
    return jsonify({"error": f"Student {name} not found."}), 404

# Search by Partial Name Endpoint
@app.route('/search/partial/<partial_name>', methods=['GET'])
def search_by_partial_name(partial_name):
    students = student_searcher.load_students()
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
        students = student_searcher.load_students()
        results = student_searcher.search_students_by_average(students, min_avg, max_avg)
        return jsonify(results)
    except ValueError:
        return jsonify({"error": "Invalid average range: must be numbers."}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500

# Get Class Statistics Endpoint
@app.route('/statistics', methods=['GET'])
def get_statistics():
    students = student_searcher.load_students()
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