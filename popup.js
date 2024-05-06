document.addEventListener('DOMContentLoaded', function () {
  const notesContainer = document.getElementById('notes-container');
  const newNote = document.getElementById('new-note');
  const clipButton = document.querySelector('.button-54');


  chrome.storage.sync.get(['notes'], function (result) {
    if (result.notes) {
      result.notes.forEach((note, index) => {
        addNoteToDOM(note, index);
      });
    }
  });


  function addNoteToDOM(note, index) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-container';
    
    const noteText = document.createElement('p');
    noteText.className = 'note';
    noteText.textContent = note;
    noteDiv.appendChild(noteText);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'note-buttons';

    const copyButton = document.createElement('button');
    copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
    copyButton.addEventListener('click', function () {
      navigator.clipboard.writeText(note);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
    deleteButton.addEventListener('click', function () {
      chrome.storage.sync.get(['notes'], function (result) {
        const notes = result.notes || [];
        notes.splice(index, 1);
        chrome.storage.sync.set({ 'notes': notes });
        noteDiv.remove();
      });
    });

    buttonsDiv.appendChild(copyButton);
    buttonsDiv.appendChild(deleteButton);
    noteDiv.appendChild(buttonsDiv);
    notesContainer.appendChild(noteDiv);
  }


  clipButton.addEventListener('click', function () {
    const noteText = newNote.value.trim();
    if (noteText) {
      chrome.storage.sync.get(['notes'], function (result) {
        const notes = result.notes || [];
        notes.push(noteText);
        chrome.storage.sync.set({ 'notes': notes });
        addNoteToDOM(noteText, notes.length - 1);
        newNote.value = '';
      });
    }
  });
});
