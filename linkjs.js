

    // Dynamically load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/css/main.css"; // or the exact URL
    document.head.appendChild(link);

    


        // JavaScript for Hamburger Menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });


        