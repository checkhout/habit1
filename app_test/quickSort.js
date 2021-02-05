
var arr = [1,1,2,3,4,5,34,3,4,5,656,6,5,54,4,43,3,3,3,3,3,3,3,3,43,544,543535,345,345,34534,
	534,5435,436,3456,456456,456,456456,546456,4564,34535345,345345345,34534626,262567,35734,737347,3470,0,0,0,7,7,7,7,5,4,4
];

/*快排2*/
var quickSort = function(arr) {
	if (arr.length <= 1) { return arr; }

	var pivotIndex = Math.floor(arr.length / 2);
	var pivot = arr.splice(pivotIndex, 1)[0];
	var left = [];
	var right = [];

	for (var i = 0; i < arr.length; i++){
		if (arr[i] < pivot) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quickSort(left).concat([pivot], quickSort(right));
};

var res2 = quickSort(arr);
console.log(res2);

