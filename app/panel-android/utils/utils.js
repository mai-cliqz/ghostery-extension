/**
 * Add new item to immutable array and return new array.
 * @memberOf PanelUtils
 * @param  {array} array 	original array
 * @param  {*} 	  item		item to add
 * @return {array}  		clone with item added
 */
export function addToArray(array, item) {
	return [...array, item];
}

/**
 * Remove item from immutable array by index and return new array
 * @memberOf PanelUtils
 * @param  {array} 		array 			original array
 * @param  {number}   	position		index of the item to be removed
 * @return {array} 						clone with item removed
 */
export function removeFromArray(array, position) {
	return array.filter((item, index) => index !== position);
}
