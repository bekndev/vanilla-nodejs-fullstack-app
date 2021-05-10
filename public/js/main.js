const app = document.getElementById('app');

const container = document.createElement('div');
container.classList = 'container';
app.appendChild(container);

const pageTitle = document.createElement('h1');
pageTitle.innerText = document.title;
container.appendChild(pageTitle);

const usersList = document.createElement('div');
container.appendChild(usersList);

const url = '/api/users';

const fetchData = async () => {
    const res = await fetch(url);
    const users = JSON.parse(await res.json());
    // console.log('async/await');
    return users;
}
// const fetchData2 = async () => {
//     let users;
//     await fetch(url)
//         .then(res => res.json())
//         .then(data => {
//             console.log('Promise');
//             users = data;
//         })
//         .catch(err => console.log(err));
//     return users;
// }

customElements.define('users-list',
    class extends HTMLElement {
        constructor() {
            super();
            const template = document.getElementById('users-list').content;
            const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
        }
        
        connectedCallback() {
            this.shadowRoot.querySelector('.remove').addEventListener('click', (e) => {
                if(confirm('Are you sure?')) {
                    const id = this.getAttribute('data-id');
                    const apiUrl = `${url}/${id}`;
                    if(id) {
                        fetch(apiUrl, {
                            method: 'DELETE',
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        .then(async res => {
                            console.log(await res.json());
                            const users = await fetchData();
                            generateUsersList(users);
                        })
                        .catch(err => console.log(err));

                        return;
                    }
                }
            });

            this.shadowRoot.querySelector('.edit').addEventListener('click', (e) => {
                const id = this.getAttribute('data-id');
                if(id) {
                    const apiUrl = `${url}/${id}`;
                    fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(async res => {
                        usersList.innerHTML = generateUserForm('update', JSON.parse(await res.json()));
                    })
                    .catch(err => console.log(err));

                    return;
                }
            });
        }
    }
);

customElements.define('user-form',
    class extends HTMLElement {
        constructor() {
            super();
            const template = document.getElementById('user-form').content;
            const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));
        }

        connectedCallback() {
            const shadowRootForm = document.querySelector('user-form').shadowRoot;

            let title = document.querySelector('user-form').getAttribute('data-title');
            shadowRootForm.querySelector("h2").innerText = title;

            let user = document.querySelector('user-form').getAttribute('data-user');
            user = user && JSON.parse(user);
            const id = user && user.id;
            if(user) {
                shadowRootForm.querySelector("[name='name']").value = user.name;
                shadowRootForm.querySelector("[name='age']").value = user.age;
                shadowRootForm.querySelector("[name='gpa']").value = user.gpa;
            }

            shadowRootForm.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = shadowRootForm.querySelector("[name='name']").value;
                const age = shadowRootForm.querySelector("[name='age']").value;
                const gpa = shadowRootForm.querySelector("[name='gpa']").value;

                if(name !== '' && age !== '' && gpa !== '') {
                    const userData = {name, age, gpa};
                    // console.log(userData);

                    const method = id ? 'PUT' : 'POST';
                    const apiUrl = id ? `${url}/${id}` : url;
                    fetch(apiUrl, {
                        method,
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(async res => {
                        console.log(await res.json());
                        const users = await fetchData();
                        generateUsersList(users);
                    })
                    .catch(err => console.log(err));

                    return;
                }

                alert('Please, enter all user data');
            });
        }
    }
);

usersList.innerHTML = '<p>Loading data...</p>';
// Just for loading effect =)
setTimeout(async () => {
    const users = await fetchData();
    // const users = await fetchData2();
    // console.log(users);

    generateUsersList(users);
}, 1000);

const generateUsersList = (users) => {
    let html = generateUserForm('new');
    html += users.map(user => (
        `<users-list data-id="${user.id}">
            <div slot="user-name">name: ${user.name}</div>
            <div slot="user-age">age: ${user.age}</div>
            <div slot="user-gpa">gpa: ${user.gpa}</div>
        </users-list>`)
    ).join('');
    pageTitle.innerText = 'Users list';
    usersList.innerHTML = html;
}

const generateUserForm = (action, user = {}) => {
    if(action == 'new') {
        return `<user-form data-title="Add new user"></user-form>`;
    } else {
        return `<user-form data-title="Edit user" data-user=${JSON.stringify(user)}></user-form>`;
    }
}