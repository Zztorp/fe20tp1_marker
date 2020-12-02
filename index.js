
let editor;
let menuList = document.querySelector("#note-list");

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

//Create html-element
    
    let li = document.createElement("li");
    let noteTitle = document.createElement("h1");
    let menuDate = document.createElement("p");
 
//Add content
noteTitle.textContent = title;
menuDate.textContent = timestamp;  
 
 //Add classes
 noteTitle.classList.add('noteTitle');
 menuDate.classList.add('menuDate');

 //Append to DOM
li.appendChild(noteTitle);
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
    printNote(allNotes[i].title, allNotes[i].editorData, displayDate);
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


///search function:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//search function
/* var btnSearch  = document.querySelector('.btnSearch')
    btnSearch.addEventListener('click', function(e){
        console.log(e.target);
        console.log(e);
    })  */
 
 var btnSearch  = document.querySelector('.btnSearch')
    btnSearch.addEventListener('click', function(e){

        document.getElementById('#searchNotes').style.display="block";
        /* if (btnSearch.style.display === "none") {
            
        } else {
            btnSearch.style.display = "none";
        } */
      
    });  

  /*   var btnSearch  = document.querySelector('.btnSearch')
    
    btnSearch.addEventListener('click', function(e){
        var searchNotes = document.getElementsByClassName('.searchNotes');
        //console.log('hej');
        //document.searchNotes.style.display == "block";
    });

 */



    /*     }


    }) 

var searchNotes = document.getElementsByClassName('.searchNotes')
var btnSearch  = document.querySelector('.btnSearch')
   
    function searchFunction() {
            if searchNotes.style.display === "none") {
                searchNotes.style.display = "block";
        } else {
            searchNotesh.style.display = "none";
        }
      } 
 */
 //test 2'
/* var btnSearch
function showHide(){
    if (btnSearch==1){
        document.getElementsByClassName('.searchNotes').style.display="block";
        return btnSearch=0;
    }else{
        document.getElementsByClassName('.searchNotes').style.display="none";
        return
        }
    } 
   
 */



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
    


/* 

/* //Tabbed Content::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/* <!-- Funkar ännu inte    --> 
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

})

  */