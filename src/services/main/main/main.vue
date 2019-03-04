<template>
    <router-view></router-view>
</template>

<script>
    var __svg__ = { path: '../../../assets/icons/**/*.svg', name: './img/main.[hash].svg' }
    require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);

    export default {
        components: {

        },

        computed: {

        },

        methods: {
            
        }
    };
</script>