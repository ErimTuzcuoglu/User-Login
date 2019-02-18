const userService = require('./Functions');

module.exports = {
    login, 
    register, 
    getAll,
    getById, 
    update, 
    _delete, 
    verify, 
    forgotMyPass, 
    resetPass, 
    adminData
};

//login
function login(req, res, next) {
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email Yada Parola Yanlış.' }))
        .catch(err => next(err));
}

//kaydol 
function register(req, res, next) {
    userService.create(req.body)
        .then(userData => res.json(userData))
        .catch(err => next(err));
}

//Hesabı Doğrula
function verify(req, res, next) {
    userService.verifySend(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
//Parolamı unuttum
function forgotMyPass(req, res, next) {
    userService.sendPassMail(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

//Parola resetleme
function resetPass(req, res, next) {
    userService.resetPassword(req.body)
        .then(data => res.json(data))
        .catch(err => next(err));
}

//Tüm verileri getir
function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

//Kullanıcı detay
function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

//Admin verileri.
function adminData(req, res, next) {
    userService.adminPageData()
        .then(data => res.json(data))
        .catch(err => next(err));
}

//Kullanıcı Update
function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

//Kullanıcı silme
function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

