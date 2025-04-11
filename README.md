# Student Searcher

## Overview
`Student Searcher` is a Python-based student management system that allows users to manage student records through a command-line interface. It supports adding, removing, editing, searching, sorting, and analyzing student data, with persistence via file I/O and CSV export/import capabilities.

## Features
- **View All Students:** Display all students in a table-like format with names, grades, and average grades.
- **Search by Name (Exact Match):** Find a student by their exact name (case-insensitive).
- **Search by Partial Name:** Find students whose names contain a given substring (case-insensitive).
- **Search by Average Grade Range:** Find students whose average grade falls within a specified range.
- **Sort by Average Grade:** Sort students by their average grade in ascending or descending order.
- **Add a Student:** Add a new student with validated name and grades.
- **Remove a Student:** Remove a student with user confirmation.
- **Edit a Student's Grades:** Update a student’s grades with user confirmation.
- **Export to CSV:** Export student data (name, grades, average grade) to a CSV file (`students_export.csv`).
- **Import from CSV:** Import student data from a CSV file, replacing the current list.
- **Display Class Statistics:** Show the class average, highest average grade, and lowest average grade, along with the corresponding students.
- **Save and Exit:** Save student data to a text file (`students.txt`) and exit the program.
- **Input Validation:** Ensures names contain only letters and spaces, grades are valid numbers between 0 and 100, and menu choices are numeric and within range.

## Usage Instructions
1. **Run the Program:**
   - Ensure you have Python 3 installed.
   - Clone this repository: `git clone https://github.com/Cyberbot777/student-searcher.git`
   - Navigate to the repository directory: `cd student-searcher`
   - Run the script: `python student_searcher.py`

2. **Interact with the Menu:**
   - The program displays a menu with options 1-12.
   - Enter the number corresponding to your desired action (e.g., `1` to view all students).
   - Follow the prompts to provide input (e.g., names, grades, ranges).

3. **Input Requirements:**
   - **Names:** Must be non-empty and contain only letters and spaces (e.g., "John Doe").
   - **Grades:** Must be comma-separated numbers between 0 and 100 (e.g., "86,90,95").
   - **Menu Choices:** Must be a number between 1 and 12.

4. **File I/O:**
   - The program loads student data from `students.txt` on startup (if it exists).
   - On exit, it saves the current student list to `students.txt`.
   - The export/import features use `students_export.csv` for CSV operations.


## Skills Demonstrated
- Python programming
- Data structures (lists, dictionaries)
- Functions and modular design
- File I/O (text and CSV)
- Error handling and input validation
- Sorting and searching algorithms
- Basic data analysis (statistics)

## Author
- Richard

## Date
- Created: March 25, 2025
- Last Updated: April 11, 2025

