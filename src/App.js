import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { db } from './firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import StudentForm from './StudentForm';
import StudentList from './StudentList';
import CourseDetails from './CourseDetails';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <StudentForm />
                <StudentList students={students} />
              </>
            }
          />
          <Route
            path="/course/:courseName"
            element={<CourseDetails />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
