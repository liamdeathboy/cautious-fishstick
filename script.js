// Add event listeners to category links
const categoryLinks = document.querySelectorAll('.navbar-menu li a');

categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior

    // Remove active class from all links
    categoryLinks.forEach(link => link.classList.remove('active'));

    // Add active class to the clicked link
    link.classList.add('active');

    // Get the selected category
    const selectedCategory = link.getAttribute('data-category');

    // Log the selected category (you can replace this with your filtering logic)
    console.log(`Selected Category: ${selectedCategory}`);

    // Add your logic here to filter or display games based on the selected category
  });
});