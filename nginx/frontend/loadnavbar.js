async function loadNavBar() {

  const response = await fetch('navbar.html');
  const text = await response.text();
  document.getElementById('navbar-placeholder').innerHTML = text;
}
loadNavBar();

