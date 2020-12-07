
let editor;
let menuList = document.querySelector("#noteList");
let li = document.createElement("li");
let noteTitle = document.createElement("h3");
let noteEditorData = document.createElement("p");
let noteDate = document.createElement("p");
let favoriteImg = document.createElement("img");

BalloonEditor
    .create(document.querySelector('#editor'), {
        placeholder: 'Write your note here ...'
    })
    .then(newEditor => {
        editor = newEditor;
    })
    .catch(error => {
        console.error(error);
    });

// array of created notes + array with favorite-notes
var allNotes = [];
var favoriteNotes = [];
//console.log(allNotes);

//object constructur// Här sätter vi vilka attribut på objektet som vi vill ha.
//this pekar på det som "är" just nu, det värdet vi sätter in.
function NoteObject(title, editorData, timestamp, favorite) {
    this.title = title;
    this.editorData = editorData;
    this.timestamp = timestamp;
    this.favorite = favorite;
};

//function to print comments in left note-menu
function printNote(title, editorData, timestamp, favorite) {

    //Create html-elements in left note-menu
    // Här sätter vi bestämda strukturer/designen får det som kommer in i objektet's attribut.
    menuList = document.querySelector("#noteList");
    li = document.createElement("li");
    li.setAttribute("data-id", timestamp);
    noteTitle = document.createElement("h3");
    noteEditorData = document.createElement("p");
    noteDate = document.createElement("p");
    favoriteImg = document.createElement("img");

    //Add text content in left note-menu
    noteTitle.textContent = title;
    noteDate.textContent = moment().format('ll');
    const strippedString = editorData.replace(/(<([^>]+)>)/gi, "");
    noteEditorData.textContent = strippedString;
    favoriteImg.setAttribute('type', "submit");
    favoriteImg.textContent = favorite; //här är true / false
    favoriteImg.id = "favorite";

    //Add classes to text in left note-menu
    //Här hämtar vi klasserna för att få tillhörande information från html och css så allt blir enhetligt på sidan.
    // Eventuellt tanke för hur man lägger till CSS-MALL-STYLING? HÄMTA CSS CLASS??(Mathildas tankar)
    noteTitle.classList.add('noteTitle');
    noteDate.classList.add('noteDate');
    noteEditorData.classList.add('noteEditorData');
    favoriteImg.classList.add('favorite');

    //Bild skiftar beroende på om den är sann eller falsk.
    if(favorite == "true"){
        favoriteImg.src = "img/star-solid.svg";
    }else if(favorite == "false"){
        favoriteImg.src = "img/star-regular.svg";
    }

    //Append to DOM in note-menu
    li.appendChild(noteTitle);
    li.appendChild(noteDate);
    li.appendChild(noteEditorData);
    li.appendChild(favoriteImg);
    menuList.prepend(li);
}

//Funktion för att komplitera if-sats under denna funktion. 
//findMyNotes funktionen loopar igenom varje item, om den hittar key med propertyName "myNotes" return true && nu är båda parametrarna i if-satsen godkända och kan gå in.
function findMyNotes(){
    for(var i=0; i < localStorage.length; i++){
        var propertyName = localStorage.key(i);
        if(propertyName == "myNotes"){
            return true;
        }
    }
    return false;
}

//Fetch allPosts from local storage, if not empty.
if (localStorage.length !== 0 && findMyNotes() == true) {
    allNotes = JSON.parse(localStorage.getItem("myNotes"));
//MATHILDA TODO: Add functionality to fetch all notes with favorite TRUE
}

//Loop local array and print key values from objects in left note-menu. 
for (var i in allNotes) {
    printNote(allNotes[i].title, allNotes[i].editorData, allNotes[i].timestamp, allNotes[i].favorite);
}

//Function add latest note to array and print note in left note-menu. 
const createNote = document.forms.note;
createNote.addEventListener("submit", function (e) {
    e.preventDefault();
    let title = createNote.querySelector('#title').value;
    let editorData = editor.getData();
    let timestamp = Date.now();
    let favorite = "false";// default värdet för elementet/variabeln(?) så när objektek skapas så skapas det med värdet false(= inte favorit)


    printNote(title, editorData, timestamp, favorite);
    //ev. byta till knapp

    //Create new notebject and add to array.
    allNotes[allNotes.length] = new NoteObject(title, editorData, timestamp, favorite);

    //Convert array of object into string, and save to local storage
    localStorage.setItem("myNotes", JSON.stringify(allNotes));
});


//Click on note in note-menu and display in CK Editor
document.querySelector('ul.note-list').addEventListener('click', function (evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = Number(clickedLI.getAttribute('data-id'));
    let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
    editor.setData(clickedNoteObject.editorData);
    document.getElementById("title").value = clickedNoteObject.title;
    document.getElementsByClassName("noteDate").value = clickedNoteObject.timestamp;
});


//search for notes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const search = document.forms[1].querySelector('input');
search.addEventListener('keyup', function (e) {
    const term = e.target.value.toLowerCase();
    const notes = menuList.getElementsByTagName('li');
    Array.from(notes).forEach(function (note) {
        const title = note.firstElementChild.textContent;
        if (title.toLowerCase().indexOf(term) != -1) {
            note.style.display = 'block';
        } else {
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

// Favorite Function START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function deleteFavoriteNote(editorData, favoriteNotes){
    
    for(var i = 0; i < favoriteNotes.length; i++){
        //console.log(favoriteNotes[i]);
        if(favoriteNotes[i].editorData == editorData){
          favoriteNotes.splice(i, 1); //remove 1 element from index i
          localStorage.setItem("myFavoriteNotes", JSON.stringify(favoriteNotes));
        }
    }
}

// Med querySelectorAll hämtar vi klassen favorit
document.querySelectorAll(".favorite").forEach(favoriteButton => {
  favoriteButton.addEventListener("click", function (e) {
  e.preventDefault();

    var note = e.target.parentElement; //Parent i det här fallet är den skapade noten

  //Här skapas favoritnoten.
    let title = note.childNodes[0].textContent;
    let editorData = note.childNodes[2].textContent; //hämta vald notes content
    let timestamp = note.childNodes[1].textContent; // hämta datumet också
    let favorite = note.childNodes[3].textContent;

  // ATT GÖRA FAVORITER(::TRUE) LÄGGS IN I favoriteNotes arrayen.
  //testconetent kan inte vara boolean var tvungen att ändra till "string"
     if(e.target.textContent == "false"){
        favorite = e.target.textContent = "true";
        var newFavoriteNote = new NoteObject(title, editorData, timestamp, favorite);
        favoriteNotes.push(newFavoriteNote);
        localStorage.setItem("myFavoriteNotes", JSON.stringify(favoriteNotes));
        e.target.src = "img/star-solid.svg";
        // uppdatera favorites i local
        // * for loop ittererar genom allNotes
        // * i foor loopen ska det vara en if-sats
     }else if(e.target.textContent == "true"){
        e.target.textContent = "false";
        deleteFavoriteNote(editorData, favoriteNotes);
        e.target.src = "img/star-regular.svg";
    }
  
  });
});
// Favorite Function END:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// List all favorites function START :::::::::::::::::::::::::::::::::::::::::::::::::::
document.getElementById("listFavorites").addEventListener("click", function() {
    
    //const term = e.target.value.toLowerCase();
    const notes = menuList.getElementsByTagName('li');
    Array.from(notes).forEach(function (note) {
        const favorite = note.childNodes[3].textContent;
        
        console.log(favorite);
        
        if (favorite == "true") {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    })

});

// List all favorites function END :::::::::::::::::::::::::::::::::::::::::::::::::::


// DENNA SKA ALLA OBJEKT HA! ALLA OBJEKT BÖR HA ETT ID !!!!!!!!!!!!!!!!
var id = Math.floor(Math.random() * 1337);
console.log(id);

//TODO vad ska jag ittirera på? hur ska jag hitta en unik note, borde lägga till ID.