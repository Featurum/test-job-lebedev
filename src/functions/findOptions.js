/*
 *	Функция поиска элемента в массиве
 */
export function findOptions(id, options, name = "name", select = "id") {
    for (var i = options.length - 1; i >= 0; i--) {
        if (options[i][select] === id) {
            return options[i][name]
        }
    }
}

/*
 *	Функция поиска ключа элемента в массиве
 */
export function findKey(id, options, select = "id") {
    for (var i = options.length - 1; i >= 0; i--) {
        if (options[i][select] === id) {
            return i
        }
    }
}