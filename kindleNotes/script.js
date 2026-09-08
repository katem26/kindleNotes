window.onload = function()
{

    var notesContainer = document.querySelector("#notes-container");
    var newNoteButton = document.querySelector("#new-note-button");
    var deleteButtons = document.querySelectorAll(".delete-button");

    // load previous notes
    function showNotes(){
        notesContainer.innerHTML = localStorage.getItem("notes") || "";
    }
    showNotes();

    // store edits
    function updateNotes(){
        localStorage.setItem("notes", notesContainer.innerHTML);
    }


    // add note (button event)
    newNoteButton.addEventListener("click", function()
        {
            // create note
            var note = document.createElement("div");
            note.className = "note";

            // create text box
            var inputBox = document.createElement("p");
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
    );

    // delete button event
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
    notesContainer.addEventListener("input", function()
        {
            updateNotes();
        }
    );


}; // window.onload





