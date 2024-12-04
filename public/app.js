document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

// Get the current URL's origin
const API_BASE_URL = window.location.origin;

// Load all notes
async function loadNotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/notes`);
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error loading notes:', error);
        alert('Failed to load notes. Check console for details.');
    }
}

// Display notes in the UI
function displayNotes(notes) {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';
    
    if (!Array.isArray(notes)) {
        console.error('Expected notes to be an array, got:', notes);
        return;
    }
    
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote('${note._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteNote('${note._id}')">Delete</button>
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
        console.log('Saving note:', { title, content });
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const savedNote = await response.json();
        console.log('Note saved successfully:', savedNote);
        
        titleInput.value = '';
        contentInput.value = '';
        loadNotes();
        alert('Note saved successfully!');
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note. Check console for details.');
    }
});

// Edit note
async function editNote(id) {
    try {
        const newTitle = prompt('Enter new title:');
        if (!newTitle) return;
        
        const newContent = prompt('Enter new content:');
        if (!newContent) return;
        
        console.log('Updating note:', { id, title: newTitle, content: newContent });
        const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                content: newContent
            })
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        loadNotes();
        alert('Note updated successfully!');
    } catch (error) {
        console.error('Error updating note:', error);
        alert('Failed to update note. Check console for details.');
    }
}

// Delete note
async function deleteNote(id) {
    try {
        if (!confirm('Are you sure you want to delete this note?')) return;
        
        console.log('Deleting note:', id);
        const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        loadNotes();
        alert('Note deleted successfully!');
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Check console for details.');
    }
}
