/**
 * 如果itm是数组，直接返回；否则创建一个数组，包含该itm，返回
 * @param itm
 * @returns {[]}
 */
export function i2a(itm) {
	return Array.isArray(itm) ? itm : [itm];
}
/**
 * 是否为函数
 * @param {*} v
 * @returns {boolean}
 */
export function isFunc(v) {
	return typeof(v) === 'function';
}
/**
 * 是否为字符串
 * @param {*} v
 * @returns {boolean}
 */
export function isStr(v) {
	return typeof(v) === 'string';
}
/**
 * 是否为数字
 * @param {*} v
 * @returns {boolean}
 */
export function isNum(v) {
	return typeof(v) === 'number';
}
/**
 * 判断是否为简单的对象
 * @param {*} o
 * @returns {boolean}
 */
export function isPlainObject(o) {
	if (o === null || typeof o !== 'object') return false;
	let proto = o;
	while (Object.getPrototypeOf(proto) !== null) {
		proto = Object.getPrototypeOf(proto);
	}
	return Object.getPrototypeOf(o) === proto;
}
/**
 * 随机数
 * @param {number} from
 * @param {number} to
 * @param {number} [fix] 比如：10，100，1000
 * @returns {number}
 */
export function rand(from, to, fix) {
	let v = (to - from) * Math.random() + from;
	return fix ? Math.round(v * fix) / fix : v;
}
/**
 * 将小数四舍五入保留x位
 * @param {number} n
 * @param {number} t0 比如：10，100，1000
 * @returns {number}
 */
export function fix(n, t0) {
	return Math.round(n * t0) / t0;
}
/** 字符串切分正则表达式 */
let _rgxSplit = /[^ \t\r\n,;]+/g;
/**
 * 拆分一个空白字符或逗号分割的字符串
 * @param {String} str
 * @param {RegExp} [rgx] 默认_rgxSplit
 * @returns {String[]}
 */
export function split(str, rgx) {
	return str ? str.match(rgx || _rgxSplit) : [];
}
/**
 * 深度复制对象
 * @param {Object} src
 * @returns {Object}
 */
export function clone(src) {
	function _c_obj(o) {
		if (o === null || typeof(o) !== 'object') return o;
		let n = Array.isArray(o) ? [] : {};
		for (let key in o) {
			o.hasOwnProperty(key) && (n[key] = _c_obj(o[key]));
		}
		return n;
	}
	return _c_obj(src);
}
/**
 * 从对象中取出子项
 * @param {Object} obj
 * @param {number|String} args
 * @returns {*}
 */
export function getItem(obj, ...args) {
	let o = obj;
	for (let p of args) {
		if (!o) return null;
		o = o[p];
	}
	return o;
}
/**
 * 设置或创建对象值
 * @param {Object} obj
 * @param nvs
 */
export function setItem(obj, ...nvs) {
	if (nvs.length <= 1) return;
	let p = obj, pnl = nvs.length - 2;
	for (let i = 0; i < pnl; ++i) {
		let cur = p[nvs[i]];
		p = cur instanceof Object ? cur : (p[nvs[i]] = typeof(nvs[i+1]) === 'number' ? [] : {});
	}
	p[nvs[pnl]] = nvs[pnl+1];
}
/**
 * 遍历基于数组的树，父节点优先
 * @param {*} parent 初始父值，用于fn回调
 * @param {[]} items 子项
 * @param {String} bn 项目的子项元素名称，一般是children
 * @param {function(p, item):*} fn 处理函数
 */
export function walkAT(parent, items, bn, fn) {
	function _loop(p, items) {
		for (let item of items) {
			let sub = fn(p, item), ss = item[bn];
			if (sub && Array.isArray(ss)) _loop(sub, ss);
		}
	}
	_loop(parent, items);
}
/**
 * 查找基于数组的树
 * @param {[]} items
 * @param {String|number} bn
 * @param {function(item:*)} fn
 * @returns {*} 如果返回undefined，表示没找到
 */
export function findAT(items, bn, fn) {
	function _loop(items) {
		for (let item of items) {
			if (fn(item)) return item;
			if (Array.isArray(item[bn])) {
				let fnd = _loop(item[bn]);
				if (fnd !== undefined) return fnd;
			}
		}
	}
	return _loop(items);
}
/** nextId种子 */
let _idSeed = 1000;
/** 最后一个通过nextId创建的id */
let _lastId = null;
/**
 * 新建id
 * @param {String} prefix 前缀
 * @returns {string}
 */
export function nextId(prefix) {
	return _lastId = prefix + '_' + (++_idSeed);
}
/**
 * 取出最后一个通过nextId创建的id
 * @returns {string}
 */
export function lastId() {
	return _lastId;
}
