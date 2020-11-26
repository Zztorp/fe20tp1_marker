
let editor;

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
function printNote(title, timestamp) {

//Create html-element
    let menuList = document.querySelector("#right");
    let li = document.createElement("li");
    let menuTitle = document.createElement("h3");
    let menuDate = document.createElement("p");
 
//Add content
menuTitle.textContent = title;
menuDate.textContent = timestamp;  
 
 //Add classes
 menuTitle.classList.add('menuTitle');
 menuDate.classList.add('menuDate');

 //Append to DOM
li.appendChild(menuTitle);
li.appendChild(menuDate);
menuList.prepend(li);
}

//Fetch allPosts from local storage, if it exists
if (localStorage.length !== 0) {
    allNotes = JSON.parse(localStorage.getItem("myNotes")); 
    console.log(allNotes);
    }
  
  //Loop local storage array
    for (var i in allNotes) {
    let displayDate = new Date();
    printNote(allNotes[i].title,allNotes[i].editorData,displayDate);
}
  
//Add latest note
  const createNote = document.forms.note;
  createNote.addEventListener("submit", function(e){
  e.preventDefault();
  let title = createNote.querySelector('#title').value;
  let editorData = editor.getData();
  let timestamp = Date.now();
  printNote(title, editorData, timestamp);
  
//Save latest note to NoteObject
allNotes[allNotes.length] = new NoteObject(title, editorData);

//convert array of object into string json and save to local storage
localStorage.setItem("myNotes", JSON.stringify(allNotes));
});