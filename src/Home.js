import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';

function Home() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
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

  const handleCourseChange = (course) => {
    setCourses(prevCourses =>
      prevCourses.includes(course)
        ? prevCourses.filter(c => c !== course)
        : [...prevCourses, course]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && age && courses.length > 0) {
      await addDoc(collection(db, 'students'), {
        name,
        age: parseInt(age),
        courses
      });
      fetchStudents(); // Refresh the list after adding a new student
      setName('');
      setAge('');
      setCourses([]);
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

  const handleEditCourseChange = (course) => {
    setCurrentStudent(prevStudent => ({
      ...prevStudent,
      courses: prevStudent.courses.includes(course)
        ? prevStudent.courses.filter(c => c !== course)
        : [...prevStudent.courses, course]
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (currentStudent.name && currentStudent.age && currentStudent.courses.length > 0) {
      const studentDoc = doc(db, 'students', currentStudent.id);
      await updateDoc(studentDoc, {
        name: currentStudent.name,
        age: parseInt(currentStudent.age),
        courses: currentStudent.courses
      });
      setIsEditPopupOpen(false);
      setCurrentStudent(null);
      fetchStudents(); // Refresh the list after editing a student
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (searchAge === '' || student.age === parseInt(searchAge)) &&
    (searchCourse === '' || student.courses.includes(searchCourse))
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
      <h3>Lista de Alunos</h3>
      <input
        type="text"
        placeholder="Pesquisar por nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="number"
        placeholder="Pesquisar por idade"
        value={searchAge}
        onChange={(e) => setSearchAge(e.target.value)}
      />
      <select
        value={searchCourse}
        onChange={(e) => setSearchCourse(e.target.value)}
      >
        <option value="">Filtrar por curso</option>
        <option value="Informática">Informática</option>
        <option value="Muay Thai">Muay Thai</option>
        <option value="Maquiagem">Maquiagem</option>
      </select>
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
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.courses ? student.courses.join(', ') : ''}</td>
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
                  Cursos:
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        value="Informática"
                        checked={currentStudent.courses.includes('Informática')}
                        onChange={() => handleEditCourseChange('Informática')}
                      />
                      Informática
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Muay Thai"
                        checked={currentStudent.courses.includes('Muay Thai')}
                        onChange={() => handleEditCourseChange('Muay Thai')}
                      />
                      Muay Thai
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Maquiagem"
                        checked={currentStudent.courses.includes('Maquiagem')}
                        onChange={() => handleEditCourseChange('Maquiagem')}
                      />
                      Maquiagem
                    </label>
                  </div>
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

export default Home;
