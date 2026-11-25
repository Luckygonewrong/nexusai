document.querySelectorAll(".flip").forEach(function (card) {
  card.addEventListener("click", function () {
    card.classList.toggle("flipped");
  });
});

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const msgInput = document.getElementById("msg");

msgInput.addEventListener("input", function () {
  document.getElementById("char").textContent = msgInput.value.length + "/300";
});

function setError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.parentElement.classList.toggle("bad", message !== "");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg = msgInput.value.trim();

  if (name.length < 3) {
    setError(nameInput, "nameErr", "Name must be at least 3 letters.");
    valid = false;
  } else {
    setError(nameInput, "nameErr", "");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError(emailInput, "emailErr", "Please enter a valid email.");
    valid = false;
  } else {
    setError(emailInput, "emailErr", "");
  }

  if (msg.length < 10) {
    setError(msgInput, "msgErr", "Message must be at least 10 characters.");
    valid = false;
  } else {
    setError(msgInput, "msgErr", "");
  }

  if (valid) {
    showToast("Thanks " + name + "! We got your message.");
    form.reset();
    document.getElementById("char").textContent = "0/300";
  }
});
