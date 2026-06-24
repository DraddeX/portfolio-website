const links = document.querySelectorAll('.navbar-items a');
const current = window.location.pathname;

links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (current.endsWith(linkPath) || linkPath.endsWith(current)) {
        link.classList.add('active');
    }
});
