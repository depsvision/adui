import { MockMethod } from 'vite-plugin-mock'
export default [
    {
        url: '/api/user/limit',
        method: 'get',
        response: ({ query }) => {
            return { "data": { "limit": 1, "role": { "alert": 0, "app": 0, "callback": 0, "callbackLog": 0, "camera": 0, "console": 0, "imageTask": 0, "linkage": 0, "log": 0, "material": 0, "node": 0, "oss": 0, "record": 0, "role": 0, "setting": 0, "task": 0, "user": 0 } }, "requestInfo": { "flag": true } }
        },
    },
    {
        url: '/api/setting/server/info',
        method: 'get',
        timeout: 2000,
        response: { "data": { "favicon": "", "logo": "", "name": "" }, "requestInfo": { "flag": true } }
    },
    {
        url: '/api/log',
        method: 'get',
        response: {data: {}}
    },
    {
        url: '/api/device/server/status',
        method: 'get',
        response: { "data": { "master": { "cpu": 12.9, "disk": { "available": 55755536.0, "block": 244568380.0 }, "memory": { "available": 19219582976, "block": 33348087808 } } }, "requestInfo": { "flag": true } }
    },
    {
        url: '/api/setting/alert/notify/status',
        method: 'get',
        response: { "data": { "pop": false, "voice": false }, "requestInfo": { "flag": true } }
    },
    {
        url: '/api/openness/app/jump',
        method: 'get',
        response: { "data": { "application": [{ "appId": "3TihiTit4Wu8", "display": "dongyue", "id": 1, "url": "http://168.0.8.97:8080" }] }, "requestInfo": { "flag": true } }
    },
] as MockMethod[]