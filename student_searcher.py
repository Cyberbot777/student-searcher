# Student Searcher Program
# This script manages a list of students, allows searching by name or average, and saves data to a file.

import csv # Import the csv module for exporting and importing to CSV

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
    if not validate_grades(grades):
        raise ValueError("Grades must be between 0 and 100")
    student = {"name": name, "grades": grades}
    students.append(student)

# Function to remove a student by name (menu option 7)
def remove_student(students, name):
    student = search_student(students, name)
    if student:
        # Confirm removal with the user
        confirm = input(f"Are you sure you want to remove {name}? (yes/y or no/n): ").lower()
        if confirm in ['yes', 'y']:
            students.remove(student)
            print(f"Removed {name} successfully!")
        elif confirm in ['no', 'n']:
            print(f"Removal of {name} canceled.")
        else:
            print("Invalid input. Removal canceled.")
    else:
        print(f"Student {name} not found.")

# Function to edit a student's grades (menu option 8)
def edit_student_grades(students, name):
    student = search_student(students, name)
    if student:
        print(f"Current grades for {name}: {student['grades']}")
        confirm = input(f"Are you sure you want to edit grades for {name}? (yes/y or no/n): ").lower()
        if confirm in ['yes', 'y']:
            grades_input = input("Enter new grades (comma-separated, e.g., 86,90,95): ")
            try:
                new_grades = [int(g) for g in grades_input.split(",")]
                if not validate_grades(new_grades):
                    print("Error: Grades must be between 0 and 100.")
                    return
                student['grades'] = new_grades
                print(f"Updated grades for {name} successfully!")
            except ValueError as e:
                print(f"Error: {e}")
        elif confirm in ['no', 'n']:
            print(f"Editing grades for {name} canceled.")
        else:
            print("Invalid input. Please enter 'yes/y' or 'no/n'. Editing canceled.")
    else:
        print(f"Student {name} not found.")

# --- File I/O functions (menu option 9, 10, 11, 12) ---
# Function to export students to a CSV file (menu option 9)
def export_students_to_csv(students, filename="students_export.csv"):
    try:
        with open(filename, 'w', newline='') as file:
            writer = csv.writer(file)
            # Write the header
            writer.writerow(["Name", "Grades", "Average Grade"])
            # Write each student's data
            for student in students:
                avg = calculate_average(student["grades"])
                writer.writerow([student["name"], student["grades"], f"{avg:.2f}"])
        print(f"Successfully exported student data to {filename}!")
    except IOError:
        print("Error: Could not export to CSV file.")

# Function to import students from a CSV file (menu option 10)
def import_students_from_csv(students, filename="students_export.csv"):
    try:
        with open(filename, 'r', newline='') as file:
            reader = csv.reader(file)
            # Skip the header row
            header = next(reader)
            if header != ["Name", "Grades", "Average Grade"]:
                print("Error: Invalid CSV format. Expected columns: Name, Grades, Average Grade.")
                return
            # Clear existing students to avoid duplicates
            students.clear()
            # Read each row and add the student
            for row in reader:
                name = row[0]
                # Parse the grades from string representation (e.g., "[85, 90, 95, 88]")
                grades_str = row[1].strip("[]")
                grades = [int(g) for g in grades_str.split(", ") if g]
                if not validate_grades(grades):
                    print(f"Error: Invalid grades for {name}. Grades must be between 0 and 100. Skipping.")
                    continue
                add_student(students, name, grades)
        print(f"Successfully imported student data from {filename}!")
    except FileNotFoundError:
        print(f"Error: File {filename} not found.")
    except IOError:
        print("Error: Could not read from CSV file.")
    except ValueError as e:
        print(f"Error parsing CSV data: {e}")

# Added new function to display basic statistics (menu option 11)
def display_statistics(students):
    if not students:
        print("No students available to calculate statistics.")
        return
    # Calculate the class average (average of all students' average grades)
    averages = [calculate_average(student["grades"]) for student in students]
    class_average = sum(averages) / len(averages)
    # Find the highest and lowest average grades
    highest_avg = max(averages)
    lowest_avg = min(averages)
    # Find the students with the highest and lowest averages
    highest_student = next(student["name"] for student in students if calculate_average(student["grades"]) == highest_avg)
    lowest_student = next(student["name"] for student in students if calculate_average(student["grades"]) == lowest_avg)
    # Display the statistics
    print("\nClass Statistics:")
    print(f"Class Average: {class_average:.2f}")
    print(f"Highest Average: {highest_avg:.2f} (Student: {highest_student})")
    print(f"Lowest Average: {lowest_avg:.2f} (Student: {lowest_student})")

# Function to save students to a file (menu option 12)
def save_students(students, filename="/opt/render/students.txt"):
    try:
        with open(filename, 'w') as file:
            for student in students:
                file.write(f"{student['name']}: {student['grades']}\n")
    except IOError:
        print("Error: Could not save to file.")

# Function to load students from a file
def load_students(filename="/opt/render/students.txt"):
    students = []
    try:
        with open(filename, 'r') as file:
            for line in file:
                if not line.strip():
                    continue
                try:
                    name, grades_str = line.strip().split(": ", 1)
                    grades_str = grades_str.strip("[]")
                    grade_strings = [g for g in grades_str.split(", ") if g]
                    grades = [int(g) for g in grade_strings]
                    add_student(students, name, grades)
                except ValueError as e:
                    print(f"Error parsing line '{line.strip()}': {e}")
                except Exception as e:
                    print(f"Unexpected error parsing line '{line.strip()}': {e}")
    except FileNotFoundError:
        print("File not found. Starting with an empty student list.")
    except IOError:
        print("Error: Could not read from file.")
    return students

# Main program with a menu
def main():
    # Load existing students
    students = load_students()

    # Add some initial students if the list is empty
    if not students:
        add_student(students, "Richard", [85, 90, 95, 88])
        add_student(students, "Alice", [90, 85, 92, 84])
        add_student(students, "Mike", [99, 86, 90])

    while True:
        print("\nStudent Searcher Menu:")
        print("1. View all students")
        print("2. Search for a student by name (exact match)")
        print("3. Search for students by partial name")
        print("4. Search for students by average grade range")
        print("5. Sort students by average grade")
        print("6. Add a student")
        print("7. Remove a student")
        print("8. Edit a student's grades")
        print("9. Export student data to CSV")
        print("10. Import student data from CSV")
        print("11. Display class statistics")
        print("12. Save and exit")
        choice = input("Enter your choice (1-12): ")

        if choice == "1":
            print("\nAll students:")
            for student in students:
                avg = calculate_average(student["grades"])
                print(f"{student['name']}: Grades {student['grades']}, Average Grade: {avg:.2f}")

        elif choice == "2":
            name = input("Enter student name to search: ")
            student = search_student(students, name)
            if student:
                avg = calculate_average(student["grades"])
                print(f"Found {student['name']}: Grades {student['grades']}, Average Grade: {avg:.2f}")
            else:
                print(f"Student {name} not found.")

        elif choice == "3":
            partial_name = input("Enter partial name to search: ")
            results = search_students_by_partial_name(students, partial_name)
            if results:
                print("\nStudents matching partial name:")
                for student in results:
                    avg = calculate_average(student["grades"])
                    print(f"{student['name']}: Grades {student['grades']}, Average Grade: {avg:.2f}")
            else:
                print(f"No students found matching {partial_name}.")

        elif choice == "4":
            try:
                min_avg = float(input("Enter minimum average: "))
                max_avg = float(input("Enter maximum average: "))
                if min_avg > max_avg:
                    print("Minimum average cannot be greater than maximum average.")
                    continue
                results = search_students_by_average(students, min_avg, max_avg)
                if results:
                    print("\nStudents within average range:")
                    for student in results:
                        avg = calculate_average(student["grades"])
                        print(f"{student['name']}: Grades {student['grades']}, Average Grade: {avg:.2f}")
                else:
                    print("No students found in that average range.")
            except ValueError:
                print("Error: Averages must be numbers.")

        elif choice == "5":
            direction = input("Sort by average grade (ascending/descending): ").lower()
            if direction not in ['ascending', 'descending']:
                print("Invalid direction. Please choose 'ascending' or 'descending'.")
                continue
            ascending = (direction == 'ascending')
            sorted_students = sort_students_by_average(students, ascending)
            print(f"\nStudents sorted by average grade ({direction}):")
            for student in sorted_students:
                avg = calculate_average(student["grades"])
                print(f"{student['name']}: Grades {student['grades']}, Average Grade: {avg:.2f}")

        elif choice == "6":
            name = input("Enter student name: ")
            grades_input = input("Enter grades (comma-separated, e.g., 86,90,95): ")
            try:
                grades = [int(g) for g in grades_input.split(",")]
                add_student(students, name, grades)
                print(f"Added {name} successfully!")
            except ValueError as e:
                print(f"Error: {e}")

        elif choice == "7":
            name = input("Enter student name to remove: ")
            remove_student(students, name)

        elif choice == "8":
            name = input("Enter student name to edit grades: ")
            edit_student_grades(students, name)

        elif choice == "9":
            export_students_to_csv(students)

        elif choice == "10":
            import_students_from_csv(students)

        elif choice == "11":
            display_statistics(students)

        elif choice == "12":
            confirm = input("Are you sure you want to save and exit? (yes/y or no/n): ").lower()
            if confirm in ['yes', 'y']:
                save_students(students)
                print("Saved and exiting.")
                break
            elif confirm in ['no', 'n']:
                print("Exit canceled.")
            else:
                print("Invalid input. Exit canceled.")

        else:
            print("Invalid choice. Please try again.")

# Run the program
if __name__ == "__main__":
    main()

