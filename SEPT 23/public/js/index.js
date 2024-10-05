const my_form = document.getElementById("new_product");

const HOST = window.location.href;

const sendData = (data, method) => {
    fetch(HOST, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            window.location.href = HOST;
        })
        .catch((err) => console.log(err));
};

my_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const form_data = new FormData(e.target);
    const data = Object.fromEntries(form_data);
    sendData(data, 'POST');
});
