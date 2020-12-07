
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

var allNotes = [];
var favoriteNotes = [];
//console.log(allNotes);

function NoteObject(title, editorData, timestamp) {
    this.title = title;
    this.editorData = editorData;
    this.timestamp = timestamp;
    this.favorite = favorite;
};

// ---- print notes in left note-menu
function printNote(title, editorData, timestamp) {

    //Create html-elements
    let menuList = document.querySelector("#noteList");
    let li = document.createElement("li");
    li.setAttribute("data-id", timestamp);
    noteTitle = document.createElement("h3");
    noteEditorData = document.createElement("p");
    noteDate = document.createElement("p");
    favoriteImg = document.createElement("img");

    //Add text content
    noteTitle.textContent = title;
    noteDate.textContent = moment().format('ll');
    let strippedString = editorData.replace(/(<([^>]+)>)/gi, "");
    noteEditorData.textContent = strippedString;
    favoriteImg.setAttribute('type', "submit");
    favoriteImg.textContent = favorite; //här är true / false
    favoriteImg.id = "favorite";

    //Add classes
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

    //Append to DOM
    li.appendChild(noteTitle);
    li.appendChild(noteDate);
    li.appendChild(noteEditorData);
    li.appendChild(favoriteImg);
    menuList.prepend(li);
}

//---- collect array objects from local storage
function collectFromLocalStorage() {
    if (localStorage.length !== 0) {
        allNotes = JSON.parse(localStorage.getItem("myNotes"));
    }
    for (var i = 0; i < allNotes.length; i++) {
        printNote(allNotes[i].title, allNotes[i].editorData, allNotes[i].timestamp);
    }
};

//---- remove note from sidebar
function unprint(title) {
    let menuList = document.querySelector("#noteList").children;
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].getElementsByClassName('noteTitle')[0].textContent == title) {
            menuList[i].remove();
        }
    }
}

collectFromLocalStorage();

//---- add latest note to array and print array in left menu
const createNote = document.forms.note;
createNote.addEventListener("submit", function (e) {
    e.preventDefault();
    let title = createNote.querySelector('#title').value;
    let editorData = editor.getData();
    let timestamp = Date.now();
    printNote(title, editorData, timestamp);

    allNotes[allNotes.length] = new NoteObject(title, editorData, timestamp);

    localStorage.setItem("myNotes", JSON.stringify(allNotes));
});

//--- give note ID and display in CK Editor
document.querySelector('ul.note-list').addEventListener('click', function (evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = Number(clickedLI.getAttribute('data-id'));
    let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
    editor.setData(clickedNoteObject.editorData);
    document.getElementById("title").value = clickedNoteObject.title;
});


//  --- new note button
document.querySelector("body > div.tabbed-content > ul > li:nth-child(2)").addEventListener("click", function (e) {
    location.reload();
})


//  --- delete note button

document.querySelector("#deleteNote").addEventListener("click", function (e) {
    const currentNote = document.forms.note;
    let title = currentNote.querySelector('#title').value;
    unprint(title);
    allNotes = JSON.parse(localStorage.getItem("myNotes"));
    allNotes = allNotes.filter(function (obj) {
        return obj.title !== title;
    });
    localStorage.setItem("myNotes", JSON.stringify(allNotes));
    location.reload();

});



//  --- print note button

document.querySelector("body > div.tabbed-content > ul > li:nth-child(5)").addEventListener("click", function (e) {
    var divContents = document.querySelector("#editor").innerHTML;
    //  --- ADDS TITLE VALUE TO PRINT 
    var title = document.querySelector("#title").value;


    var a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body > <h3>' + title + '</h3>');     //  -- ADDS TITLE VALUE TO PRINT 

    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.print();
})
//search for notes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const search = document.forms[0].querySelector('input[name="search"]');
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

