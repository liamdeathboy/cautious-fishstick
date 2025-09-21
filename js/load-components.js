document.addEventListener("DOMContentLoaded", function() {
    // Load navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
            const primaryNav = document.getElementById("primary-navigation");

            mobileNavToggle.addEventListener("click", () => {
                primaryNav.classList.toggle("active");
                const isExpanded = primaryNav.classList.contains("active");
                mobileNavToggle.setAttribute("aria-expanded", isExpanded);
            });
        });

    // Load footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});
