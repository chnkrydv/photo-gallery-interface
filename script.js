$(document).ready(function() {
    $('.modal').modal();
});


var url = "";
var imgPath = document.getElementById('imgPath');
var imgPathText = document.getElementById('imgPathText');
var imgUrl = document.getElementById('imgUrl');
var imgKey = document.getElementById('imgKey');
var pics = document.getElementById('pics');
var ls = localStorage;

window.onload = render(ls);


function render(obj) {
    for (var key in obj) {
        loadImg(key, obj.getItem(key));
    }
}

function doRender(event) {
    event.target.value = '';
    while (pics.firstChild) {
        pics.removeChild(pics.firstChild);
    }
    render(ls);
}


function loadPath(event) {
    var reader = new FileReader();
    reader.addEventListener("load", function() {
        //console.log(reader.result);
        url = reader.result;
    }, false);
    reader.readAsDataURL(event.target.files[0]);
}

function loadUrl(event) {
    url = event.target.value;
    imgPath.value = null;
    imgPathText.value = "";
}

function save() {
    var lsKey = imgKey.value.replace(/ /g, '-').toLowerCase();
    var lsUrl = url;
    if (imgPathText.value === '') {
        if (imgUrl.value === '') {
            alert('Provide image path or url');
            return;
        }
    }
    if (imgKey.value === '') {
        alert('Enter short name for image');
        return;
    }

    if (ls.getItem(imgKey.value)) {
        alert('This image short name already exists');
        return;
    }

    ls.setItem(lsKey, lsUrl);
    loadImg(lsKey, lsUrl);

    imgPath.value = null;
    imgPathText.value = '';
    imgUrl.value = '';
    imgKey.value = '';

    $('#modal1').modal('close');
}

function saveHandle(event) {
    if (event.keyCode === 13) {
        save();
    }
}

function loadImg(key, src) {
    var cardTitle = key.replace(/-/g, ' ').toUpperCase();
    var cardId = key;

    var img = document.createElement('img');
    var title = document.createElement('span');
    var del = document.createElement('div');
    var delIcon = document.createElement('i');
    var cardImage = document.createElement('div');
    var card = document.createElement('div');

    img.src = src;
    img.height = 150;
    img.style = 'width: auto;';
    title.classList.add('card-title', 'white-text', 'flow-text', 'bold');
    title.innerText = cardTitle;
    del.id = cardId + '-del';
    del.classList.add('delete', 'right');
    delIcon.classList.add('material-icons');
    delIcon.innerText = "delete";
    cardImage.classList.add('card-image');
    card.id = cardId;
    card.classList.add('col', 's12', 'm6', 'l3', 'card');

    del.appendChild(delIcon);
    cardImage.appendChild(img);
    cardImage.appendChild(title);
    card.appendChild(cardImage);
    card.appendChild(del);

    pics.appendChild(card);
    var delEl = document.getElementById(del.id);
    if (delEl) {
        delEl.addEventListener('click', function() {
            removeImg(card.id);
        });
    };
}

function removeImg(key) {
    pics.removeChild(document.getElementById(key));
    ls.removeItem(key);
}

function filter(event) {
    document.getElementById('imgFilter').addEventListener('keydown', function(event) {
        if (event.keyCode > 47 && event.keyCode < 91) {
            while (pics.firstChild) {
                pics.removeChild(pics.firstChild);
            };
            var tempLs = {};
            var txt = event.target.value + event.key;
            for (var key in ls) {
                if (key.includes(txt.toLowerCase())) {
                    tempLs[key] = ls.getItem(key);
                }
            }
            console.log(txt);
            for (var key in tempLs) {
                loadImg(key, tempLs[key]);
            }
        }

        if (event.keyCode === 8) {
            while (pics.firstChild) {
                pics.removeChild(pics.firstChild);
            };
            var tempLs = {};
            var txt = event.target.value.slice(0, event.target.value.length - 1);
            for (var key in ls) {
                if (key.includes(txt.toLowerCase())) {
                    tempLs[key] = ls.getItem(key);
                }
            }
            console.log(txt);
            for (var key in tempLs) {
                loadImg(key, tempLs[key]);
            }
        }
    });
}