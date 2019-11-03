const {dom} = require('../util');
const server = require('../server');

const verifyTpl =
        `<div id="login-wrapper">
            <input id="password" type="password" placeholder="请输入访问目录密码"/>
            <span id="login">Verify</span>
        </div>`;

const reload = () => {
    global.window.location.reload();
};


const getCookie = name => {
    const arr = global.window.document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr !== null) {
        return unescape(arr[2]);
    }
    return false;
};

const onVerify = () => {
    server.request({
        action: 'password',
        password: dom('#password').val()
    }).then(reload);
};

const onKeydown = ev => {
    if (ev.which === 13) {
        onVerify();
    }
};

const addVerify = () => {
    dom(verifyTpl).appTo('#content');

    if (getCookie('password_verify') === 'true') {
        return true;
    }
    dom('#password').on('keydown', onKeydown)[0].focus();
    dom('#login').on('click', onVerify);
    return false;
};

module.exports = {
    addVerify
};
