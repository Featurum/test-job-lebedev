<template>
    <div :class="['v_checkbox',{'v_checkbox-green': color == 'green' ,'v_checkbox-active': state, 'v_checkbox-disabled': disabled, 'v_checkbox-label': label}]" @click.event="toggle()" tabindex="0">
        <span v-if="label" v-html="label"></span>
    </div>
</template>

<style>
    .v_checkbox {
        min-width: 24px;
        min-height: 24px;
        display: inline-block;
        position: relative;
        cursor: pointer;
        font-weight: 400;
        text-align: left;
        line-height: 1;
    }
    .v_checkbox-label {
        padding: 0 10px 0 40px;
    }
    .v_checkbox input {
        display: none;
    }
    .v_checkbox:before {
        width: 24px;
        height: 24px;
        border: solid 2px #fac301;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -12px;
        display: inline-block;
        cursor: pointer;
        content: "";
    }
    .v_checkbox-active:before { 
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDkuOSA3LjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDkuOSA3LjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cG9seWdvbiBpZD0iRmlsbC0yIiBmaWxsPSIjRkFDMzAxIiBwb2ludHM9IjMuNyw3LjYgMCw0IDEuNCwyLjUgMy43LDQuOCA4LjUsMCA5LjksMS40ICIvPg0KPC9zdmc+DQo=');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 60%;
    }
    .v_checkbox span {
        color: #000;
        display: inline-block;
        line-height: normal;
        position: relative;
        vertical-align: middle;
        z-index: 0;
    }

    .v_checkbox-disabled {
        -webkit-filter: grayscale(1);
        filter: gray;
        filter: grayscale(1);
    }
    
    @media screen and (max-width:767px) {
        .v_checkbox br { display: none; }
    }

    .v_checkbox-green:before {
        border-color: #2ba35c;
        border-radius: 3px;
        border-width: 1px;
    }

    .v_checkbox-green.v_checkbox-active:before { 
        background-image:url('data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSLQodC70L7QuV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDEwIDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEwIDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cG9seWdvbiBmaWxsPSIjMkJBMzVDIiBwb2ludHM9IjMuNyw3LjYgMCw0IDEuNSwyLjUgMy43LDQuOCA4LjUsMCAxMCwxLjQgIi8+DQo8L3N2Zz4NCg==')
    }

</style>

<script>
    export default {
        name: 'checkbox',

        data () {
            return {
                state: ''
            }
        },

        props: {
            value: {
                default: null
            },

            label: {
                type: String,
                default() {
                    return ''
                },
            },

            disabled: {
                type: Boolean,
                default: false
            },
            
            color: {
                type: String,
                default() {
                    return ''
                },
            }
        },

        watch: {
            value: function (val) {
                if(val == undefined || val == null || typeof val == "undefined"){
                    this.state = false
                    this.$emit('input', this.state)
                } else {
                    this.state = val
                }
            }
        },

        methods: {
            toggle() {
                if(!this.disabled) {
                    this.state = !this.state
                    this.$emit('input', this.state)
                }
            }
        },

        created() {
            this.state = this.value 
        }
    }
</script>
