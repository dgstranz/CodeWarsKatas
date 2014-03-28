String.prototype.toAscii85 = function() {

	function strToNum(str) {
		var len = str.length;
		var res = 0;
		for (var i = 0; i < len; i++) {
			res += Math.pow(256, len-i-1) * str.charCodeAt(i);
		};
		return res;
	}

	function numToAscii85(num) {
		var res = '';
		while (num > 0) {
			chr = String.fromCharCode((num % 85) + 33);
			res = chr + res;
			num = Math.floor(num/85);
		}
		while (res.length < 5) res = '!' + res;
		return res;
	}

	var str = this;
	var len = str.length;
	var extlen = 4 * Math.ceil(len/4); // "Extended" length. It's a multiple of 4 equal to or greater than len
	var pos = 0; // The position of the string we're at
	var num = 0; // The result of converting a substring into a number
	var res = '';
	while (len - pos >= 4) { // While there are at least four characters remaining...
		substr = str.substring(pos,pos+4);
		num = strToNum(substr);
		res += numToAscii85(num);
		pos += 4;
	}
	if (extlen - len > 0) { // If len is not a multiple of 4...
		substr = str.substring(pos,len) + '\0\0\0';
		substr = substr.substring(0,4); // ...we add as many characters with value 0 as needed...
		num = strToNum(substr); //...convert...
		res += numToAscii85(num).substring(0, 5 + len - extlen); //...and remove the same amount of characters
	};

	var match = '';
	while ((match = /!!!!!/g.exec(res)) != null && match.index % 5 == 0) {
		res = res.replace(/!!!!!/, 'z');
	}

	res = '<~' + res + '~>';
	return res;
}

String.prototype.fromAscii85 = function() {

	function strToNum(str) {
		var len = str.length;
		var res = 0;
		for (var i = 0; i < len; i++) {
			res += Math.pow(85, len-i-1) * (str.charCodeAt(i) - 33);
		};
		return res;
	}

	function numToAscii(num) {
		var res = '';
		while (num > 0) {
			chr = String.fromCharCode(num % 256);
			res = chr + res;
			num = Math.floor(num/256);
		}
		while (res.length < 4) res = '\0' + res;
		return res;
	}

	var str = this;
	str = str.replace(/\s/g,'');
	if (/^<~/.test(str)) str = str.replace(/^<~/,'');
	if (/~>$/.test(str)) str = str.replace(/~>$/,'');
	var match = '';
	while ((match = /z/g.exec(str)) != null && match.index % 5 == 0) {
		str = str.replace(/z/, '!!!!!');
	}

	var len = str.length;
	var extlen = 5 * Math.ceil(len/5);
	var pos = 0;
	var num = 0;
	var res = '';
	while (len - pos >= 5) {
		substr = str.substring(pos,pos+5);
		num = strToNum(substr);
		res += numToAscii(num);
		pos += 5;
	}
	if (extlen - len > 0) {
		substr = str.substring(pos,len) + 'uuuu';
		substr = substr.substring(0,5);
		num = strToNum(substr);
		res += numToAscii(num).substring(0, 4 + len - extlen);
	};
	return res;
}