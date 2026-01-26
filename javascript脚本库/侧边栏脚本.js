function openNav_l() {
  document.getElementById("mySidenav_l").style.width = "100%";
  document.getElementById("span_l").hidden = true;
}

function closeNav_l() {
  document.getElementById("mySidenav_l").style.width = "0";
  setTimeout(function () {
    document.getElementById("span_l").hidden = false;
  }, 500);
}
function openNav_r() {
  document.getElementById("mySidenav_r").style.width = "100%";
  document.getElementById("span_r").hidden = true;
}

function closeNav_r() {
  document.getElementById("mySidenav_r").style.width = "0";
  setTimeout(function () {
    document.getElementById("span_r").hidden = false;
  }, 500);
}
