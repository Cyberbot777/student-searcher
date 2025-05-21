from flask import Flask, request, jsonify
from flask_cors import CORS
import student_searcher

app = Flask(__name__)
CORS(app)

try:
    if not os.path.exists('/opt/render/students.txt'):
        if os.path.exists('students.txt'):
            copyfile('students.txt', '/opt/render/students.txt')
except Exception as e:
    print(f"Error copying students.txt: {str(e)}")

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

@app.route('/students', methods=['POST'])
def add_student():
    data = request.json
    name = data.get('name')
    grades = data.get('grades')
    try:
        student_searcher.add_student(students, name, grades)
        student_searcher.save_students(students)
        print(f"Saved students after adding {name}:", students)
        return jsonify({"message": f"Added {name} successfully!"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to save: {str(e)}"}), 500

@app.route('/students/<name>', methods=['PUT'])
def edit_student(name):
    data = request.json
    grades = data.get('grades')
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

@app.route('/students/<name>', methods=['DELETE'])
def remove_student(name):
    for student in students:
        if student["name"].lower() == name.lower():
            students.remove(student)
            student_searcher.save_students(students)
            print(f"Saved students after removing {name}:", students)
            return jsonify({"message": f"Removed {name} successfully!"})
    return jsonify({"error": f"Student {name} not found."}), 404

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

@app.route('/statistics', methods=['GET'])
def get_statistics():
    if not students:
        return jsonify({"error": "No students available."}), 404
    try:
        averages = [student_searcher.calculate_average(student["grades"]) for student in students]
        class_avg = sum(averages) / len(averages)
        highest_avg = max(averages)
        lowest_avg = min(averages)
        highest_student = next(student["name"] for student in students if student_searcher.calculate_average(student["grades"]) == highest_avg)
        lowest_student = next(student["name"] for student in students if student_searcher.calculate_average(student["grades"]) == lowest_avg)
        return jsonify({
            "class_average": class_avg,
            "highest_average": highest_avg,
            "highest_student": highest_student,
            "lowest_average": lowest_avg,
            "lowest_student": lowest_student
        })
    except Exception as e:
        return jsonify({"error": f"Error calculating statistics: {str(e)}"}), 500

if __name__ == '__main__':
    import os
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)