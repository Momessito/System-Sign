import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Navbar from './Navbar';

function StudentForm({ fetchStudents }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [courses, setCourses] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && age && courses.length > 0) {
      await addDoc(collection(db, 'students'), {
        name,
        age: parseInt(age),
        courses,
      });
      setName('');
      setAge('');
      setCourses([]);
      fetchStudents();
    }
  };

  const handleCourseChange = (course) => {
    setCourses((prevCourses) =>
      prevCourses.includes(course) ? prevCourses.filter((c) => c !== course) : [...prevCourses, course]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
                <Navbar />

      <div>
        <label>
          Nome:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Idade:
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Cursos:
          <div>
            <label>
              <input
                type="checkbox"
                value="Informática"
                checked={courses.includes('Informática')}
                onChange={() => handleCourseChange('Informática')}
              />
              Informática
            </label>
            <label>
              <input
                type="checkbox"
                value="Muay Thai"
                checked={courses.includes('Muay Thai')}
                onChange={() => handleCourseChange('Muay Thai')}
              />
              Muay Thai
            </label>
            <label>
              <input
                type="checkbox"
                value="Maquiagem"
                checked={courses.includes('Maquiagem')}
                onChange={() => handleCourseChange('Maquiagem')}
              />
              Maquiagem
            </label>
          </div>
        </label>
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default StudentForm;
