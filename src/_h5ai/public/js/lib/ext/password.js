const {dom} = require('../util');
const server = require('../server');

const verifyTpl =
        `<div id="login-wrapper">
            <input id="password" type="password" placeholder="请输入访问目录密码"/>
            <br />
            <button id="login">Verify</button>
        </div>`;

const reload = () => {
    global.window.location.reload();
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
    try {
        dom('#login-wrapper').rm();
    } finally {
        dom(verifyTpl).appTo('#view');
    }

    dom('#password').on('keydown', onKeydown)[0].focus();
    dom('#login').on('click', onVerify);
    return false;
};

module.exports = {
    addVerify
};
