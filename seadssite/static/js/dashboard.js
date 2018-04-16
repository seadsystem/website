$(function () {
    var vm = new Vue({
        delimiters: ['${', '}'],
        el: '#vue-div',
        data: {
            'devices': user_devices
        }
    })
})
