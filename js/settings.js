const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const modal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

// Load saved data
document.getElementById("name").value = localStorage.getItem("userName") || "Bikisha Maharjan";
document.getElementById("email").value = localStorage.getItem("userEmail") || "bikisha@gmail.com"
document.getElementById("notifications").checked = localStorage.getItem("notifications") === "true";
document.getElementById("darkMode").checked = localStorage.getItem("darkMode") === "true";

// Save
saveBtn.onclick = function(){
    localStorage.setItem(
        "userName", document.getElementById("name").value
    );
    localStorage.setItem(
        "userEmail", document.getElementById("email").value
    );
    localStorage.setItem(
        "notifications", document.getElementById("notifications").checked
    );
    localStorage.setItem(
        "darkMode", document.getElementById("darkMode").checked
    );
    alert("Settings saved!");
};

// Delete popup
deleteBtn.onclick = function(){
    modal.style.display = "flex";
};

cancelDelete.onclick = function(){
    modal.style.display = "none";
};

// Delete account
confirmDelete.onclick = function(){
    localStorage.clear();
    alert("Account deleted.");
    window.location.href = "index.html";
};

// Close modal if background clicked
window.onclick = function(e){
    if(e.target === modal){
        modal.style.display = "none";
    }
};