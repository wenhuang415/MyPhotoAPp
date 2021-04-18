itemsCount = document.getElementById('items-count') 
container = document.getElementById('container')
getImage()
//document.getElementById('getgif').onclick = getImage;

var numItems;
function getImage(event) {
    function buildImageDiv(imageUrl,imgTitle) {
        return `<div class="item" onclick="fadeOutEffect(this)"><img src="${imageUrl}" width="200px" height="200px"/><span class="caption">${imgTitle}</span></div>`
    }

    var url = "https://jsonplaceholder.typicode.com/albums/2/photos";
    fetch(url)
        .then((response) => {return response.json()})
        .then((data) => {
            numItems=data.length;
            data.forEach(element => {
                //console.log(element.url);
                let imgUrl=element.url;
                let imgTitle=element.title;
                container.innerHTML += buildImageDiv(imgUrl,imgTitle);
            });
            itemsCount.innerHTML = numItems+ " images";
        })
}

function fadeOutEffect(el) {
    var fadeTarget = el
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            remove(el);
            numItems--;
            itemsCount.innerHTML = numItems+ " images";
        }
    }, 100);
}

function remove(el){
    var element = el;
    element.remove();
}