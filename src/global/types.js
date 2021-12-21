if (!String.prototype.decode) {
	/**
	 * 转换字符串<br>
	 * 比如：'aaa'.decode({'aaa':0}) 返回的是 0
	 * @param {Object.<String,*>} map map
	 * @param {*} [dft] 当map中查找到的值为undefined时，返回的默认值；如果没有设置，返回空字符串
	 * @returns {*}
	 */
	String.prototype.decode = function(map, dft) {
		let v = map[this];
		return v != undefined ? v : (dft||'');
	}
}
if (!Array.prototype.remove) {
	/**
	 * 删除元素
	 * @param e 需要删除的元素
	 * @returns {this}
	 */
	Array.prototype.remove = function (e) {
		let idx = this.indexOf(e);
		if (idx >= 0) this.splice(idx, 1);
		return this;
	};
}
if (!Array.prototype.last) {
	/**
	 * 取出数组中最后一个
	 * @returns {*}
	 */
	Array.prototype.last = function () {
		return this.length > 0 ? this[this.length - 1] : null;
	}
}
/**
 * 日期：格式化
 * 月(M)、日(d)、小时(h)、分(m)、秒(s) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S) 1-3 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.{S}") ==> 2006-07-02 08:09:04.423
 * @param {String} fmt 格式字符串
 * @return {String}
 * */
Date.prototype.format = function (fmt) {
	return fmt.replace(/{(y+|M+|d+|h+|m+|s+|S)}/g, (_, k) => {
		let v, k0 = k.charAt(0);
		switch (k0) {
			case 'y': return String(this.getFullYear()).substr(4 - k.length);
			case 'M': v = this.getMonth() + 1; break;
			case 'd': v = this.getDate(); break;
			case 'h': v = this.getHours(); break;
			case 'm': v = this.getMinutes(); break;
			case 's': v = this.getSeconds(); break;
			case 'S':
				v = this.getMilliseconds();
				return v >= 100 ? v : (v >= 10 ? '0' + v : '00' + v);
			default:
				return '';
		}
		return k.length > 1 ? (v >= 10 ? v : ('0' + v)) : v;
	});
};