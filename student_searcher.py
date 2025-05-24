# Student Searcher Program
# This script manages a list of students, allows searching by name or average, and saves data to a file.

import csv  # Import the csv module for exporting and importing to CSV
import os   # For configurable file path
import re   # For validation regex
from pymongo import MongoClient  # Added for MongoDB integration

# MongoDB connection setup
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://studentadmin:sj8uuu50ksjuDD9@studentsearchercluster.uhtoqb4.mongodb.net/?retryWrites=true&w=majority&appName=StudentSearcherCluster")
client = MongoClient(mongo_uri)
db = client["student_searcher"]
students_collection = db["students"]

# Function to calculate average grade (used by multiple functions)
def calculate_average(grades):
    if not grades:
        return 0
    return sum(grades) / len(grades)

# Function to validate grades (used by add_student and edit_student_grades)
def validate_grades(grades):
    for grade in grades:
        if not (0 <= grade <= 100):
            return False
    return True

# Added function to validate student name for first and last name
def validate_name(name):
    name_parts = name.strip().split()
    if len(name_parts) < 2:
        return False
    if not re.match(r'^[A-Za-z\s]+$', name):
        return False
    return True

# --- Search-related functions (menu options 2, 3, 4) ---
# Function to search for a student by name (exact match)
def search_student(students, name):
    for student in students:
        if student["name"].lower() == name.lower():
            return student
    return None

# Function to search for students by partial name (menu option 3)
def search_students_by_partial_name(students, partial_name):
    results = []
    for student in students:
        if partial_name.lower() in student["name"].lower():
            results.append(student)
    return results

# Function to search for students by average grade range (menu option 4)
def search_students_by_average(students, min_avg, max_avg):
    result = []
    for student in students:
        avg = calculate_average(student["grades"])
        if min_avg <= avg <= max_avg:
            result.append(student)
    return result

# --- Sort-related function (menu option 5) ---
# Function to sort students by average grade
def sort_students_by_average(students, ascending=True):
    return sorted(students, key=lambda s: calculate_average(s["grades"]), reverse=not ascending)

# --- Student modification functions (menu options 6, 7, 8) ---
# Function to add a student with validation (menu option 6)
def add_student(students, name, grades):
    if search_student(students, name):  # Check for duplicate name
        raise ValueError(f"Student {name} already exists.")
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100.")
    # Added name validation to require first and last name
    if not validate_name(name):
        raise ValueError("Name must include a first and last name (e.g., John Doe) with letters and spaces only.")
    student = {"name": name, "grades": grades}
    students.append(student)
    # Save to MongoDB instead of file
    students_collection.insert_one(student)

# Function to remove a student by name (menu option 7)
def remove_student(students, name):
    student = search_student(students, name)
    if student:
        students.remove(student)
        # Remove from MongoDB
        students_collection.delete_one({"name": name})
    else:
        raise ValueError(f"Student {name} not found")

# Function to update a student's grades (used by app.py for API)
def update_grades(students, name, grades):
    student = search_student(students, name)
    if not student:
        raise ValueError(f"Student {name} not found")
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100")
    student["grades"] = grades
    students_collection.update_one({"name": name}, {"$set": {"grades": grades}})

# Function to edit a student's grades (menu option 8)
def edit_student_grades(students, name, grades):
    student = search_student(students, name)
    if student:
        if not validate_grades(grades):
            raise ValueError("Grades must be between 0 and 100")
        student["grades"] = grades
        students_collection.update_one({"name": name}, {"$set": {"grades": grades}})
    else:
        raise ValueError(f"Student {name} not found")

# --- File I/O functions (menu options 9, 10, 11, 12) ---
# Function to export students to a CSV file (menu option 9)
def export_students_to_csv(students, filename="students_export.csv"):
    try:
        with open(filename, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Name", "Grades", "Average Grade"])
            for student in students:
                avg = calculate_average(student["grades"])
                writer.writerow([student["name"], student["grades"], f"{avg:.2f}"])
    except IOError:
        raise ValueError("Error: Could not export to CSV file.")

# Function to import students from a CSV file (menu option 10)
def import_students_from_csv(students, filename="students_export.csv"):
    try:
        with open(filename, "r", newline="") as file:
            reader = csv.reader(file)
            header = next(reader)
            if header != ["Name", "Grades", "Average Grade"]:
                raise ValueError("Error: Invalid CSV format. Expected columns: Name, Grades, Average Grade.")
            students.clear()
            # Clear MongoDB collection before importing
            students_collection.delete_many({})
            for row in reader:
                name = row[0]
                grades_str = row[1].strip("[]")
                grades = [int(g) for g in grades_str.split(", ") if g]
                if not validate_grades(grades):
                    raise ValueError(f"Error: Invalid grades for {name}. Grades must be between 0 and 100.")
                add_student(students, name, grades)
    except FileNotFoundError:
        raise ValueError(f"Error: File {filename} not found.")
    except IOError:
        raise ValueError("Error: Could not read from CSV file.")
    except ValueError as e:
        raise e

# Function to display basic statistics (menu option 11)
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

# Function to save students to a file (menu option 12)
def save_students(students, filename=os.getenv("DATA_PATH", "students.txt")):
    # Removed file I/O, now handled by MongoDB operations
    pass

# Function to load students from a file
def load_students(filename=os.getenv("DATA_PATH", "students.txt")):
    # Updated to load from MongoDB instead of file
    students = list(students_collection.find())
    # Ensure grades are integers (MongoDB stores as list of numbers)
    for student in students:
        student["grades"] = [int(g) for g in student["grades"]]
        # Remove MongoDB's _id field from the response
        student.pop("_id", None)
    return students

# Main program to load initial students
def main():
    students = load_students()
    if not students:
        add_student(students, "Richard Smith", [85, 90, 95, 88])
        add_student(students, "Alice Johnson", [90, 85, 92, 84])
        add_student(students, "Mike Brown", [99, 86, 90])
    return students

# Run the program
if __name__ == "__main__":
    main()