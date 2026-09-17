document.addEventListener("DOMContentLoaded", () => {
  const pairings = [
    {
      image: "/assets/img/dot.png",
      quote: "Look again at that dot. That's here. That's home. That's us.",
      author: "Carl Sagan",
    },
    {
      image: "/assets/img/milk.webp",
      quote: "We are a way for the cosmos to know itself.",
      author: "Carl Sagan",
    },
  ];

  const selected = pairings[Math.floor(Math.random() * pairings.length)];

  document.getElementById("hero-image").src = selected.image;
  document.getElementById("hero-quote").innerText = `"${selected.quote}"`;
  document.getElementById("hero-author").innerText = `— ${selected.author}`;
});
