import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const componentRef = useRef();

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const studentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(studentsData);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && age && course) {
      await addDoc(collection(db, 'students'), {
        name,
        age: parseInt(age),
        course
      });
      fetchStudents(); // Refresh the list after adding a new student
      setName('');
      setAge('');
      setCourse('');
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'students', id));
    fetchStudents(); // Refresh the list after deleting a student
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsEditPopupOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (currentStudent.name && currentStudent.age && currentStudent.course) {
      const studentDoc = doc(db, 'students', currentStudent.id);
      await updateDoc(studentDoc, {
        name: currentStudent.name,
        age: parseInt(currentStudent.age),
        course: currentStudent.course
      });
      setIsEditPopupOpen(false);
      setCurrentStudent(null);
      fetchStudents(); // Refresh the list after editing a student
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="App">
      <h2>Cadastro de Alunos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nome:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Idade:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Curso:
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      <h3>Lista de Alunos</h3>
      <input
        type="text"
        placeholder="Pesquisar por nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handlePrint}>Imprimir Lista</button>
      <div className="overflow-x-auto" ref={componentRef}>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Curso</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.course}</td>
                <td className="actions-column">
                  <button onClick={() => handleEdit(student)}>Editar</button>
                  <button onClick={() => handleDelete(student.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Editar Aluno</h3>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={currentStudent.name}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Idade:
                  <input
                    type="number"
                    value={currentStudent.age}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, age: e.target.value })}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Curso:
                  <input
                    type="text"
                    value={currentStudent.course}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, course: e.target.value })}
                    required
                  />
                </label>
              </div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setIsEditPopupOpen(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
#   S y s t e m - S i g n  
 