# Student Data Parsing Snippet
# This code parses a grades string into a list of integers, used in student data processing.

# Parse grades string (assumed from students.txt line)
print("Name:", name, "Grades string:", grades_str)
# Remove brackets and split grades
grades_str = grades_str.strip("[]")
# Split grades and filter out empty strings
grade_strings = [g for g in grades_str.split(", ") if g]
# Convert to integers
grades = [int(g) for g in grade_strings]