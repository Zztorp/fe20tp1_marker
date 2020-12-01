
let editor;
let menuList = document.querySelector("#noteList");

BalloonEditor
.create( document.querySelector( '#editor' ) )
.then( newEditor => {
editor = newEditor;
} )
.catch( error => {
console.error( error );
} );

// array of notes
var allNotes = [];

//object constructur
function NoteObject(title, editorData, timestamp) {
    this.title = title;
    this.editorData = editorData;
    this.timestamp = timestamp;
};

//print comment
function printNote(title, editorData, timestamp) {

//Create html-elements
let menuList = document.querySelector("#noteList");
let li = document.createElement("li");
li.setAttribute("data-id", timestamp);
let noteTitle = document.createElement("h3");
let noteEditorData = document.createElement("p");
let noteDate = document.createElement("p");
 
//Add content
noteTitle.textContent = title;
noteDate.textContent = timestamp;
noteEditorData.textContent = editorData;  
 
 //Add classes
 noteTitle.classList.add('noteTitle');
 noteDate.classList.add('noteDate');
 noteEditorData.classList.add('noteEditorData');

 //Append to DOM
li.appendChild(noteTitle);
li.appendChild(noteDate);
li.appendChild(noteEditorData);
menuList.prepend(li);
}

//Fetch allPosts from local storage, if it exists
if (localStorage.length !== 0) {
    allNotes = JSON.parse(localStorage.getItem("myNotes")); 
    console.log(allNotes);
    }
  
  //Loop local storage array
    for (var i in allNotes) {
    printNote(allNotes[i].title, allNotes[i].editorData, allNotes[i].timestamp);
}
  
//Add latest note
  const createNote = document.forms.note;
  createNote.addEventListener("submit", function(e){
  e.preventDefault();
  let title = createNote.querySelector('#title').value;
  let editorData = editor.getData();
  let timestamp = Date.now();
  printNote(title, editorData, timestamp);
  //ev. byta till knapp
  
//Save latest note to NoteObject
allNotes[allNotes.length] = new NoteObject(title, editorData, timestamp);

//convert array of object into string json and save to local storage
localStorage.setItem("myNotes", JSON.stringify(allNotes));
});

//open note from list in CK Editor
document.querySelector('ul.note-list').addEventListener('click', function (evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = Number(clickedLI.getAttribute('data-id'));
    let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
    editor.setData(clickedNoteObject.editorData);
    document.getElementById("title").value = clickedNoteObject.title
  
  });


//search for notes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const search = document.forms[1].querySelector('input');
search.addEventListener('keyup', function(e){
    const term = e.target.value.toLowerCase();
    const notes = menuList.getElementsByTagName('li');
    Array.from(notes).forEach(function(note){
        const title = note.firstElementChild.textContent;
        if(title.toLowerCase().indexOf(term) != -1){
            note.style.display = 'block';
        } else{
            note.style.display = 'none';
        }
    })
});

//Tabbed Content::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/* <!-- Funkar ännu inte    
const tabs = document.querySelector('.tabs');
const panels = document.querySelectorAll('.panel');
tabs.addEventListener('click', function(e){
    console.log(e.target.tagName)
    if(e.target.tagName == 'LI'){
        const targetPanel = document.querySelector(e.target.dataset.target);
        panels.forEach(function(panel){
            if(panel ==targetPanel){
                panel.classList.add('active');
            } else {
            panel.classList.remove('active');
        }
    })
}

})--> */

