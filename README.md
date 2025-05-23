# Student Searcher

**View Live Demo: [https://student-searcher.vercel.app/](https://student-searcher.vercel.app/)**

## Overview
`Student Searcher` is a full-stack web application for managing student records. Originally a Python-based command-line tool, it has been enhanced with a Flask backend and a React frontend, deployed on Render and Vercel. Users can view, search, manage, and analyze student data through an intuitive web interface, with data persisted in MongoDB Atlas (`StudentSearcherCluster`).

## Features
- **View All Students:** Display all students in a table with names, grades, and average grades on the Home page.
- **Search by Name (Exact Match):** Search for a student by their exact name (case-insensitive) via the Search page.
- **Search by Partial Name:** Find students whose names contain a substring (case-insensitive) on the Search page.
- **Search by Average Grade Range:** Find students with average grades in a specified range on the Search page.
- **Add a Student:** Add a new student with validated name and grades through the Manage page.
- **Remove a Student:** Remove a student with confirmation.
- **Edit a Student's Grades:** Update a student’s grades on the Manage page.
- **Display Class Statistics:** Show class average, highest average grade, and lowest average grade, with corresponding students, on the Stats page.
- **Sort Students:** Sort the student list table by:
  - **Name**: Click the "Name" header to toggle between A-Z, Z-A, or default sort (on both Home and Manage pages).
  - **Average Grade**: Click the "Average Grade" header to toggle between ascending (lowest to highest), descending (highest to lowest), or default sort (on both Home and Manage pages).
- **Custom Table Layouts:** Independent column widths for Home and Manage pages.
- **Data Persistence:** Save student data to MongoDB Atlas (`StudentSearcherCluster`), updated automatically after add/edit/remove actions.
- **Input Validation:** Ensures names contain only letters and spaces, grades are numbers between 0 and 100, and API inputs are valid.

## Technologies
- **Backend**:
  - **Python**: Core programming language for the backend logic.
  - **Flask**: Web framework for the RESTful API, handling routes and requests.
  - **Flask-CORS**: Enables Cross-Origin Resource Sharing for frontend-backend communication.
  - **Gunicorn**: WSGI server for deploying the Flask app on Render.
- **Frontend**:
  - **React**: JavaScript library for building the user interface.
  - **Axios**: Promise-based HTTP client for making API requests to the backend.
  - **React Bootstrap**: For responsive UI components (tables, forms, buttons).
  - **React Bootstrap Icons**: For trashcan icons in the Manage page table.
  - **Create React App**: Boilerplate for setting up the React project.
- **Deployment**:
  - **Render**: Hosts the Flask backend at `https://student-searcher-backend.onrender.com`.
  - **Vercel**: Hosts the React frontend at `https://student-searcher.vercel.app`.
  - **GitHub**: Version control and source code hosting.
- **Database**:
  - MongoDB Atlas (`StudentSearcherCluster`) for persistent data storage on the server.

## Usage Instructions
1. **Access the Web App**:
   - Visit **View Live Demo: [https://student-searcher.vercel.app/](https://student-searcher.vercel.app/)** in a browser.
   - Navigate using the menu:
     - **Home**: View all students with sortable table.
     - **Search**: Search by name (exact or partial) or grade range.
     - **Manage**: Add, edit, or remove students with sortable table.
     - **Stats**: View class statistics.

2. **Interact with Features**:
   - **Search**: Enter a name or grade range in the Search page form.
   - **Manage**: Use forms to add a new student (name, comma-separated grades), edit grades, or remove a student via trashcan icon.
   - **Stats**: View class average, highest, and lowest grades automatically.
   - **Sort**: Click "Name" or "Average Grade" headers to sort the student list (A-Z/Z-A or ascending/descending).

3. **Input Requirements**:
   - **Names**: Must contain only letters and spaces (e.g., "John Doe").
   - **Grades**: Must be comma-separated numbers between 0 and 100 (e.g., "86,90,95").

4. **Development Setup (Optional)**:
   - Clone the repository: `git clone https://github.com/Cyberbot777/student-searcher.git`
   - **Backend**:
     - Navigate to `student-searcher`: `cd student-searcher`
     - Install dependencies: `pip install -r requirements.txt`
     - Run Flask: `python app.py`
   - **Frontend**:
     - Navigate to `frontend/student-searcher-frontend`: `cd frontend/student-searcher-frontend`
     - Install dependencies: `npm install`
     - Run React: `npm start`
   - Access locally: `http://localhost:3000` (React) and `http://localhost:5000` (Flask).

## Skills Demonstrated
- Full-stack development
- Python and Flask for RESTful API development
- React for dynamic frontend interfaces
- Axios for asynchronous API requests
- File I/O with text files
- Error handling and input validation
- Data analysis (statistics calculation)
- Sorting and interactive UI features
- Deployment with Render and Vercel
- Version control with Git and GitHub

## Updates and Enhancements
- Converted storage from `students.txt` to MongoDB Atlas (`StudentSearcherCluster`) for scalable, persistent data storage.
- Updated `student_searcher.py` to use MongoDB for all data operations (add, remove, update, load).
- Fixed `ObjectId` serialization issue by removing `_id` fields from MongoDB documents before JSON serialization.
- Resolved CORS errors by simplifying Flask-CORS configuration to allow all origins and methods.
- Removed CLI prompts (e.g., `input()` in `remove_student`, `edit_student_grades`) to make backend functions API-friendly.
- Added MongoDB dependency (`pymongo`) to `requirements.txt` for backend setup.
- Updated Manage page placeholders to "e.g., First Last name" for clarity on name input requirements.

## Author
- Richard Hall

## Date
- Created: March 25, 2025
- Last Updated: May 22, 2025