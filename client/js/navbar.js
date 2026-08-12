const loginBtn = document.getElementById("loginBtn");
const profileSection = document.getElementById("profileSection");
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownName = document.getElementById("dropdownName");
const dropdownEmail = document.getElementById("dropdownEmail");

// Check login status
const loggedIn = localStorage.getItem("loggedIn") === "true";

if(loggedIn){
    if(loginBtn){
        loginBtn.style.display = "none";
    }
    if(profileSection){
        profileSection.style.display = "flex";
    }
    if(dropdownName){
        dropdownName.textContent =
            localStorage.getItem("userName") || "Guest User";
    }
    if(dropdownEmail){
        dropdownEmail.textContent =
            localStorage.getItem("userEmail") || "guest@email.com";
    }
}else{
    if(loginBtn){
        loginBtn.style.display = "block";
    }
    if(profileSection){
        profileSection.style.display = "none";
    }
}

// Login button
if(loginBtn){
    loginBtn.onclick = function(){
        window.location.href = "login.html";
    };
}

// Dropdown
if(dropdownBtn){
    dropdownBtn.onclick = function(e){
        e.stopPropagation();
        if(dropdownMenu.style.display === "block"){
            dropdownMenu.style.display = "none";
        }else{
            dropdownMenu.style.display = "block";
        }
    };
}

window.onclick = function(){
    if(dropdownMenu){
        dropdownMenu.style.display = "none";
    }
};

// Switch account
const switchAccount = document.getElementById("switchAccount");
if(switchAccount){
    switchAccount.onclick = function(){
        localStorage.setItem("loggedIn","false");
        window.location.href = "login.html";
    };
}