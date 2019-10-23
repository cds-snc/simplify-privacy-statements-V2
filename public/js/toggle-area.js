// generic show hide toggle
// show or hide a div (more form fields) when clicked etc...

function toggleArea(event) {
  // ideally this won't be based on the index but....
  // we need to adjust the radio macro so we can set attributes
  // for individual inputs
  // current { 'on':'Yes','off':'No'}
  // - future {attributes : {data-something: "something"}, values: { '1':'Yes','2':'No'}}
  var toggleState = event.target.getAttribute('data-index')
  var name = event.target.name
  var checked = event.target.checked

  // look for an element with that name of the target + -toggled
  // i.e. div you want to show or hide
  var target = document.querySelector('.' + name + '-toggled')
  if (!checked || !target) return

  if (!target.classList.contains('form')) {
    target.classList.add('form')
  }
  if (toggleState.includes('on')) {
    target.style.display = 'block'
  } else {
    target.style.display = 'none'
  }
}

// add an event listener for all inputs within a toggle area
var toggles = document.querySelectorAll('.toggle-area input')

toggles.forEach(function toggle(el) {
  toggleArea({ target: el })
  el.addEventListener('click', toggleArea)
})
