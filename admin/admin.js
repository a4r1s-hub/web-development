const loginForm = document.getElementById("login-form");
const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginError = document.getElementById("login-error");
const logoutButton = document.getElementById("logout");

const projectForm = document.getElementById("project-form");
const postForm = document.getElementById("post-form");
const projectSuccess = document.getElementById("project-success");
const postSuccess = document.getElementById("post-success");

const tokenKey = "studio-token";

const setAuthState = (isAuthed) => {
  if (isAuthed) {
    loginPanel.classList.add("hidden");
    dashboard.classList.remove("hidden");
  } else {
    loginPanel.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
};

const getToken = () => localStorage.getItem(tokenKey);

const setToken = (token) => {
  localStorage.setItem(tokenKey, token);
  setAuthState(true);
};

const clearToken = () => {
  localStorage.removeItem(tokenKey);
  setAuthState(false);
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Invalid email or password.");
    }

    const data = await response.json();
    setToken(data.token);
    loginForm.reset();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

logoutButton.addEventListener("click", () => {
  clearToken();
});

const submitWithAuth = async (endpoint, body, successEl) => {
  const token = getToken();
  if (!token) {
    clearToken();
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Unable to save. Check your server or credentials.");
  }

  successEl.textContent = "Saved successfully.";
  setTimeout(() => {
    successEl.textContent = "";
  }, 3000);
};

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await submitWithAuth("/api/projects", payload, projectSuccess);
    projectForm.reset();
  } catch (error) {
    projectSuccess.textContent = error.message;
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await submitWithAuth("/api/posts", payload, postSuccess);
    postForm.reset();
  } catch (error) {
    postSuccess.textContent = error.message;
  }
});

setAuthState(Boolean(getToken()));
