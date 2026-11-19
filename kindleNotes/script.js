var notesContainer, newNoteButton, exportButton;

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

function formatNotes(notes)
// format notes into plaintext for exporting
{
    // extract text from each note
    // DOMParser.parseFromString would be good for this
    // but i don't think we have support for using it with html
    var tmp = document.createElement("div");
    tmp.innerHTML = notes;
    var boxes = tmp.querySelectorAll(".input-box");
    var noteText = [];

    for (var i = 0; i < boxes.length; i++) 
    {
        var htmlTxt = boxes[i].innerHTML;
        var txt = stringReplaceAll(htmlTxt, "<br>", "\n")
        txt = stringReplaceAll(txt, "<div>", "")
        txt = stringReplaceAll(txt, "</div>", "\n");
        noteText.push(txt);
    }
    
    // create plaintext string
    var date = new Date();
    var notesString = "Exported at: "
        +date.getFullYear()+"/"
        +(date.getMonth()+1)+"/"
        +date.getDate()+" "
        +padWithLeadingZeroes(date.getHours(), 2)+":"
        +padWithLeadingZeroes(date.getMinutes(), 2);
    notesString += "\n\n----------\n\n";

    for (var i=0; i < noteText.length; i++)
    {
        notesString += noteText[i];
        notesString += "\n\n----------\n\n";
    }

    return notesString;
}

function saveText(text, filename)
{
    var link = document.createElement("a");

    link.href = "data:text/plain;charset=utf-8,"
        + encodeURIComponent(text);

    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// alternative save functions
// function saveText(text, filename)
// {
//     var url = "data:text/plain;charset=utf-8," +
//         encodeURIComponent(text);

//     window.location.href = url;
// }

// function saveText(text, filename)
// {
//     var blob = new Blob(
//         [text],
//         { type: "text/plain;charset=utf-8" }
//     );

//     var url = window.URL.createObjectURL(blob);

//     window.location.href = url;
// }

function exportAllNotes()
{
    var date = new Date();
    var filename = "notes_"
        +date.getFullYear()
        +padWithLeadingZeroes(date.getMonth()+1, 2)
        +padWithLeadingZeroes(date.getDate(), 2)+"_"
        +padWithLeadingZeroes(date.getHours(), 2)
        +padWithLeadingZeroes(date.getMinutes(), 2)
        +".txt";
    updateNotes();
    var noteText = formatNotes(localStorage.getItem("notes"));
    saveText(noteText, filename);
}

function padWithLeadingZeroes(number, targetLength)
{
    return ("0000000000" + number).substr(-targetLength,targetLength);
}

// the real replaceAll method isn't supported :-(
function stringReplaceAll(string, target, replacement)
{
    while (string.indexOf(target) != -1) 
    // while instances of target in string
    {
        // replace (new) first instance
        string = string.replace(target, replacement);
    }
    return string;
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

    if (window.kindle) // this stuff won't work on other devices 
    // (e.g. when testing on desktop)
    {
        window.kindle.appmgr.ongo = function (ctx)
        {
            setHeader();
        }
    }

    notesContainer = document.querySelector("#notes-container");
    newNoteButton = document.querySelector("#new-note-button");
    exportButton = document.querySelector("#export-button");

    formatNotes(localStorage.getItem("notes"));
    showNotes();
    newNoteButton.addEventListener("click", newNote);
    exportButton.addEventListener("click", exportAllNotes);

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





