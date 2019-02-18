const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const User = db.User;
const mailService = require('./MailController');

module.exports = {
    login,
    getAll,
    getById,
    create,
    update,
    verifySend,
    sendPassMail,
    resetPassword,
    adminPageData,
    todayRegistered,
    didnotVerified,
    onlineUsers,
    userLoginAverage,
    delete: _delete
};

//Login fonksiyonu
async function login({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        // Eğer kullanıcı hesabını aktifleştirmediyse.
        if (user.activateState == false) {
            return { message: "Öncelikle hesabınızı doğrulamalısınız.", userId: user.id, state: 1 }
        }
        //Online olma durumunu true yapar.
        update(user.id, { online: true })

        const { password, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

//Tüm üyeleri getiren fonksiyon.
async function getAll() {
    return await User.find().select('-passwordConf');
}

//Bir üyenin detaylı bilgilerini getiren fonksiyon.
async function getById(id) {
    return await User.findById(id).select('-passwordConf');
}

async function adminPageData() {
    return {
        registered: await todayRegistered(),
        notVerified: await didnotVerified(),
        onlineUsers: await onlineUsers(),
        userLoginAverage: await userLoginAverage()
    }
}

async function userLoginAverage() {
    var currentDate = new Date(Date.now())
    var date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        (currentDate.getDate()))
    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    const dateInDb = await User.find({ registerDate: {$gte: date} });
    console.log(dateInDb)
    if(dateInDb != null){
        var average = 0;
        for(let i = 0 ; i < dateInDb.length; i++){
            average += dateInDb[i].activationTime
        }
        return average / dateInDb.length;
    } else { return 0 }
    
}

async function onlineUsers() {
    return await User.find({online: true})
}

async function todayRegistered() {
    var currentTime = new Date(Date.now())
    var start = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        (currentTime.getDate()))
    start = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString();
    var end = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        (currentTime.getDate() + 1))
    end = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString();;
    return await User.find({
        activateState: true,
        registerDate: {
            $gte: start,
            $lt: end
        }
    })
}

async function didnotVerified() {
    var lastDay = new Date(Date.now())
    //1 gün önce bu zamanı getirir.
    lastDay.setDate((lastDay.getDate() - 1))
    //Gmt +3 e çevirmek için +3 saat ekledim.
    lastDay.setHours((lastDay.getHours() + 3))
    //console.log(lastDay)

    //1 günden fazla süre geçipte aktive olmayanları getirir.
    return await User.find({
        activateState: false,
        registerDate: {
            $lt: lastDay
        }
    })
}

//Parola sıfırlama mailindeki kodla doğrulayarak yeni parola belirleme.
async function resetPassword(data) {
    var user = await User.findOne({ email: data.email })
    if (user == (undefined || null || "")) return { message: "Kullanıcı Bulunamadı", state: 2 }
    //console.log(bcrypt.compareSync(data.code, user.password))
    if (bcrypt.compareSync(data.code, user.password)) {
        var userNewData = { password: data.newPassword, passwordConf: data.newPassword }
        update(user._id, userNewData)
        return { message: "Parolanız Başarıyla Güncellendi", state: 1 }
    } else {
        return { message: "Yanlış Kod Girdiniz.", state: 0 }
    }
}

//Parola sıfırlama maili gönderir.
async function sendPassMail(userData) {
    //8 haneli random kod ürettiriliyor.
    var resetCode = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) { resetCode += possible.charAt(Math.floor(Math.random() * possible.length)); }

    var mailData = {
        mailAddress: userData.email,
        mailSubject: "Parola Sıfırlama",
        mailContent: "Geçici Parolanız:   " + resetCode
    }
    var user = await User.findOne({ email: userData.email })
    if (user) {
        update(user._id, { password: resetCode, passwordConf: resetCode })
        //Maili gönderiyor.
        mailService.sendMail(mailData)
        return { message: "Mailinize parola sıfırlama kodu gönderildi.", state: 1 }
    }
    else { return { message: "Bu email ile kayıtlı kullanıcı Bulunamadı", state: 0 } }
}

//Yeni üyelere verification maili gönderme fonksiyonu.
async function verifySend(userData) {
    //8 haneli random kod ürettiriliyor.
    var verifyCode = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++) { verifyCode += possible.charAt(Math.floor(Math.random() * possible.length)); }

    var mailData = {
        mailAddress: userData.email,
        mailSubject: "Hesabınızı Doğrulayın",
        mailContent: "Hesap doğrulama kodunuz:   " + verifyCode
    }
    update(userData.id, { verificationCode: verifyCode })
    //Maili gönderiyor.
    mailService.sendMail(mailData)
    return "Mailinize doğrulama kodu gönderildi."
}

//Yeni üye kaydı fonksiyonu.
async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);
    // hash password
    if (userParam.password && userParam.passwordConf) {
        user.password = bcrypt.hashSync(userParam.password, 10);
        user.passwordConf = user.password;
    }
    user.registerDate = Date.now()

    // save user
    await user.save();
    var userData = await User.findOne({ email: userParam.email })

    var mailData = {
        email: userParam.email,
        id: userData._id
    }

    return { id: userData._id, send: await verifySend(mailData) }
}

//Üye bilgilerini güncelleme fonksiyonu.
async function update(id, userParam) {
    const user = await User.findById(id);

    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    // eger password girildiyse hashle
    if (userParam.password && userParam.passwordConf) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
        userParam.passwordConf = userParam.password;
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

//Üye silme fonksiyonu.
async function _delete(id) {
    await User.findByIdAndRemove(id);
}
