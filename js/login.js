const form = document.getElementById("loginForm");

form.addEventListener("submit", function(e){
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if(email === "" || password === ""){
        alert("Please fill in all fields.");
        return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", "Bikisha Maharjan");
    localStorage.setItem("userEmail", email);
    window.location.href = "index.html";
    });