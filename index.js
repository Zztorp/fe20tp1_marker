
let editor;

BalloonEditor
  .create(document.querySelector('#editor'))
  .then(newEditor => {
    editor = newEditor;
  })
  .catch(error => {
    console.error(error);
  });

// array of notes
var allNotes = [];

//object constructur
function NoteObject(title, editorData, timestamp) {
  this.title = title;
  this.editorData = editorData;
  this.timestamp = timestamp;
};

//print note
function printNote(title, editorData, timestamp) {

  //Create html-element
  let menuList = document.querySelector("#right");
  let li = document.createElement("li");
  li.setAttribute("data-id", timestamp);
  let menuTitle = document.createElement("h3");
  let menuEditorData = document.createElement("p");
  let menuDate = document.createElement("p");

  //Add content
  menuTitle.textContent = title;
  menuDate.textContent = timestamp;
  menuEditorData.textContent = editorData;

  //Add classes
  menuTitle.classList.add('menuTitle');
  menuEditorData.classList.add('menuEditorData');
  menuDate.classList.add('menuDate');

  //Append to DOM
  li.appendChild(menuTitle);
  li.appendChild(menuDate);
  li.appendChild(menuEditorData);
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
createNote.addEventListener("submit", function (e) {
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

//open note through gray navbar
document.querySelector('ul.right').addEventListener('click', function (evt) {
  let clickedLI = evt.target.closest('li');
  let clickedID = Number(clickedLI.getAttribute('data-id'));
  let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
  editor.setData(clickedNoteObject.editorData);
  document.getElementById("title").value = clickedNoteObject.title

});
