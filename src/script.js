const form = document.getElementById("ticketForm");
const intro = document.getElementById("intro");
const successView = document.getElementById("successView");
const resetButton = document.getElementById("resetForm");

const avatarInput = document.getElementById("avatar");
const uploadArea = document.getElementById("uploadArea");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const uploadPreview = document.getElementById("uploadPreview");
const avatarPreview = document.getElementById("avatarPreview");
const avatarHint = document.getElementById("avatarHint");
const avatarError = document.getElementById("avatarError");

const fields = {
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  github: document.getElementById("github"),
};

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

let selectedAvatar = "";

function setError(fieldName, message = "") {
  const field = fields[fieldName];
  const error = document.getElementById(`${fieldName}Error`);

  field.classList.toggle("invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
}

function setAvatarError(message = "") {
  avatarError.textContent = message;
  uploadArea.classList.toggle("invalid", Boolean(message));
  avatarInput.setAttribute("aria-invalid", String(Boolean(message)));
}

function showAvatar(file) {
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    setAvatarError("Please upload a JPG or PNG image.");
    avatarInput.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setAvatarError("Your image must be smaller than 500KB.");
    avatarInput.value = "";
    return;
  }

  if (selectedAvatar) {
    URL.revokeObjectURL(selectedAvatar);
  }

  selectedAvatar = URL.createObjectURL(file);

  avatarPreview.src = selectedAvatar;
  uploadPlaceholder.hidden = true;
  uploadPreview.hidden = false;
  avatarHint.hidden = true;

  setAvatarError("");
}

function clearAvatar() {
  if (selectedAvatar) {
    URL.revokeObjectURL(selectedAvatar);
  }

  selectedAvatar = "";
  avatarInput.value = "";
  avatarPreview.removeAttribute("src");

  uploadPlaceholder.hidden = false;
  uploadPreview.hidden = true;
  avatarHint.hidden = false;

  setAvatarError("");
}

uploadArea.addEventListener("click", function (event) {
  if (event.target.closest("button")) return;
  avatarInput.click();
});

uploadArea.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    avatarInput.click();
  }
});

avatarInput.addEventListener("change", function () {
  showAvatar(avatarInput.files[0]);
});

document.getElementById("changeAvatar").addEventListener("click", function () {
  avatarInput.click();
});

document.getElementById("removeAvatar").addEventListener("click", function () {
  clearAvatar();
});

["dragenter", "dragover"].forEach(function (eventName) {
  uploadArea.addEventListener(eventName, function (event) {
    event.preventDefault();
    uploadArea.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach(function (eventName) {
  uploadArea.addEventListener(eventName, function (event) {
    event.preventDefault();
    uploadArea.classList.remove("dragging");
  });
});

uploadArea.addEventListener("drop", function (event) {
  const file = event.dataTransfer.files[0];

  if (!file) return;

  const transfer = new DataTransfer();
  transfer.items.add(file);
  avatarInput.files = transfer.files;

  showAvatar(file);
});

function validateForm() {
  let valid = true;

  const fullName = fields.fullName.value.trim();
  const email = fields.email.value.trim();
  const github = fields.github.value.trim();

  if (!selectedAvatar) {
    setAvatarError("Please upload your avatar image.");
    valid = false;
  } else {
    setAvatarError("");
  }

  if (!fullName) {
    setError("fullName", "Please enter your full name.");
    valid = false;
  } else {
    setError("fullName");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setError("email", "Please enter your email address.");
    valid = false;
  } else if (!emailPattern.test(email)) {
    setError("email", "Please enter a valid email address.");
    valid = false;
  } else {
    setError("email");
  }

  if (!github) {
    setError("github", "Please enter your GitHub username.");
    valid = false;
  } else {
    setError("github");
  }

  return valid;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');

    if (firstInvalid === avatarInput) {
      uploadArea.focus();
    } else if (firstInvalid) {
      firstInvalid.focus();
    }

    return;
  }

  const fullName = fields.fullName.value.trim();
  const email = fields.email.value.trim();
  const github = fields.github.value.trim();
  const cleanGithub = github.startsWith("@") ? github : `@${github}`;

  document.getElementById("successName").textContent = fullName;
  document.getElementById("successEmail").textContent = email;
  document.getElementById("ticketName").textContent = fullName;
  document.getElementById("ticketGithub").textContent = cleanGithub;

  const ticketAvatar = document.getElementById("ticketAvatar");
  ticketAvatar.src = selectedAvatar;
  ticketAvatar.alt = `Avatar of ${fullName}`;

  const ticketNumber = Math.floor(10000 + Math.random() * 90000);
  document.getElementById("ticketNumber").textContent = `#${ticketNumber}`;

  form.hidden = true;
  intro.hidden = true;
  successView.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  resetButton.focus({ preventScroll: true });
});

resetButton.addEventListener("click", function () {
  form.reset();
  clearAvatar();

  Object.keys(fields).forEach(function (fieldName) {
    setError(fieldName);
  });

  successView.hidden = true;
  intro.hidden = false;
  form.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  fields.fullName.focus({ preventScroll: true });
});
