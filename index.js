
let editor;
let menuList = document.querySelector("#noteList");
let li = document.createElement("li");
let noteTitle = document.createElement("h3");
let noteEditorData = document.createElement("p");
let noteDate = document.createElement("p");
let favoriteImg = document.createElement("img");


/* ========== CK Editor ================== */
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


function NoteObject(title, editorData, timestamp, favorite) {
    this.title = title;
    this.editorData = editorData;
    this.timestamp = timestamp;
    this.favorite = favorite;
};

// -- get active note
function getActiveNote() {
    if (document.querySelector('.active')) {
        return document.querySelector('.active').getAttribute('data-id')
    }
}

// ---- print notes in left note-menu
function printNote(title, editorData, timestamp, favorite) {

    //Create html-elements
    menuList = document.querySelector("#noteList");
    li = document.createElement("li");
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

    //favorite
    favoriteImg.setAttribute('type', "submit");
    favoriteImg.textContent = favorite; //här är true / false
    favoriteImg.id = "favorite";

    //Add classes
    noteTitle.classList.add('noteTitle');
    noteDate.classList.add('noteDate');
    noteEditorData.classList.add('noteEditorData');
    favoriteImg.classList.add('favorite');

    //Append to DOM
    li.appendChild(noteTitle);
    li.appendChild(noteDate);
    li.appendChild(noteEditorData);
    li.appendChild(favoriteImg);
    menuList.prepend(li);

    //From regular-star(false) to solid-star(true)
    if (favorite == "true") {
        favoriteImg.src = "img/star-solid.svg";
    } else if (favorite == "false") {
        favoriteImg.src = "img/star-regular.svg";
    }
}

/*
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
*/

//---- collect array objects from local storage
function collectFromLocalStorage() {
    if (localStorage.length !== 0) {
        allNotes = JSON.parse(localStorage.getItem("myNotes"));
    }
    for (var i = 0; i < allNotes.length; i++) {
        printNote(allNotes[i].title, allNotes[i].editorData, allNotes[i].timestamp, allNotes[i].favorite);
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

function updateNote() {
    let noteObj = allNotes.find(note => note.timestamp == getActiveNote());
    noteObj.editorData = editor.getData();
    noteObj.title = createNote.querySelector('#title').value;
    localStorage.setItem("myNotes", JSON.stringify(allNotes));
}

function updateNote() {
    let noteObj = allNotes.find(note => note.timestamp == getActiveNote());
    noteObj.editorData = editor.getData();
    noteObj.title = createNote.querySelector('#title').value;
    localStorage.setItem("myNotes", JSON.stringify(allNotes));
}

//---- add latest note to array and print array in left menu
const createNote = document.forms.note;
createNote.addEventListener("submit", function (e) {
    e.preventDefault(); /* Sidan behöver laddas om för att inte bugga favorite funktionen efter att en note skapas */

    if (getActiveNote()) {
        let noteObj = allNotes.find(note => note.timestamp == getActiveNote());
        noteObj.editorData = editor.getData();
        noteObj.title = createNote.querySelector('#title').value;
        localStorage.setItem("myNotes", JSON.stringify(allNotes));
    }

    else {

        let title = createNote.querySelector('#title').value;
        let editorData = editor.getData();
        let timestamp = Date.now(); //Should timestamp be the "ID" of each note?
        let favorite = "false"; // Give cr8ted note false default value.

        allNotes[allNotes.length] = new NoteObject(title, editorData, timestamp, favorite);

        printNote(title, editorData, timestamp, favorite);
        localStorage.setItem("myNotes", JSON.stringify(allNotes));
    }
});

//--- give note ID and display in CK Editor
document.querySelector('ul.note-list').addEventListener('click', function (evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = Number(clickedLI.getAttribute('data-id'));
    let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
    editor.setData(clickedNoteObject.editorData);
    document.getElementById("title").value = clickedNoteObject.title;
    displayActiveNote(clickedID);
});

function displayActiveNote(clickedID) {
    let listItems = document.querySelectorAll('.note-list li');
    for (var i = 0; i < listItems.length; ++i) {
        if (clickedID == Number(listItems[i].getAttribute('data-id'))) {
            listItems[i].classList.add('active');
        } else {
            listItems[i].classList.remove('active');
        }
    }
}


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
document.querySelector("body > div.tabbed-content > ul > li:nth-child(4)").addEventListener("click", function (e) {
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

const search = document.querySelector('input[name="search"]');
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


// Favorite Function START:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
        if (e.target.textContent == "false") {
            favorite = e.target.textContent = "true";
            e.target.src = "img/star-solid.svg";

            for (var i = 0; i < allNotes.length; i++) {
                //console.log("NUMBER FROM ALLNOTES NOTE: " + JSON.stringify(allNotes[i].timestamp));
                if (allNotes[i].title == title) {
                    allNotes[i].favorite = "true";
                }
            }
            localStorage.setItem("myNotes", JSON.stringify(allNotes));
            //localStorage.setItem("myFavoriteNotes", JSON.stringify(favoriteNotes));

            // uppdatera favorites i local
            // * for loop ittererar genom allNotes
            // * i foor loopen ska det vara en if-sats
        } else if (e.target.textContent == "true") {
            e.target.textContent = "false";
            e.target.src = "img/star-regular.svg";

            for (var i = 0; i < allNotes.length; i++) {
                //console.log("NUMBER FROM ALLNOTES NOTE: " + JSON.stringify(allNotes[i].timestamp));
                if (allNotes[i].title == title) {
                    allNotes[i].favorite = "false";
                }
            }
            localStorage.setItem("myNotes", JSON.stringify(allNotes));

        }

    });
});


// Favorite Function END:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// List all favorites function START :::::::::::::::::::::::::::::::::::::::::::::::::::
document.getElementById("listFavorites").addEventListener("click", function () {

    //const term = e.target.value.toLowerCase();
    const notes = menuList.getElementsByTagName('li');
    Array.from(notes).forEach(function (note) {
        const favorite = note.childNodes[3].textContent;
        if (favorite == "true") {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    })

});




//Swap background:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Open Modal window
document.getElementById('btnSettings').addEventListener('click', function () {
    document.querySelector('.bg-modal').style.display = 'flex';
});

// Close Modal window via the exit sign on the left
document.querySelector('.exit').addEventListener('click', function () {
    document.querySelector('.bg-modal').style.display = 'none';
});


// Close Modal windowv via the  cancel btn 
document.querySelector('.cancel').addEventListener('click', function () {
    document.querySelector('.bg-modal').style.display = 'none';
});

// Close Modal windowv via the  save btn 
document.querySelector('.save').addEventListener('click', function () {
    document.querySelector('.bg-modal').style.display = 'none';
});


//-----Night mode ----

document.querySelector('.theme-toggle-button').addEventListener('click', function () {
    document.body.classList.toggle('modal-content-dark');
    document.getElementById('title').classList.toggle('setTitle-dark');
    document.getElementById('noteList').classList.toggle('note-list-dark');
    document.getElementById('PanelAddNote').classList.toggle('toolbox-dark');


});

//----- Intro popup ----

// ---- Open intro-modal window
document.querySelector('ul.leftTabs > li:first-child').addEventListener('click', function () {
    document.querySelector('.intro-popup').style.display = 'flex';
});


//  -- POPUP on first visit
console.log(localStorage.getItem('modalopened'))
if (!localStorage.getItem('modalopened')) {
    document.querySelector('.intro-popup').style.display = 'flex';
    localStorage.setItem("modalopened", true);
}


//----Close intro-modal window via the exit crossmark
document.querySelector('.exitintro').addEventListener('click', function () {
    document.querySelector('.intro-popup').style.display = 'none';
});
