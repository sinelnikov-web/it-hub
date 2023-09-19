const span = document.querySelector('.test');

let newSpan = span.cloneNode();

// span.appendChild(newSpan);
//
// function click(index) {
//     console.log(index);
// }



function example(fn) {
    fn();
}

function callback() {
    console.log(1);
}

function callback2() {
    console.log(2);
}

example(callback);

example(callback2);



//
for (let i = 0; i < 5; i++) {
    let block = document.createElement('button');

    block.innerText = `Кнопка ${i}`;

    block.addEventListener('click', function () {
        click(i);
    });

    document.body.appendChild(block);
}