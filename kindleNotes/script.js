var notesContainer, newNoteButton;

function showNotes(){
    notesContainer.innerHTML = localStorage.getItem("notes") || "";
}

function updateNotes(){
    localStorage.setItem("notes", notesContainer.innerHTML);
}

function newNote()
{
    // create note
    var note = document.createElement("div");
    note.className = "note";

    // create text box
    var inputBox = document.createElement("div");
    inputBox.className = "input-box";
    inputBox.setAttribute("contenteditable", "true");

    // create delete button
    var deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = "Delete";

    // add to container and save
    note.appendChild(inputBox)
    note.appendChild(deleteButton);
    notesContainer.insertBefore(note, notesContainer.firstChild); // new notes are added to top
    updateNotes();
}


window.onload = function()
{
    // set header
    function setHeader()
     {
        kindle.messaging.sendMessage("com.lab126.chromebar", "configureChrome",
            {
                "appId": "com.katem26.kindlenotes",
                "topNavBar":
                {
                    "template": "title",
                    "title": "Kindle Notes"
                }
            }
        );
    }

    window.kindle.appmgr.ongo = function (ctx)
    {
        setHeader();
    }

    notesContainer = document.querySelector("#notes-container");
    newNoteButton = document.querySelector("#new-note-button");

    showNotes();
    newNoteButton.addEventListener("click", newNote);

    // event handler for delete buttons
    notesContainer.addEventListener("click", function(event)
        {
            if (event.target.className === "delete-button")
            {
                var note = event.target.parentNode;
                note.parentNode.removeChild(note);
                updateNotes();
            }
        }
    );

    // save while typing
    notesContainer.addEventListener("input", updateNotes);

}; // window.onload





