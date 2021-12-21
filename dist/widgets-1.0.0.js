/*!
 * widgets
 * @Version 1.0.0
 * @Author HanRubing <qdhrb@sina.com>
*/
const widgets = (function () {
	'use strict';

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
		};
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
		};
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

	// 默认promise-reject处理函数
	window.addEventListener('unhandledrejection', event => {
		console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
	});

	/**
	 * 如果itm是数组，直接返回；否则创建一个数组，包含该itm，返回
	 * @param itm
	 * @returns {[]}
	 */
	 function i2a(itm) {
		return Array.isArray(itm) ? itm : [itm];
	}
	/**
	 * 随机数
	 * @param {number} from
	 * @param {number} to
	 * @param {number} [fix] 比如：10，100，1000
	 * @returns {number}
	 */
	function rand(from, to, fix) {
		let v = (to - from) * Math.random() + from;
		return fix ? Math.round(v * fix) / fix : v;
	}
	/**
	 * 将小数四舍五入保留x位
	 * @param {number} n
	 * @param {number} t0 比如：10，100，1000
	 * @returns {number}
	 */
	function fix(n, t0) {
		return Math.round(n * t0) / t0;
	}
	/** 字符串切分正则表达式 */
	let _rgxSplit = /[^\x20\t\r\n\f,;]+/g;
	/**
	 * 拆分一个空白字符或逗号分割的字符串
	 * @param {String} str
	 * @param {RegExp} [rgx] 默认_rgxSplit
	 * @returns {String[]}
	 */
	function split(str, rgx) {
		return str ? str.match(rgx || _rgxSplit) : [];
	}
	/**
	 * 深度复制对象
	 * @param {Object} src
	 * @returns {Object}
	 */
	function clone(src) {
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
	function getItem(obj, ...args) {
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
	function setItem(obj, ...nvs) {
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
	function walkAT(parent, items, bn, fn) {
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
	function findAT(items, bn, fn) {
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
	function nextId(prefix) {
		return _lastId = prefix + '_' + (++_idSeed);
	}
	/**
	 * 取出最后一个通过nextId创建的id
	 * @returns {string}
	 */
	function lastId() {
		return _lastId;
	}

	// export object
	const app = {
		i2a, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
	};

	return app;

})();
