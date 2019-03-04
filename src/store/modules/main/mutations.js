import { findOptions } from '@/functions/findOptions.js'

// function getRandomArbitary(min, max) {
//   return Math.random() * (max - min) + min;
// }


const mutations = {
	// Создание нового блока
    created(state, data) {
    	let newBlock = {}

    	for(var x, j = [], i = 0; i < 20; i++) {
	    	let x = [[48,57], [65,90], [97,122], [1040,1103]][Math.random() * 4 >> 0];
		    j[i] = String.fromCharCode((Math.random() * (x[1] - x[0] + 1) >> 0) + x[0]);
		}

		newBlock.content = j.join("")

        if(data.random) {
            var keys = Object.keys(state.types)
            newBlock.type = state.types[keys[ keys.length * Math.random() << 0]];


            if(newBlock.type == state.types.COMPOSITE) {
                var keys = Object.keys(state.colors)
                newBlock.color = state.colors[keys[ keys.length * Math.random() << 0]];
            }
        } else {
            if(data.form.type) {
                newBlock.type = data.form.type
            }

            if(data.form.color) {
                newBlock.color = data.form.color
            }
        }

        newBlock.check = false

    	state.list.push(newBlock)
    },

    delete(state, index) {
    	state.list.splice(index, 1);
    },

    updateColor(state, index){
    	let item = state.list[index]
    	if(item.type == state.types.COMPOSITE && item.color) {
    		switch(item.color) {
    			case state.colors.RED:
    				item.color = state.colors.GREEN
    			break;

    			case state.colors.GREEN:
    				item.color = state.colors.RED
    			break;
    		}
    	}
    },

    checkedBlock(state, index) {
    	let item = state.list[index]
    	item.check = !item.check
    },

    deleteCheckedBlock(state) {
        for (var i = state.list.length - 1; i >= 0; i--) {
            state.list[i]
            if(state.list[i].check == true) {
                state.list.splice(i, 1);
            }
        }
    }
}

export default mutations