  window.addEventListener('load', () => {
      document.getElementById('loader').style.display = 'none';
      const aboutText = "Rammstein is a German industrial metal band formed in 1994 in Berlin. Known for their heavy, guitar-driven sound, deep vocals, and theatrical live performances featuring pyrotechnics, they blend elements of metal, electronic, and classical music. Their lyrics often explore controversial and dark themes, sometimes using irony and wordplay. The band's most famous songs include Du Hast, Sonne, and Mein Herz Brennt. They primarily sing in German but have gained international success.";
      const aboutText2 = "We're a parody band that strives to be the Rammstein of the ROBLOX platform. We make no assertions of legal ownership concerning the music, rights, or IP related to Rammstein or Universal Music.";
      const aboutTextContainer = document.getElementById('aboutText');
      aboutText.split('').forEach((char, index) => {const span = document.createElement('span');span.textContent = char;span.style.setProperty('--i', index);aboutTextContainer.appendChild(span);});
      const aboutTextContainer2 = document.getElementById('aboutText2');
      const offset = aboutText.length;
      aboutText2.split('').forEach((char, index) => {const span = document.createElement('span');span.textContent = char;span.style.setProperty('--i', offset + index);aboutTextContainer2.appendChild(span);});
  });

  function showSection(id) {
    const sections = document.querySelectorAll('.section-content');
    const loader = document.getElementById('loader');
    if (document.getElementById(id).classList.contains('active')) return;
    loader.style.display = 'flex';
    sections.forEach(section => {section.classList.remove('active');});
    const activeSection = document.getElementById(id);
    activeSection.classList.add('active');
    setTimeout(() => {loader.style.display = 'none';}, 325);
    sections.forEach(section => {section.classList.remove('active');});
    const targetSection = document.getElementById(id);
    if (targetSection) {targetSection.classList.add('active');}
    if (id === 'shop') {observeCards();}
    if (id === 'team') {observeCards();}
  }

  window.addEventListener("load", function () {const loader = document.getElementById("loader");loader.style.display = "none";});
  function observeCards() {
      const cards = document.querySelectorAll("#shop .card");
      const cards2 = document.querySelectorAll("#team .card");
      const observerOptions = {root: null,rootMargin: "0px",threshold: 0.1};
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      }, observerOptions);
      cards.forEach(card => {observer.observe(card);});
      cards2.forEach(card => {observer.observe(card);});
  }