import React, { useRef, useState } from 'react';
import { db } from './firebaseConfig';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import './App.css';
import Navbar from './Navbar';

function StudentList({ students }) {
  const [editStudent, setEditStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editCourses, setEditCourses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'students', id));
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleEditClick = (student) => {
    setEditStudent(student);
    setEditName(student.name);
    setEditAge(student.age);
    setEditCourses(student.courses || []);
    setShowPopup(true);
  };

  const handleCourseChange = (course) => {
    setEditCourses((prevCourses) =>
      prevCourses.includes(course)
        ? prevCourses.filter((c) => c !== course)
        : [...prevCourses, course]
    );
  };

  const handleSave = async () => {
    const studentDoc = doc(db, 'students', editStudent.id);
    await updateDoc(studentDoc, {
      name: editName,
      age: parseInt(editAge),
      courses: editCourses,
    });
    setShowPopup(false);
  };

  return (
    <div>
      <h3>Lista de Alunos</h3>
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
                  <button onClick={() => handleEditClick(student)}>Editar</button>
                  <button onClick={() => handleDelete(student.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Editar Aluno</h3>
            <label>
              Nome:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
            <label>
              Idade:
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </label>
            <label>
              Cursos:
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="Informática"
                    checked={editCourses.includes('Informática')}
                    onChange={() => handleCourseChange('Informática')}
                  />
                  Informática
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Muay Thai"
                    checked={editCourses.includes('Muay Thai')}
                    onChange={() => handleCourseChange('Muay Thai')}
                  />
                  Muay Thai
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Maquiagem"
                    checked={editCourses.includes('Maquiagem')}
                    onChange={() => handleCourseChange('Maquiagem')}
                  />
                  Maquiagem
                </label>
              </div>
            </label>
            <button onClick={handleSave}>Salvar</button>
            <button onClick={() => setShowPopup(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
