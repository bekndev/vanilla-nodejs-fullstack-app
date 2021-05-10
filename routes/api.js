const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

const apiRoutes = (req, res) => {
    if(req.url == '/api/users' && req.method == 'GET') {
        // Get all users
        getUsers(req, res);
    } else if(req.url.match(/\/api\/users\/\w+/) && req.method == 'GET') {
        // Get single user by id
        const id = parseInt(req.url.split('/')[3]);
        getUser(req, res, id);
    } else if(req.url == '/api/users' && req.method == 'POST') {
        // Create new user
        createUser(req, res);
    } else if(req.url.match(/\/api\/users\/\w+/) && req.method == 'PUT') {
        // Update existing user
        const id = parseInt(req.url.split('/')[3]);
        updateUser(req, res, id);
    } else if(req.url.match(/\/api\/users\/\w+/) && req.method == 'DELETE') {
        // Delete existing user
        const id = parseInt(req.url.split('/')[3]);
        deleteUser(req, res, id);
    } else {
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end(JSON.stringify({message: `Nothing found`}));
    }
}

module.exports = apiRoutes;