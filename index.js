const md5 = require('blueimp-md5');
const sha1 = require('sha1');
const sha256 = require('sha256');

const HASH = { md5: md5, sha1: sha1, sha256: sha256 };

let container;

document.addEventListener( 'DOMContentLoaded', () => {
  container = document.querySelector('#content');
  build();
});

function build(){
  make('input', {type: 'password', className: 'password', id: 'pw1', placeholder: 'Enter Password'}, true, false, false);
  make('input', {type: 'password', className: 'password', id: 'pw2', placeholder: 'Reenter Password'}, true, false, false);
  make('form', {className: 'hash-form'}, true, 'down', false);
  make('input', {type: 'radio', className: 'hash', name: 'hash', id: 'md5', value: 'md5'}, true, false, true);
  make('input', {type: 'radio', className: 'hash', name: 'hash', id: 'sha1', value: 'sha1'}, true, false, true);
  make('input', {type: 'radio', className: 'hash', name: 'hash', id: 'sha256', value: 'sha256'}, true, false, true);
  make('input', {type: 'text', className: 'salt', id: 'salt', placeholder: 'Enter Salt'}, false, false, false);
  make('input', {type: 'radio', className: 'random-salt', id: 'random', value: 'random-salt'}, true, false, true);
  make('button', {innerHTML: 'Generate Hash', id: 'generate', className: 'generate'}, true, 'up', false);
  make('div', {className: 'hash-display', id: 'hash-display'}, true, '', false)
  make('div', {className: 'salt-display', id: 'salt-display'}, true, '', false)
  document.querySelector('#generate').addEventListener('click', generateHash);
}

function display(hash, salt) {
  let hashDisplay = document.querySelector('#hash-display');
  let saltDisplay = document.querySelector('#salt-display');
  hashDisplay.innerHTML = `Hash: ${hash}`;
  saltDisplay.innerHTML = `Salt: ${salt}`;
}

function make(el, attrs, brk, nest, label){
  const element = document.createElement(el);
  if (label) {
    let lbl = document.createElement('label');
    lbl.for = attrs.id;
    lbl.innerHTML = attrs.id
    container.appendChild(lbl);
  }
  for (var attr in attrs){
    element[attr] = attrs[attr];
  }
  container.appendChild(element);
  if (brk) {
    container.appendChild(document.createElement('br'));
  }
  if (nest === 'down') {
    container = element;
  }
  if (nest === 'up') {
    container = container.parentNode;
  }
}

function randomSalt(){
  return Math.random().toString(36).slice(2);
}

function getSalt(){
  let random = document.querySelector('#random').checked;
  if (random) {
    return randomSalt();
  } else {
    return document.querySelector('#salt').value;
  }
}

function generateHash(e){
  e.preventDefault();
  let pw1 = document.querySelector('#pw1').value;
  let pw2 = document.querySelector('#pw2').value;
  if ( pw1 !== pw2 ) {
    alert("PASSWORDS DON'T MATCH");
    return;
  }
  let salt = getSalt()
  let pwString = pw1 + salt;
  let algo
  document.querySelectorAll('.hash').forEach((hash) => {
    if(hash.checked){ algo = hash.value; }
  });
  if (!algo) {
    alert('SELECT A HASHING ALGORITHM');
    return;
  }
  let hashString = HASH[algo](pwString);
  display(hashString, salt);
}
