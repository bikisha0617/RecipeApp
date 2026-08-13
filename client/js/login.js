document.addEventListener("DOMContentLoaded", function () {

    const form =
        document.getElementById("loginForm");

    if (!form) {
        return;
    }

    const message =
        document.getElementById("loginMessage");

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const emailInput =
                document.getElementById("email");

            const passwordInput =
                document.getElementById("password");

            const email =
                emailInput.value.trim().toLowerCase();

            const password =
                passwordInput.value;


            if (!email || !password) {
                showMessage(
                    "Email and password are required.",
                    true
                );
                return;
            }


            try {

                const response =
                    await fetch(
                        API_BASE_URL + "/auth/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );

                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Login failed."
                    );
                }


                saveAuth(
                    data.token,
                    data.user,
                    data.role || "user"
                );


                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                showMessage(
                    error.message ||
                    "Could not log in.",
                    true
                );
            }
        }
    );


    function showMessage(text, isError) {

        if (!message) {
            alert(text);
            return;
        }

        message.textContent = text;
        message.style.display = "block";

        if (isError) {
            message.classList.add("error");
        } else {
            message.classList.remove("error");
        }
    }

});