import React, { useState, useEffect } from 'react';
import './App.css';
import Note from './components/Notes';
import noteService from './sevices/notes';
import Notification from './components/Notification';


const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState('some error happened')

    const notesToShow = showAll ? notes : notes.filter(note => note.important);

    useEffect(() => {
        noteService.getAll()
            .then(initialObj => {
                setNotes(initialObj)
            })
            .catch(err => {
                console.log('chec error');
                console.log(err);
            })
    }, [])

    const addNote = (event) => {
        event.preventDefault()
        const noteObj = {
            content: newNote,
            date: new Date().toISOString(),
            important: Math.random() > 0.5,
        }

        noteService.create(noteObj)
            .then(returnNote => {
                setNotes(notes.concat(returnNote))
                setNewNote('')
            })
    }

    const handleNoteChange = e => {
        setNewNote(e.target.value)
    }

    const toggleImportant = id => {
        const note = notes.find(n => n.id === id)
        const changeNote = {...note, important: !note.important}

        noteService.update(id, changeNote)
            .then(returnNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnNote))
            })
            .catch(err => {
                setErrorMessage(`Note ${note.content} removed from server`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
                setNotes(notes.filter(n => n.id !== id))
            })
    }

    const rows = () => notesToShow.map(note => <Note key={note.id} note={note} toggleImportant={() => toggleImportant(note.id)}/>);

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {rows()}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type='submit'>save</button>
            </form>
        </div>
    )
}

export default App;
