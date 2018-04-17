$(function () {
    Vue.component('device-menu', {
        props: ['deviceId', 'deviceInfo', 'manage_btn_toggle'],
        template: '<div><a href=""\
                    class="list-group-item manage-item"\
                    @click.prevent="toggleChildren">\
                    <i :class="iconClasses"></i>\
                     {{deviceInfo.name}}</a>\
                    <a v-for="(roomInfo, room) in deviceInfo.rooms"\
                    v-if="showChildren"\
                    class="list-group-item manage-item" href="">\
                    {{room}}</a></div>',
        data: function () {
            return {
                showChildren: false
            }
        },
        computed: {
            iconClasses() {
                return {
                    'glyphicon glyphicon-chevron-right': !this.showChildren,
                    'glyphicon glyphicon-chevron-down': this.showChildren
                }
            }
        },
        methods: {
            toggleChildren() {
                this.showChildren = !this.showChildren;
            }
        }
    });

    var vm = new Vue({
        delimiters: ['${', '}'],
        el: '#vue-div',
        data: {
            devices: user_devices,
            icon_path: img_path + "/home.png",
            icons: [img_path + "/bedroom.png",
                img_path + "/bedroom2.png",
                img_path + "/office.png",
                img_path + "/kitchen.png",
                img_path + "/bathroom.png",
                img_path + "/livingroom.png"
            ],
        },

    })
})
