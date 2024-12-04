document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

const API_URL = 'http://localhost:3000/api';

// Load all notes
async function loadNotes() {
    try {
        const response = await fetch(`${API_URL}/notes`);
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Display notes in the UI
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote('${note.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
            </div>
        `;
        notesList.appendChild(noteElement);
    });
}

// Save new note
document.getElementById('saveNote').addEventListener('click', async () => {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            titleInput.value = '';
            contentInput.value = '';
            loadNotes();
        }
    } catch (error) {
        console.error('Error saving note:', error);
    }
});

// Edit note
async function editNote(id) {
    const newTitle = prompt('Enter new title:');
    if (!newTitle) return;
    
    const newContent = prompt('Enter new content:');
    if (!newContent) return;
    
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })
        });
        
        if (response.ok) {
            loadNotes();
        }
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// Delete note
async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadNotes();
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}
