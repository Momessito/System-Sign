import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

function CourseDetails() {
  const { courseName } = useParams();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllStudents(studentsData);
      setStudents(studentsData.filter(student => student.courses.includes(courseName)));
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [courseName]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'students', id));
  };

  const handleCourseRemove = async (student, course) => {
    const updatedCourses = student.courses.filter(c => c !== course);
    const studentDoc = doc(db, 'students', student.id);
    await updateDoc(studentDoc, {
      courses: updatedCourses
    });
  };

  const handleAddToCourse = async () => {
    for (const studentId of selectedStudents) {
      const studentDoc = doc(db, 'students', studentId);
      const studentSnapshot = await getDoc(studentDoc);
      if (studentSnapshot.exists()) {
        const studentData = studentSnapshot.data();
        const updatedCourses = [...studentData.courses, courseName];
        await updateDoc(studentDoc, {
          courses: updatedCourses
        });
      }
    }
    setSelectedStudents([]);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const availableStudents = allStudents.filter(student => !student.courses.includes(courseName));

  const handleSelectedStudentsChange = (event) => {
    const { options } = event.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setSelectedStudents(selected);
  };

  return (
    <div>
        <Navbar />
      <h3>Alunos do curso: {courseName}</h3>
      <button onClick={handlePrint}>Imprimir Lista</button>
      <div className="overflow-x-auto" ref={componentRef}>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Cursos</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.courses.join(', ')}</td>
                <td className="actions-column">
                  <button onClick={() => handleDelete(student.id)}>Deletar</button>
                  <button onClick={() => handleCourseRemove(student, courseName)}>Remover do Curso</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h4>Adicionar alunos ao curso</h4>
        <select multiple value={selectedStudents} onChange={handleSelectedStudentsChange}>
          {availableStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddToCourse}>Adicionar ao Curso</button>
      </div>
    </div>
  );
}

export default CourseDetails;
