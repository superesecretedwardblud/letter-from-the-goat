const SECRET = ["panda", "pandas", "a panda", "the panda"];

const things = [
  "The way you laugh at your own jokes before you finish them",
  "That you notice things nobody else bothers to notice",
  "How you compliment me on days I've already decided I'm worthless",
  "The little videos and photos you send me for no reason at all",
  "That you're beautiful and act like you have no idea",
  "You and your pandas",
  "You stayed when leaving would have been easier and fairer",
  "How you match me no matter how weird I'm being",
  "How carefully you think about everything, including me",
  "That talking to you has never once felt like effort",
  "The way you say my name",
  "That after everything, you're still who I want to tell things to first"
];

const total = 4;
const read = {};

function go(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  document.getElementById("back").classList.toggle("hidden", id === "boot" || id === "gate" || id === "hub");
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
    go("hub");
  } else {
    document.getElementById("err").textContent = hints[Math.min(tries++, hints.length - 1)];
  }
}

document.getElementById("code").addEventListener("keydown", e => {
  if (e.key === "Enter") checkCode();
});

function unlock(n) {
  read[n] = true;
  document.querySelectorAll(".file")[n - 1].classList.add("read");

  const count = Object.keys(read).length;
  const hs = document.querySelectorAll("#progress .ph");
  for (let i = 0; i < count && i < hs.length; i++) hs[i].classList.add("on");

  if (count >= total) {
    const b = document.getElementById("f5btn");
    b.classList.remove("locked");
    b.innerHTML = '<span class="idx">v</span> open me';
  }
  go("hub");
}

const grid = document.getElementById("grid");
things.forEach((t, i) => {
  const d = document.createElement("div");
  d.className = "tile";
  d.textContent = "♥";
  d.onclick = () => {
    if (!d.classList.contains("open")) {
      d.classList.add("open");
      d.textContent = t;
    }
  };
  grid.appendChild(d);
});

const hearts = document.getElementById("hearts");
for (let i = 0; i < 22; i++) {
  const s = document.createElement("span");
  s.textContent = "♥";
  s.style.left = Math.random() * 100 + "%";
  s.style.fontSize = (11 + Math.random() * 17) + "px";
  s.style.animationDuration = (14 + Math.random() * 16) + "s";
  s.style.animationDelay = (Math.random() * 18) + "s";
  hearts.appendChild(s);
}

const bootText = [
  "I miss you, my sweet baby.",
  "I want you back.",
  "I regret everything."
];

const winkLine = "And no, I'm not talking to someone new. I want you back.";
const asideLine = "oh yeah — i was thinking about you and decided to revamp the site lol";

const box = document.getElementById("bootlines");

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
  }, 34);
}

function runBoot(i) {
  if (i < bootText.length) {
    typeLine(bootText[i], null, () => setTimeout(() => runBoot(i + 1), 460));
    return;
  }
  setTimeout(() => {
    document.getElementById("bootpanda").classList.add("winking");
    setTimeout(() => {
      typeLine(winkLine, "wink-line", () => {
        setTimeout(() => {
          typeLine(asideLine, "aside", () => {
            setTimeout(() => document.getElementById("bootbtn").classList.remove("hidden"), 400);
          });
        }, 800);
      });
    }, 700);
  }, 700);
}

runBoot(0);

const form = document.getElementById("reply");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const res = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" }
  });

  if (res.ok) {
    form.reset();
    document.getElementById("sent").textContent = "sent. he'll see it.";
    setTimeout(() => {
      form.style.display = "none";
      document.getElementById("replyhead").style.display = "none";
      document.getElementById("sent").textContent = "";
      const a = document.getElementById("afterword");
      a.classList.remove("hidden");
      a.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1400);
  } else {
    document.getElementById("sent").textContent = "didn't send. try again?";
  }
});
