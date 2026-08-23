async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


// REGISTER
async function register() {

    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value;

    if (username === "" || password === "") {
        alert("Please enter username and password.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const hashedPassword = await hashPassword(password);

    // Save demo account in browser storage
    localStorage.setItem("username", username);
    localStorage.setItem("passwordHash", hashedPassword);

    alert("Registration successful! Please login.");

    window.location.href = "index.html";
}


// LOGIN
async function login() {

    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPass").value;

    if (username === "" || password === "") {
        alert("Please enter username and password.");
        return;
    }

    const storedUsername = localStorage.getItem("username");
    const storedPasswordHash = localStorage.getItem("passwordHash");

    if (!storedUsername || !storedPasswordHash) {
        alert("No account found. Please register first.");
        return;
    }

    const enteredPasswordHash = await hashPassword(password);

    if (
        username === storedUsername &&
        enteredPasswordHash === storedPasswordHash
    ) {

        // Create simple demo session
        sessionStorage.setItem("loggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid username or password.");

    }
}


// LOGOUT
function logout() {

    sessionStorage.removeItem("loggedIn");

    alert("Logged out successfully.");

    window.location.href = "index.html";
}


// PROTECT DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {

    const loggedIn = sessionStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
        window.location.href = "index.html";
    }
}