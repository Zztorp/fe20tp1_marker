let editor;
let menuList = document.querySelector("#noteList");

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

// array of created notes
var allNotes = [];

//object constructur
function NoteObject(title, editorData, timestamp) {
    this.title = title;
    this.editorData = editorData;
    this.timestamp = timestamp;
};

//function to print comments in left note-menu
function printNote(title, editorData, timestamp) {

    //Create html-elements in left note-menu
    let menuList = document.querySelector("#noteList");
    let li = document.createElement("li");
    li.setAttribute("data-id", timestamp);
    let noteTitle = document.createElement("h3");
    let noteEditorData = document.createElement("p");
    let noteDate = document.createElement("p");

    //Add text content in left note-menu
    noteTitle.textContent = title;
    noteDate.textContent = moment().format('ll');
    const strippedString = editorData.replace(/(<([^>]+)>)/gi, "");
    noteEditorData.textContent = strippedString;

    //Add classes to text in left note-menu
    noteTitle.classList.add('noteTitle');
    noteDate.classList.add('noteDate');
    noteEditorData.classList.add('noteEditorData');

    //Append to DOM in note-menu
    li.appendChild(noteTitle);
    li.appendChild(noteDate);
    li.appendChild(noteEditorData);
    menuList.prepend(li);
}

//Fetch allPosts from local storage, if not empty. 
if (localStorage.length !== 0) {
    allNotes = JSON.parse(localStorage.getItem("myNotes"));
}

//Loop local array and print key values from objects in left note-menu. 
for (var i in allNotes) {
    printNote(allNotes[i].title, allNotes[i].editorData, allNotes[i].timestamp);
}

// ---- remove note from sidebar
function unprint(title) {
    let menuList = document.querySelector("#noteList").children;
    for (var i = 0; i < menuList.length; i++) {
        if (menuList[i].getElementsByClassName('noteTitle')[0].textContent == title) {
            menuList[i].remove();
        }
    }

}


//Function add latest note to array and print note in left note-menu. 
const createNote = document.forms.note;
createNote.addEventListener("submit", function(e) {
    e.preventDefault();
    let title = createNote.querySelector('#title').value;
    let editorData = editor.getData();
    let timestamp = Date.now();
    printNote(title, editorData, timestamp);
    //ev. byta till knapp

    //Create new notebject and add to array.
    allNotes[allNotes.length] = new NoteObject(title, editorData, timestamp);

    //Convert array of object into string, and save to local storage
    localStorage.setItem("myNotes", JSON.stringify(allNotes));
});

//Click on note in note-menu and display in CK Editor
document.querySelector('ul.note-list').addEventListener('click', function(evt) {
    let clickedLI = evt.target.closest('li');
    let clickedID = Number(clickedLI.getAttribute('data-id'));
    let clickedNoteObject = allNotes.find(note => note.timestamp === clickedID)
    editor.setData(clickedNoteObject.editorData);
    document.getElementById("title").value = clickedNoteObject.title;
    document.getElementById("dateMain").value = clickedNoteObject.timestamp;
});


//  ----- new note button
document.querySelector("body > div.flexContainer > div.tabbed-content > ul > li:nth-child(2)").addEventListener("click", function(e) {
    location.reload();
})


//  ----- delete note button

document.querySelector("#deleteNote").addEventListener("click", function(e) {
    const currentNote = document.forms.note;
    let title = currentNote.querySelector('#title').value;
    unprint(title);
    allNotes = JSON.parse(localStorage.getItem("myNotes"));
    allNotes = allNotes.filter(function(obj) {
        return obj.title !== title;
    });
    localStorage.setItem("myNotes", JSON.stringify(allNotes));

});



// ---- - print note button

document.querySelector("body > div.flexContainer > div.tabbed-content > ul > li:nth-child(5)").addEventListener("click", function(e) {
        var divContents = document.querySelector("#editor").innerHTML;
        var a = window.open('', '', 'height=500, width=500');
        a.document.write('<html>');
        a.document.write('<body > <h1>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
    })
    
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

var btnSearch = document.getElementById('btnSearch');
btnSearch.addEventListener('click', function (e) {


    if (searchNotes.style.display == 'none') {
        searchNotes.style.display = 'block';
    } else {
        searchNotes.style.display = "none";
    }
});