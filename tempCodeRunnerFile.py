lit(": ", 1)
                    print("Name:", name, "Grades string:", grades_str)
                    # Remove brackets and split grades
                    grades_str = grades_str.strip("[]")
                    # Split grades and filter out empty strings
                    grade_strings = [g for g in grades_str.split(", ") if g]
                    # Convert to integers
                    grades = [int(g) for g in grade_s