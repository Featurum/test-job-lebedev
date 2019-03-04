const getters = {
    stats: (state) => {
    	let stats = {}
    	let list = state.list
    	list.filter(word => word.length > 6);

    	stats.all = list.length

        stats.simple = list.filter(item=>{
            return item.type == state.types.SIMPLE
        }).length

        stats.red = list.filter(item=>{
            return item.color == state.colors.RED
        }).length

        stats.greeb = list.filter(item=>{
            return item.color == state.colors.GREEN
        }).length

        stats.checked = list.filter(item=>{
            return item.check == true
        }).length

        stats.checkedSimple = list.filter(item=>{
            return item.check == true && item.type == state.types.SIMPLE
        }).length

        stats.checkedRed = list.filter(item=>{
            return item.check == true && item.color == state.colors.RED
        }).length

        stats.checkedGreeb = list.filter(item=>{
            return item.check == true && item.color == state.colors.GREEN
        }).length

     	return stats
    },
}

export default getters
