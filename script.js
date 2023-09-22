const container = document.querySelector(".container");
const heading = document.querySelector(".heading");
heading.textContent = "NEW HEADING TEXT";
container.style.width = "800px";


let array = [];

function getArray() {
    for (let i = 0; i <= 10000; i++) {
        for (let i = 0; i <= 10; i++) {
            array.unshift(i);
        }
    }
}

getArray();