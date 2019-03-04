<template>
    <div :class="[ 'v_select', styleTagName, { multiple: multiple, disabled: disabledAssay, active: open } ]" v-if="multiple" @blur="closeList" @focus="openList" tabindex="0">
        <div class="v_select__value" ref="value" @mousedown.self="toggleList">
            <div class="v_select__case" ref="case">
                <span v-if="valueArrayReal == ''" class="placeholder" @mousedown.self="toggleList">{{placeholder}}</span>
                <span  v-if="valueArrayReal != ''" class="tag" v-for="item in valueArrayReal"  ref="item" :key="item.index">
                    {{ activeName(item) }}
                    <span class="delete" @click="selectOption(item)"></span>
                </span>
                <span class="tagsNum" ref="num">
                    <span class="tagsNumVal" ref="numVal"></span>
                    <span class="delete" @click="deleteOption()"></span>
                </span>
            </div>
            <div class="arrow" @mousedown.self="toggleList"></div>
        </div>
        <div class="tools">
            <input v-if="search" type="text" v-model="searchText" @blur="closeList" @focus="openList">
            <ul>
                <li
                    v-for="item in filteredList"
                    v-if="(item.name||item.title)"
                    @click="selectOption(item.id, item.disabled)"
                    :class="[
                        { 'active': selected(item.id) },
                        { 'disabled': item.disabled },
                        { 'restriction': restriction && !selected(item.id) }
                    ]"
                    :key="item.index"
                >
                    <span class="check"></span>
                    {{ item.name || item.title }}
                </li>
            </ul>
        </div>
    </div>

    <div :class="[ 'v_select', styleTagName, { disabled: disabledAssay, active: open }]" v-else @blur="closeList" @focus="openList" tabindex="0">
        <div class="v_select__value" @mousedown.self="toggleList">
            <div class="v_select__text" @mousedown="toggleList">
                <span v-if="!valueString" class="placeholder">{{ placeholder }}</span>
                <span v-else v-html="activeName(valueString)"></span>
            </div>
            <div class="arrow" @mousedown.self="toggleList"></div>
        </div>
        <div class="tools">
            <input v-if="search" type="text" v-model="searchText" @blur="closeList" @focus="openList">
            <ul>
                <li v-if="placeholder" @click="clearOption">{{ placeholder }}</li>
                <li v-for="item in filteredList" @click="selectOption(item.id, item.disabled)" :class="{'active': selected(item.id), disabled: item.disabled }" v-html="item.name || item.title" :key="item.index"></li>
            </ul>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            // Значение
            value: {
                default: null
            },

            // Функция возврата
            onChange: {
                type: Function,
                default: function (val) {
                    this.$emit('input', val)
                }
            },

            // Опции
            options: {
                type: Array,
                default() {
                    return []
                },
            },

            // Множественный выбор
            multiple: {
                type: Boolean,
                default: false
            },

            // Влейсхолдер
            placeholder: {
                type: String
            },

            // Строка поиска
            search: {
                type: Boolean,
                default: false
            },

            // Деактивация
            disabled: {
                default: false
            },

            /* Стилизация селектора по цвету */
            color: {
                type: String,
                default: "yellow"
            },

            /* Максимальное количество выбираемых элементов */
            maxlength: {
                type: Number,
                default: 0
            }
        },

        data: function() {
            return {
                // Флаг открытия селектора
                open: false,

                // Значения множественного выбора
                valueArray: [],

                // Значения выбранного селектора
                valueString: '',

                // Текст строки поиска
                searchText: '',

                el: {
                    value: '',
                    case: '',
                    tags: '',
                    num: '',
                    numVal: ''
                }
            }
        },

        // Вычисляемые ствойства
        computed: {
            // Значение селектора
            documentValue: function () {
                return this.value
            },

            // Значение селектора
            documentWidth: function () {
                // return this.$el.clientWidth
            },

            // Фильтрация опций
            filteredList() {
                if (this.searchText !== '' && this.search) {
                    let list = []
                    for (let k of this.options) {
                        k.name = k.name || k.title;
                        if(k.name && k.name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1) {
                            list.push(k)
                        }
                    }
                    return list
                } else {
                    return this.options
                }
            },

            // Проверка на Disabled
            disabledAssay() {
                if(typeof this.disabled == 'boolean' || typeof JSON.parse(this.disabled)  == 'boolean') {
                    return this.disabled
                }
                else {
                    return true
                }
            },

            // Проверка на существование опций в списке
            valueArrayReal() {
                let value = []
                for(let item of this.valueArray) {
                    if(this.activeName(item)) {
                        value.push(item)
                    }
                }
                return value
            },

            styleTagName() {
                if(this.color == "green") {
                    return 'v_select-green'
                } else {
                    return 'v_select-yellow'
                }
            },

            /* Ограничение на выбол селекторов */
            restriction() {
                return (this.maxlength != 0 && this.valueArray.length >= this.maxlength)
            }
            
        },

        // Перезапуск после обновления
        watch: {
            documentValue () {
                this.update()
            },

            documentWidth () {
                this.update()
            }
        },

        // Запуск после монтирования DOM
        mounted: function () {
            this.update()
        },

        // Запуск после монтирования DOM
        updated: function () {
            this.hideElements()
        },

        created() {
            window.addEventListener('resize', this.hideElements)
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.hideElements)
        },

        methods: {
            // Закрыть список
            closeList() {
                this.open = false
            },

            // Открыть список
            openList() {
                if(!this.disabledAssay) {
                    this.open = true
                }
            },

            // Поочередная смена
            toggleList() {
                if(!this.disabledAssay) {
                    this.open ^= true
                }
            },

            // Удалить последний элемент из списка
            deleteOption(){
                this.valueArray.pop()
                this.onChange(this.valueArray)
            },

            // Очистить селектор
            clearOption() {
                this.onChange('')
                this.closeList()
            },

            // update
            update() {
                if(this.multiple == true) {
                    if(this.value) {
                        this.valueArray = this.value
                    } else {
                        this.valueArray = []
                    }
                } else {
                    this.valueString = this.value
                }
            },

            // Ставим выбранные селекторы активными
            selected(id) {
                if(this.multiple == true) {
                    for (let opt of this.valueArray) {
                        if(typeof(id) == "string" && typeof(opt) == "string") {
                            if (opt.toLowerCase() === id.toLowerCase()) {
                                return true;
                            }
                        } else {
                            if (opt == id) {
                                return true;
                            }
                        }
                    }
                } else {
                    if(typeof(id) == "string") {
                        if (id === this.valueString) {
                            return true;
                        }
                    } else {
                        if (id === this.valueString) {
                            return true;
                        }
                    }
                }
            },

            // Вывести активный элемент
            activeName(id) {
                for (let opt of this.options) {
                    if(typeof(opt.id) == "string" && typeof(id) == "string") {
                        if (opt.id.toLowerCase() === id.toLowerCase()) {
                            return opt.name || opt.title
                        }
                    } else {
                        if (opt.id == id) {
                            return opt.name || opt.title
                        }
                    }
                }
            },

            // Клик на option
            selectOption(id, disabled){
                if(!disabled) {
                    if(this.multiple) {
                        if(this.valueArray.indexOf(id) == -1) {
                            if(!this.restriction) {
                                this.valueArray.push(id)
                            }
                        } else {
                            this.valueArray.splice(this.valueArray.indexOf(id), 1);
                        }
                        this.onChange(this.valueArray)
                    } else {
                        this.onChange(id)
                        this.closeList()
                    }
                }
            },
            
            hideElements(){
                if(this.multiple){
                    if (this.$refs.case) {
                        this.el.value = this.$refs.value
                        this.el.case = this.$refs.case
                        this.el.num = this.$refs.num
                        this.el.numVal = this.$refs.numVal
                        this.el.tags = this.el.case.getElementsByClassName('tag')

                        for (let i = 0; i < this.el.tags.length; i++) {
                            this.el.tags[i].style.display = 'inline-block'
                        }

                        this.el.num.style.display = 'none'

                        let i = 0

                        this.resizeCase(this.el.value, this.el.case, this.el.tags, i)
                    }
                }
            },

            resizeCase: function (valueEl, caseEl, tagsEl, i) {
                if(valueEl.clientWidth > 0 && valueEl.clientWidth - 51 < caseEl.clientWidth) {
                    i++
                    tagsEl[tagsEl.length - i].style.display = 'none'
                    this.el.num.style.display = 'inline-block'
                    this.el.numVal.innerHTML = i
                    this.resizeCase(valueEl, caseEl, tagsEl, i)
                }
            },
        }
    };
</script>

<style>
    .v_select {
        width: 100%;
        float: left;
        position: relative;
        display: inline-block;
        background: #fff;
        text-align: left;
        z-index: 2;
        cursor: pointer;
        color:#000;
    }

    .v_select.active {
        z-index: 3;
        cursor: default;
    }

    .v_select.disabled {
        opacity: .6;
    }
    .v_select li.disabled{
        opacity: .3;
    }
    .v_select .restriction {
        opacity: .3;
    }

    

    .v_select:focus {
        outline: none;
    }

    .v_select .arrow {
        width: 35px;
        height: 44px;
        position: absolute;
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNy45IDQuMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNy45IDQuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0ZBQzMwMSIgZD0iTTcuOSwwLjFDNy44LDAsNy42LDAsNy41LDAuMUw0LDMuN0wwLjUsMC4xQzAuNCwwLDAuMiwwLDAuMSwwLjFTMCwwLjQsMC4xLDAuNWwzLjcsMy43QzMuOSw0LjMsMy45LDQuMyw0LDQuMw0KCXMwLjEsMCwwLjItMC4xbDMuNy0zLjdDOCwwLjQsOCwwLjMsNy45LDAuMXoiLz4NCjwvc3ZnPg0K');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 12px;
        content: "";
        top: 1px;
        right: 1px;
        cursor: pointer;
        z-index: -1;
    }

    .v_select span {
        font-size: 16px;
        line-height: 36px;
    }

    .v_select.active .arrow {
        -moz-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        -o-transform: rotate(180deg);
        transform: rotate(180deg);
    }

    .v_select__value {
        width: 100%;
        height: 48px;
        line-height: 46px;
        padding: 0 35px 0 16px;
        border: 1px solid #dde2e6;
        z-index: 2;
        position: relative;
    }

    .v_select__case {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        /*cursor: pointer;*/
        position: absolute;
        left: 16px;
        top: 0;
    }

    .v_select__text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 18px;
        line-height: 46px;
    }

    .v_select .tag {
        padding: 0 28px 0 10px;
        margin-right: 5px;
        vertical-align: middle;
        line-height: 28px;
        height: 28px;
        display: inline-block;
        border-radius: 3px;
        background-color: #dde1e6;
        font-size: 14px;
        position: relative;
    }

    .v_select .delete {
        width: 28px;
        height: 28px;
        position: absolute;
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjEwcHgiIGhlaWdodD0iMTBweCIgdmlld0JveD0iMCAwIDEwIDEwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMCAxMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxnIGZpbGw9IiM3MjcyNzIiPg0KCQk8cG9seWdvbiBwb2ludHM9IjguNCwwIDUsMy41IDEuNSwwIDAsMS41IDMuNSw1IDAsOC40IDEuNiwxMCA1LDYuNSA4LjUsMTAgMTAsOC41IDYuNSw1IDEwLDEuNiIvPgkNCgk8L2c+DQo8L3N2Zz4NCg==');
        background-repeat: no-repeat;
        background-position: center;
        right: 0;
        top: 0;
        cursor: pointer;
        opacity: 0.8;
    }
    .v_select .delete:hover {
        opacity: 1;
    }

    .v_select .tagsNum {
        display: none;
        padding: 0 25px 0 8px;
        vertical-align: middle;
        line-height: 28px;
        height: 28px;
        border-radius: 3px;
        background-color: #fac301;
        font-size: 14px;
        position: relative;
    }

    .v_select .tagsNum:before {
        content: '+';
    }

    .v_select .tagsNumVal {
        line-height: 28px;
        height: 28px;
        font-size: 14px;
    }

    .v_select .tagsNum .delete {
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjEwcHgiIGhlaWdodD0iMTBweCIgdmlld0JveD0iMCAwIDEwIDEwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMCAxMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxnIGZpbGw9IiMwMDAiPg0KCQk8cG9seWdvbiBwb2ludHM9IjguNCwwIDUsMy41IDEuNSwwIDAsMS41IDMuNSw1IDAsOC40IDEuNiwxMCA1LDYuNSA4LjUsMTAgMTAsOC41IDYuNSw1IDEwLDEuNiIvPgkNCgk8L2c+DQo8L3N2Zz4NCg==');
        background-repeat: no-repeat;
        background-position: center;
    }

    .v_select .tools {
        min-width: 100%;
        top: 100%;
        left: 0;
        position: absolute;
        background: #fff;
        z-index: +10;
        border: 1px solid #dde2e6;
        border-width: 0 1px;
        display: none;
        box-shadow: 0 10px 20px rgba(0, 0, 0, .2);
        margin-bottom: 80px;
    }

    .v_select ul {
        width: 100%;
        max-height: 372px;
        background: #fff;
        overflow-y: auto;
        box-shadow: 0 10px 20px rgba(0, 0, 0, .2);
        padding: 6px 0;
        margin: 0;
        font-size: 14px;
    }

    .v_select ul li {
        width: 100%;
        padding: 6px 10px 6px 15px;
        position: relative;
        cursor: pointer;
        line-height: 24px;
    }

    .v_select ul li.active {
        background: #f7f7f7;
    }

    .v_select.multiple ul li, .v_select.multiple ul li.active {
        padding-left: 50px;
        font-weight: 400;
        background: transparent;
    }

    .v_select.multiple ul li .check {
        width: 24px;
        height: 24px;
        border: solid 2px #dde1e6;
        position: absolute;
        left: 15px;
        top: 6px;
        content: "";
    }

    .v_select.multiple ul li.active .check {
        border-color: #f8c301;
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDkuOSA3LjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDkuOSA3LjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCgk8cG9seWdvbiBpZD0iRmlsbC0yIiBmaWxsPSIjRkFDMzAxIiBwb2ludHM9IjMuNyw3LjYgMCw0IDEuNCwyLjUgMy43LDQuOCA4LjUsMCA5LjksMS40ICIvPg0KPC9zdmc+DQo=');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 60%;
        font-weight: 400;
    }

    .v_select.multiple ul li.placeholder {
        padding-left: 15px;
    }

    .v_select.active .tools {
        display: block;
    }

    .v_select input[type=text] {
        background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDE4IDE4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxOCAxODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPg0KCTxnIGZpbGw9IiNhNWFhYWYiPg0KCQk8cGF0aCBkPSJNMTUuOSwxMi41YzIuOC0yLjgsMi44LTcuNSwwLTEwLjNDMTMtMC43LDguNC0wLjcsNS41LDIuMWMtMi40LDIuNC0yLjgsNi0xLjEsOC44YzAsMCwwLjEsMC4yLDAsMC40DQoJCQlDMy41LDEyLjIsMC43LDE1LDAuNywxNWMtMC43LDAuNy0wLjksMS44LTAuMywyLjRsMC4xLDAuMWMwLjcsMC43LDEuNywwLjUsMi40LTAuM2MwLDAsMi44LTIuOCwzLjctMy43YzAuMi0wLjIsMC40LTAuMSwwLjQtMC4xDQoJCQlDOS45LDE1LjIsMTMuNCwxNC45LDE1LjksMTIuNXogTTYuOSwxMS4xQzQuOCw5LDQuOCw1LjYsNi45LDMuNWMyLjEtMi4xLDUuNS0yLjEsNy42LDBjMi4xLDIuMSwyLjEsNS41LDAsNy42DQoJCQlDMTIuNCwxMy4yLDksMTMuMiw2LjksMTEuMXoiLz4NCg0KCQk8cGF0aCBkPSJNNy40LDYuOWMtMC4xLDAtMC4yLDAtMC4zLTAuMWMtMC40LTAuMi0wLjYtMC42LTAuNC0xYzEtMi40LDMuOC0zLjUsNi4yLTIuNWMwLjQsMC4yLDAuNiwwLjYsMC40LDENCgkJCQljLTAuMiwwLjQtMC42LDAuNi0xLDAuNEMxMC42LDQsOC43LDQuOCw4LDYuNEM3LjksNi43LDcuNiw2LjksNy40LDYuOXoiLz4NCg0KCTwvZz4NCjwvc3ZnPg0K');
        background-position: 15px center;
        background-repeat: no-repeat;
        width: 100%;
        padding: 5px 10px 5px 50px;
        border-bottom: 1px solid #e9e9e9;
        font-size: 16px;
        line-height: 36px;
        border-top: 1px solid #e9e9e9;
        margin-top: -1px;
    }


    .v_select-green .arrow {
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNy45IDQuMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNy45IDQuMzsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iIzJiYTM1YyIgZD0iTTcuOSwwLjFDNy44LDAsNy42LDAsNy41LDAuMUw0LDMuN0wwLjUsMC4xQzAuNCwwLDAuMiwwLDAuMSwwLjFTMCwwLjQsMC4xLDAuNWwzLjcsMy43QzMuOSw0LjMsMy45LDQuMyw0LDQuMw0KCXMwLjEsMCwwLjItMC4xbDMuNy0zLjdDOCwwLjQsOCwwLjMsNy45LDAuMXoiLz4NCjwvc3ZnPg0K')
    }


    .v_select-green.multiple ul li.active .check {
        border-color: #2ba35c;
    }

    .v_select-green.multiple ul li.active .check {
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgOS45IDcuNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgOS45IDcuNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KCTxwb2x5Z29uIGZpbGw9IiMyYmEzNWMiIHBvaW50cz0iMy43LDcuNiAwLDQgMS40LDIuNSAzLjcsNC44IDguNSwwIDkuOSwxLjQgIi8+DQo8L3N2Zz4NCg==');
    }

    .v_select-green .tagsNum { background-color: #2ba35c; color:#fff; }

    .v_select-green .tagsNum .delete {
        background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTBweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTAgMTAiPg0KCTxwb2x5Z29uIGZpbGw9IiNmZmYiIHBvaW50cz0iOC40LDAgNSwzLjUgMS41LDAgMCwxLjUgMy41LDUgMCw4LjQgMS42LDEwIDUsNi41IDguNSwxMCAxMCw4LjUgNi41LDUgMTAsMS42Ii8+CQ0KPC9zdmc+DQo=')
    }

</style>
