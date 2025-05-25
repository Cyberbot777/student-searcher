# Student Searcher Program
# This script manages a list of students, allows searching by name or average, and saves data to MongoDB.

import os
import re
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), 'env', '.env'))

mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MONGO_URI environment variable not set.")
client = MongoClient(mongo_uri)
db = client["student_searcher"]
students_collection = db["students"]

def calculate_average(grades):
    if not grades:
        return 0
    return sum(grades) / len(grades)

def validate_grades(grades):
    for grade in grades:
        if not (0 <= grade <= 100):
            return False
    return True

def validate_name(name):
    name_parts = name.strip().split()
    if len(name_parts) < 2:
        return False
    if not re.match(r'^[A-Za-z\s]+$', name):
        return False
    return True

def find_student_by_name(name):
    name = name.strip()
    student = students_collection.find_one({
        "$expr": {
            "$eq": [
                {"$trim": {"input": "$name"}},
                name
            ]
        }
    })
    if student:
        student["grades"] = [int(g) for g in student["grades"]]
        student.pop("_id", None)
    return student

def search_student(students, name):
    return find_student_by_name(name)

def search_students_by_partial_name(students, partial_name):
    results = []
    cursor = students_collection.find({"name": {"$regex": partial_name, "$options": "i"}})
    for student in cursor:
        student["grades"] = [int(g) for g in student["grades"]]
        student.pop("_id", None)
        results.append(student)
    return results

def search_students_by_average(students, min_avg, max_avg):
    result = []
    for student in students:
        avg = calculate_average(student["grades"])
        if min_avg <= avg <= max_avg:
            result.append(student)
    return result

def sort_students_by_average(students, ascending=True):
    return sorted(students, key=lambda s: calculate_average(s["grades"]), reverse=not ascending)

def add_student(students, name, grades):
    if find_student_by_name(name):
        raise ValueError(f"Student {name} already exists.")
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100.")
    if not validate_name(name):
        raise ValueError("Name must include a first and last name (e.g., John Doe) with letters and spaces only.")
    student = {"name": name.strip(), "grades": grades}
    students_collection.insert_one(student)

def remove_student(students, name):
    if find_student_by_name(name):
        students_collection.delete_one({"$expr": {"$eq": [{"$trim": {"input": "$name"}}, name.strip()]}})
    else:
        raise ValueError(f"Student {name} not found")

def update_grades(students, name, grades):
    if not find_student_by_name(name):
        raise ValueError(f"Student {name} not found")
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100")
    students_collection.update_one({"$expr": {"$eq": [{"$trim": {"input": "$name"}}, name.strip()]}}, {"$set": {"grades": grades}})

def edit_student_grades(students, name, grades):
    if not find_student_by_name(name):
        raise ValueError(f"Student {name} not found")
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100")
    students_collection.update_one({"$expr": {"$eq": [{"$trim": {"input": "$name"}}, name.strip()]}}, {"$set": {"grades": grades}})

def display_statistics(students):
    if not students:
        raise ValueError("No students available to calculate statistics.")
    averages = [calculate_average(student["grades"]) for student in students]
    class_average = sum(averages) / len(averages)
    highest_avg = max(averages)
    lowest_avg = min(averages)
    highest_student = next(student["name"] for student in students if calculate_average(student["grades"]) == highest_avg)
    lowest_student = next(student["name"] for student in students if calculate_average(student["grades"]) == lowest_avg)
    return {
        "class_average": class_average,
        "highest_average": highest_avg,
        "highest_student": highest_student,
        "lowest_average": lowest_avg,
        "lowest_student": lowest_student
    }

def load_students(filename=os.getenv("DATA_PATH", "students.txt")):
    students = list(students_collection.find())
    for student in students:
        student["grades"] = [int(g) for g in student["grades"]]
        student.pop("_id", None)
    return students

def main():
    students = load_students()
    return students

if __name__ == "__main__":
    main()