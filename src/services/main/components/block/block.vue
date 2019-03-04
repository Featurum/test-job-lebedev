<template>
    <div :class="styleClasses" v-on:click="clickBlock()">
        <div class="index-item__delete" @click="deleteBlock()">
            <v-icon class="index-item__delete__icon" name="delete" width="16px" height="16px"></v-icon>
        </div>
        <p>{{ content }}</p>
    </div>
</template>

<script>
    import icon from '@/services/main/components/icon/'

    import { mapState } from "vuex"

    export default {
        props: {
            index: {
                type: Number,
                required: null
            },

            type: {
                type: Number,
                required: null
            },

            check: {
                type: Boolean,
                required: false
            },

            content: {
                type: String,
                default: undefined
            },

            color: {
                type: String,
                default: undefined
            },

            onFunc: {
                type: Function,
                default: function (emit) {
                    this.$emit(emit, this.index)
                }
            }
        },

        data() {
            return {
                delay: 300,
                clicks: 0,
                timer: null
            }
        },

        components: {
            'v-icon': icon
        },

        computed: {
            ...mapState({
                types(state) {
                    return state.main.types;
                }
            }),

            compositeBlock() {
                return this.type == this.types.COMPOSITE
            },

            styleClasses() {
                let classes = [ 'index-item' ]

                if(this.color) {
                    classes.push('index-item-' + this.color)
                }

                if(this.check) {
                    classes.push('index-item-check')
                }

                return classes
            }
        },

        methods: {
            clickBlock(event) {
                this.clicks++ 
                  if(this.clicks === 1) {
                    var self = this
                    this.timer = setTimeout(function() {
                        // Один клик
                        self.onFunc('checked')
                        self.clicks = 0
                    }, this.delay);
                } else{
                    // Два клика
                    clearTimeout(this.timer);  
                    this.onFunc('color')
                    this.clicks = 0;
                }     
            },

            deleteBlock(e) {
                this.onFunc('delete')
            }
        }
    };
</script>

<style lang="scss" scoped>
    .index-item {
        width: 100%;
        display: inline-block;
        background: #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,.1);
        padding: 25px 35px;
        border-radius: 3px;
        float: left;
        position: relative;

        &-red { 
            background: #FF416C;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #FF4B2B, #FF416C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }
        &-green {
            background: #00b09b;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #96c93d, #00b09b);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #96c93d, #00b09b); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }

        &-check {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            border: 3px dashed #fac301;
            padding: 22px 32px;

            .index-item__delete {
                right: 7px;
                top: 7px;
            }
        }

        &__delete {
            position: absolute;
            cursor: pointer;
            fill: rgba(0,0,0,.2);
            right: 10px;
            top: 10px;

            &:hover {
                fill: rgba(0,0,0,.4);
            }
        }
    }
</style>
