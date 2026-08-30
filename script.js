const SECRET = ["panda", "pandas", "a panda", "the panda"];

function go(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let tries = 0;
const hints = [
  "that's not it. try again.",
  "still no. hint: black and white.",
  "hint: you send me pictures of them constantly.",
  "fine. it's pandas. type pandas."
];

function checkCode() {
  const v = document.getElementById("code").value.trim().toLowerCase();
  if (SECRET.includes(v)) {
    document.getElementById("err").textContent = "";
    go("home");
  } else {
    document.getElementById("err").textContent = hints[Math.min(tries++, hints.length - 1)];
  }
}

document.getElementById("code").addEventListener("keydown", e => {
  if (e.key === "Enter") checkCode();
});

const taki = '<svg viewBox="0 0 44 15" width="30" height="11"><rect x="1" y="1" width="42" height="13" rx="6.5" fill="#ff4d80"/><ellipse cx="7" cy="7.5" rx="3.4" ry="5.5" fill="#a8143f"/><path d="M16 5 L34 5 M16 10 L34 10" stroke="#ffb0c6" stroke-width="1.2" stroke-linecap="round"/></svg>';

const drift = document.getElementById("drift");
for (let i = 0; i < 20; i++) {
  const s = document.createElement("span");
  if (i % 3 === 0) {
    s.innerHTML = taki;
  } else {
    s.textContent = "\u2665";
    s.style.fontSize = (11 + Math.random() * 15) + "px";
  }
  s.style.left = Math.random() * 100 + "%";
  s.style.animationDuration = (16 + Math.random() * 16) + "s";
  s.style.animationDelay = (Math.random() * 20) + "s";
  drift.appendChild(s);
}

const openText = "I decided to change the site a bit to add what you wanted in your previous messages.";
const asideLine = "so now you can send me as many as you want. and I can actually say things back.";

const box = document.getElementById("openlines");

function typeLine(text, cls, done) {
  const p = document.createElement("p");
  if (cls) p.className = cls;
  box.appendChild(p);
  let ci = 0;
  const timer = setInterval(() => {
    p.textContent = text.slice(0, ++ci);
    if (ci >= text.length) {
      clearInterval(timer);
      done();
    }
  }, 32);
}

typeLine(openText, null, () => {
  setTimeout(() => {
    typeLine(asideLine, "aside", () => {
      setTimeout(() => document.getElementById("openbtn").classList.remove("hidden"), 400);
    });
  }, 750);
});

const form = document.getElementById("reply");

function again() {
  document.getElementById("done").classList.add("hidden");
  form.classList.remove("hidden");
  document.getElementById("sent").textContent = "";
  form.querySelector("textarea").focus();
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const res = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" }
  });

  if (res.ok) {
    form.reset();
    form.classList.add("hidden");
    document.getElementById("done").classList.remove("hidden");
  } else {
    document.getElementById("sent").textContent = "didn't send. try again?";
  }
});
