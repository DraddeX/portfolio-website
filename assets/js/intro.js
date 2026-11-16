document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  if (!intro) return;

  // Show it only once per visit
  if (sessionStorage.getItem("introSeen")) {
    intro.remove();
    return;
  }

  const message = "Hi, I'm Oscar. Welcome to my portfolio.";
  const target = document.getElementById("intro-typed");
  document.body.classList.add("intro-active");

  let i = 0;
  const type = () => {
    target.textContent = message.slice(0, ++i);
    if (i < message.length) {
      setTimeout(type, 60);          // typing speed
    } else {
      setTimeout(finish, 900);       // pause after the last letter
    }
  };

  const finish = () => {
    intro.classList.add("intro--hide");
    document.body.classList.remove("intro-active");
    sessionStorage.setItem("introSeen", "1");
    intro.addEventListener("transitionend", () => intro.remove(), { once: true });
  };

  intro.addEventListener("click", finish);   // click to skip
  type();
});