<template>
    <div class="wrap index">
        <div class="index-attach">
            <div class="index-block index-stats">
                <div class="row">
                    <div class="col-lg-2 col-sm-4 col-xs-12">
                        <div class="index-stats__item">
                            <div class="index-stats__count">{{ stats.all }}</div>
                            <div class="index-stats__label">Всего блоков</div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-sm-4 col-xs-12">
                        <div class="index-stats__item">
                            <div class="index-stats__count">{{ stats.simple }}</div>
                            <div class="index-stats__label">Простых блоков</div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-sm-4 col-xs-12">
                        <div class="index-stats__item">
                            <div class="index-stats__count">{{ stats.red }}</div>
                            <div class="index-stats__label">Красных блоков</div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-sm-4 col-xs-12">
                        <div class="index-stats__item">
                            <div class="index-stats__count">{{ stats.greeb }}</div>
                            <div class="index-stats__label">Зеленых блоков</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="index-block">
                <div :class="['v_btn', 'index-tools-btn', { 'v_btn-disabled': stats.checked == 0 }]" @click="deleteCheckedBlock">Удалить выбранные</div>

                <span class="index-tools-stats">
                    Выбрано:
                    всего - <b>{{ stats.checked }}</b>,
                    простых - <b>{{ stats.checkedSimple }}</b>,
                    красных - <b>{{ stats.checkedRed }}</b>,
                    зеленых - <b>{{ stats.checkedGreeb }}</b>
                </span>
            </div>

            <div class="index-block index-list">
                <div class="row">
                    <div class="col-lg-4 col-sm-6 col-xs-12" v-for="(item, index) in list">
                        <v-block
                            class="index-list__item"
                            v-bind="item"
                            :index="index"
                            v-on:delete="deleteSuccess($event)"
                            v-on:color="updateColorBlock($event)"
                            v-on:checked="checkedBlock($event)"
                        ></v-block>
                    </div>
                </div>
            </div>
            <div class="index-block">
                <form class="index-form" @submit.prevent="createBlock(false)">
                    <div class="index-form__title">Добавить новый блок</div>
                    
                    <div class="index-form__case">
                        <label>Тип блока</label>
                        <v-select :options="options.types" v-model="form.type"></v-select>
                    </div>
                    
                    <div class="index-form__case" v-if="form.type == types.COMPOSITE">
                        <label>Цвет блока</label>
                        <v-select :options="options.colors" v-model="form.color"></v-select>
                    </div>

                    <button type="submit" class="v_btn">Добавить</button>
                </form>
            </div>
        </div>

        <flash-message class="index-flash"></flash-message>
    </div>
</template>

<script>
    /* Компоненты */ 
    import checkbox from '@/services/main/components/checkbox/'
    import select from '@/services/main/components/select/'
    import icon from '@/services/main/components/icon/'

    import block from '@/services/main/components/block/block.vue'

    import { mapState, mapGetters } from "vuex"

    export default {
        name: "mainIndex",
        
        data() {
            return {
                form: {
                    type: null,
                    color: ''
                }
            }
        },

        computed: {
            ...mapState({
                list(state) {
                    return state.main.list;
                },

                types(state) {
                    return state.main.types;
                },

                options(state) {
                    return state.main.options;
                }
            }),

            ...mapGetters({
                stats: 'main/stats',
            })
        },

        components: {
            'v-checkbox': checkbox,
            'v-select': select,
            'v-icon': icon,
            'v-block': block
        },

        methods: {
            deleteSuccess(index) {
                this.$swal("Удалить блок").then((result) => {
                    this.deleteBlock(index)
                });
            },

            createBlock(random = false) {
                if(!random && !this.form.type) {
                    this.flash('Укажите тип блока', "error");
                    return false
                }

                if(!random && this.form.type == this.types.COMPOSITE && !this.form.color) {
                    this.flash('Укажите цвет блока', "error");
                    return false
                }

                this.$store.commit('main/created', { form: this.form, random: random });
            },


            deleteBlock(index) {
                this.$store.commit('main/delete', index);
            },

            updateColorBlock(index) {
                this.$store.commit('main/updateColor', index);
            },

            checkedBlock(index) {
                this.$store.commit('main/checkedBlock', index);
            },

            deleteCheckedBlock(index) {
                if(this.stats.checked != 0) {
                    this.$store.commit('main/deleteCheckedBlock');
                }
            }
        },

        created() {
            for (var i = 5; i >= 0; i--) {
                this.createBlock(true)
            }
        }
    };
</script>

<style lang="scss" src="./index.scss"></style>