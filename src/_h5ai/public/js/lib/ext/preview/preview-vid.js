const {dom} = require('../../util');
const allsettings = require('../../core/settings');
const preview = require('./preview');

const document = global.window.document;
const XHR = global.window.XMLHttpRequest;
const settings = Object.assign({
    enabled: false,
    autoplay: true,
    types: []
}, allsettings['preview-vid']);

const updateGui = () => {
    const el = dom('#pv-content-vid')[0];
    if (!el) {
        return;
    }

    const elW = el.offsetWidth;
    const elVW = el.videoWidth;
    const elVH = el.videoHeight;

    preview.setLabels([
        preview.item.label,
        String(elVW) + 'x' + String(elVH),
        String((100 * elW / elVW).toFixed(0)) + '%'
    ]);
};

const load = item => {
    return new Promise(resolve => { // eslint-disable-line
        const fileurl = item.absHref;
        const filepath = fileurl.slice(0, fileurl.lastIndexOf('/'));
        const filename = fileurl.slice(fileurl.lastIndexOf('/') + 1);
        const filenotype = fileurl.slice(fileurl.lastIndexOf('/') + 1, fileurl.lastIndexOf('.'));
        const m3u8 = filepath + '/__' + filename + '__/video.m3u8';
        const sub = filepath + '/' + filenotype + '.vtt';
        function loadPlayer(videourl) {
            document.querySelector('#pv-container').classList.remove('hidden');
            document.querySelector('#pv-spinner').style.display = 'none';
            const dp = document.createElement('div');
            dp.id = 'dplayer';
            dp.style.cssText = 'width:100%;height:100%';
            document.querySelector('#pv-container').appendChild(dp);
            const dplayer = new DPlayer({ // eslint-disable-line
                container: document.querySelector('#dplayer'),
                autoplay: settings.autoplay,
                mutex: true,
                video: {
                    url: videourl,
                    type: 'auto'
                },
                subtitle: {
                    url: sub,
                    type: 'webvtt'
                }
            });
            document.onkeydown = ev => {
                if (ev.keyCode === 32) {
                    dplayer.toggle();
                }
            };
            preview.setLabels([preview.item.label], '', '');
        }
        function loadXMLDoc() {
            const xhr = new XHR();
            xhr.open('GET', m3u8, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XHR.DONE) {
                    if (xhr.status === 200) {
                        loadPlayer(m3u8);
                    } else if (xhr.status === 404) {
                        loadPlayer(fileurl);
                    }
                }
            };
            xhr.send();
        }
        loadXMLDoc();
    });
};

const init = () => {
    if (settings.enabled) {
        preview.register(settings.types, load, updateGui);
    }
};

init();
