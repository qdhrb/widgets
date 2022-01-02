/*!
 * widgets
 * @Version 1.0.0
 * @Author HanRubing <qdhrb@sina.com>
*/
const wgs = (function () {
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
	 * 是否为函数
	 * @param {*} v
	 * @returns {boolean}
	 */
	function isFunc(v) {
		return typeof(v) === 'function';
	}
	/**
	 * 是否为字符串
	 * @param {*} v
	 * @returns {boolean}
	 */
	function isStr(v) {
		return typeof(v) === 'string';
	}
	/**
	 * 是否为数字
	 * @param {*} v
	 * @returns {boolean}
	 */
	function isNum(v) {
		return typeof(v) === 'number';
	}
	/**
	 * 判断是否为简单的对象
	 * @param {*} o
	 * @returns {boolean}
	 */
	function isPlainObject(o) {
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
	let _rgxSplit = /[^ \t\r\n,;]+/g;
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

	/**
	 * 配置项
	 */
	let _config = {
		'req.type': 'json',		// 默认request数据类型
		'req.tmo': 10000,		// 默认request超时
		// 默认request错误处理函数
		'req.error': err => {
			console.error('Request failed:', err);
		}
	};

	/**
	 * 获取配制
	 * @param {String} name 配置项
	 * @param {*} [dft] 默认值
	 * @returns {*}
	 */
	function getConfig(name, dft) {
		return _config.hasOwnProperty(name) ? _config[name] : arguments.length >= 2 ? dft : null;
	}

	/**
	 * 获取或设置url参数值
	 * @param {string|null} url URL地址，若无效，则使用location.href
	 * @param {string} name 参数名
	 * @param {*} [val] 值，使用时转为字符串（这里没有检查有效性）
	 * @returns {string} 返回参数值，或者修改后的url
	 */
	function urlParam(url, name, val) {
		let obj = new URL(url||'', location.href);
		if (arguments.length <= 2) return obj.searchParams.get(name);
		obj.searchParams.set(name, val);
		return obj.toString();
	}
	/** 脚本加载状态——避免重复加载 */
	let _sloaded = {};
	/**
	 * 加载script文件，并添加至heaer，并执行。脚本文件一般不应加载失败。
	 * @param {string[]} urls URL地址数组
	 * @returns {Promise<string[]>} 返回加载失败的错误信息数组；为空表示成功
	 */
	function loadScripts(urls) {
		let counter = urls.length, errs = [];
		return new Promise((resolve) => {
			for (let url of urls) {
				if (_sloaded[url]) {
					if (--counter <= 0) resolve(errs);
					continue;
				}
				_sloaded[url] = true;
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.onerror = err => {
					console.error(err);
					errs.push(err);
					if (--counter <= 0) resolve(errs);
				};
				script.onload = () => {
					if (--counter <= 0) resolve(errs);
				};
				document.head.appendChild(script);
				script.src = url;
			}
		});
	}

	/**
	 * @typedef {{url:string, params:FormData|URLSearchParams|{}, tmo:Number, type:String}} RequestOption
	 */
	/**
	 * 远程调用
	 * @param {'get'|'post'|'put'|'delete'} [method] 调用方法
	 * @param {string|RequestOption} url URL或整个参数
	 * @param {FormData|URLSearchParams|{}} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function request(method, url, params) {
		method = method ? method.toUpperCase() : 'GET';
		let opt = url instanceof Object ? url : {
			url, params
		};
		// 检查参数
		if (!opt.url) throw 'Need url';
		!opt.params && (opt.params = null);
		!opt.tmo && (opt.tmo = getConfig('req.tmo', 0));
		!opt.type && (opt.type = getConfig('req.type'));
		if (isPlainObject(opt.params)) {
			let fd = new FormData();
			for (let key of Object.keys(opt.params)) fd.append(key, opt.params[key]);
			opt.params = fd;
		}
		// 执行
		return new Promise((resolve, reject) => {
			// 准备xhr
			let xhr = new XMLHttpRequest();
			opt.tmo > 0 && (xhr.timeout = opt.tmo);
			opt.type && (req.responseType = opt.type);
			// 处理事件
			xhr.onerror = () => reject({type:'request', code:xhr.status, msg:xhr.statusText});
			xhr.onabort = () => reject({type:'request', code:-2, msg: 'Abort'});
			xhr.ontimeout = () => reject({type:'request', code:-1, msg: 'Timeout'});
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
					let toJson = typeof(xhr.response) === 'string' && xhr.getResponseHeader('content-type') === 'application/json';
					resolve(toJson ? JSON.parse(xhr.response) : xhr.response);
				}else {
					reject({type:'request', code:xhr.status, msg:xhr.statusText});
				}
			};
			// 执行
			xhr.open(method, opt.url);
			xhr.send(opt.params);
		});
	}
	/**
	 * GET/LOAD远程调用
	 * @param {string|RequestOption} url URL或整个参数
	 * @param {FormData|URLSearchParams|{}} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function load(url, params) {
		return request('get', url, params);
	}
	/**
	 * POST远程调用
	 * @param {string|RequestOption} url URL或整个参数
	 * @param {FormData|URLSearchParams|{}} [params] 参数
	 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
	 */
	function post(url, params) {
		return request('post', url, params);
	}

	/**
	 * @callback fnCNew
	 * @param {String} [clazz] cnew调用时的css类
	 * @returns {Widget|*}
	 */
	/**
	 * @callback fnQuery
	 * @param {HTMLElement} dom 查询得到的页面元素
	 */
	/**
	 * @callback fnEdit
	 * @param {Widget|*} w 当前Widget
	 */
	/**
	 * @callback fnEvent
	 * @param {Event} evt 事件参数
	 */

	/**
	 * Widget基础类
	 */
	class Widget {
		/**
		 * element
		 * @type {HTMLElement}
		 */
		dom = null;
		/**
		 *
		 * @param {string|HTMLElement} eTag 标签或element
		 * @param {string} [clazz] 初始css类
		 */
		constructor(eTag, clazz) {
			this.dom = eTag instanceof HTMLElement ? eTag :
						 isStr(eTag) ? document.createElement(eTag) :
						 	null;
			clazz && this.dom && (this.dom.className = clazz);
		}
		/**
		 * 注册
		 * @param {string} tag 标签，逗号或空格分隔
		 * @param {fnCNew} [fn] 创建函数；默认使用本类创建
		 */
		static register(tag, fn) {
			if (!fn) {
				let type = this;
				fn = new type();
			}
			for (let t of split(tag)) {
				t && (_wlib[t] = fn);
			}
		}
		/**
		 * 是否有效
		 * @returns {boolean}
		 */
		isValid() {
			return !!this.dom;
		}
		/**
		 * 是否有效并且离线
		 * @returns {boolean}
		 */
		isOffline() {
			return this.dom && !this.dom.parentElement;
		}
		// edit ------------------------------------------------------------------------------------------------------------
		/**
		 * 直接设置dom；当本身dom有效时：若新dom有效，则在原父节点下替换，若无效，从父节点上删除原dom
		 * @param {HTMLElement|null} dom
		 * @returns {this}
		 */
		setDom(dom) {
			if (this.dom) {
				let p = this.dom.parentElement;
				p && (dom ? p.replaceChild(dom, this.dom) : p.removeChild(this.dom));
			}
			this.dom = dom;
			return this;
		}
		/**
		 * 从父节点中移除 ——— dom没有清空
		 * @returns {this}
		 */
		offline() {
			let pp = this.dom && this.dom.parentElement;
			pp && pp.removeChild(this.dom);
			return this;
		}
		/**
		 * 清空子项
		 * @returns {this}
		 */
		empty() {
			this.dom && (this.dom.innerHTML = '');
			return this;
		}
		/**
		 * 设置内容子项（先清空，后添加）
		 * @param  {...(Widget|Node|String)} ary 加入的子元素
		 * @returns {this}
		 */
		content(...ary) {
			this.empty();
			let dom = this.dom;
			for (let chd of ary) {
				if (chd instanceof Widget) {
					dom.appendChild(chd.dom);
				}else if (chd instanceof Node) {
					dom.appendChild(chd);
				}else if (isStr(chd)) {
					this.dom.appendChild(document.createTextNode(chd));
				}
			}
			return this;
		}
		/**
		 * 添加子元素
		 * @param {string} wTag
		 * @param {string} [clazz]
		 * @param {string|fnEdit} [fnTxt]
		 * @returns {this}
		 */
		append(wTag, clazz, fnTxt) {
			let w = wTag instanceof Widget ? wTag :
					wTag instanceof HTMLElement ? new Widget(wTag) :
					wTag && cnew(wTag);
			if (w) {
				clazz && w.mclazz(clazz);
				if (fnTxt) {
					isFunc(fnTxt) ? fnTxt(w) : w.innerHTML = fnTxt;
				}
				this.dom.appendChild(w.dom);
			}
			return this;
		}
		/**
		 * 将自身添加至
		 * @param {Widget|HTMLElement|*} parent 父节点
		 * @returns {this}
		 */
		appendTo(parent) {
			let p = parent instanceof Widget ? parent.dom : parent;
			p && p.appendChild(this.dom);
			return this;
		}
		/**
		 * 插入元素
		 * @param {InsertPosition} pos 插入位置
		 * @param {HTMLElement|Widget|*} sub 子元素
		 * @returns {this}
		 */
		insert(pos, sub) {
			(sub instanceof Widget) && (sub = sub.dom);
			if (this.dom.parentElement || pos === 'afterbegin' || pos === 'beforeend') {
				this.dom.insertAdjacentElement(pos, sub);
			}else {
				if (!sub.parentElement) throw 'Widget.insert failed, no parent: ' + pos;
				sub.insertAdjacentElement(pos === 'afterend' ? 'beforebegin' : 'afterend', this.dom);
			}
			return this;
		}
		// attributes & html/text ------------------------------------------------------------------------------------------
		/**
		 * 标签名
		 * @returns {string}
		 */
		tag() { return this.dom.tagName; }
		/**
		 * 读取或设置id
		 * @param {string} [v] 新id
		 * @returns {this|string}
		 */
		id(v) {
			if (arguments.length >= 1) {
				v && (this.dom.id = v);
				return this;
			}
			return this.dom.id;
		}
		/**
		 * 设置属性
		 */
		static setAttr(dom, name, v) {
			v != null && v != undefined ? dom.setAttribute(name, v) : dom.removeAttribute(name);
		}
		/**
		 * 读取或设置属性
		 * @param {string|Object.<string,String>} nObj 属性名或属性集合
		 * @param {String|number} [v] 值，如果为null或undefined，则删除该属性
		 * @returns {this|String}
		 */
		attr(nObj, v) {
			if (nObj instanceof Object) {
				for (let name of Object.keys(nObj)) Widget.setAttr(this.dom, name, nObj[name]);
				return this;
			}
			if (arguments.length >= 2) {
				Widget.setAttr(this.dom, nObj, v); return this;
			}
			return this.dom.getAttribute(nObj);
		}
		/**
		 * 读取或设置数据值
		 * @param {String} name 数据名
		 * @param {String} v 值
		 * @returns {this|String}
		 */
		data(name, v) {
			if (arguments.length >= 2) {
				this.dom.dataset[name] = v != undefined && v != null ? v : ''; return this;
			}
			return this.dom.dataset[name];
		}
		/**
		 * 读取或设置内容
		 * @param {string} str 内容字符串
		 * @returns {this|string}
		 */
		html(str) {
			if (arguments.length >= 1) {
				this.dom.innerHTML = str != undefined && str != null ? str : ''; return this;
			}
			return this.dom.innerHTML;
		}
		/**
		 * 读取火设置文本内容
		 * @param {String} txt 文本内容
		 * @returns {this|string}
		 */
		text(txt) {
			if (arguments.length >= 1) {
				this.dom.textContent = txt != undefined && txt != null ? txt : ''; return this;
			}
			return this.dom.textContent;
		}
		/**
		 * 读取或设置值
		 * @param {string|{}} [v]
		 * @returns {string|this}
		 */
		val(v) {
			let dom = this.dom, useProp = ('value' in dom) && !(dom instanceof HTMLLIElement);
			if (arguments.length >= 1) {
				if (v != undefined) {
					useProp ? (dom.value = v) : dom.setAttribute('value', v != null ? v : '');
				}
				return this;
			}
			return useProp ? dom.value : (dom.getAttribute('value')||'');
		}
		/**
		 * 检验数据是否正确，若正确，保存至data
		 * @param {{}} [data] 上下文数据
		 * @returns {boolean}
		 */
		validate(data) {
			if (data) {
				let id = this.data('id');
				if (id) data[id] = this.val();
			}
			return true;
		}
		// style & class ---------------------------------------------------------------------------------------------------
		/**
		 * 获取或设置样式（最终样式值请用getComputedStyle计算）
		 * @param {string|Object.<string,string>} nObj 样式集合或者样式名
		 * @param {string} [val] 值
		 * @returns {this|string}
		 */
		style(nObj, val) {
			if (nObj instanceof Object) {
				for (let n of Object.keys(nObj)) this.dom.style[n] = nObj[n];
				return this;
			}else if (arguments.length >= 2) {
				this.dom.style[nObj] = val; return this;
			}
			return this.dom.style[nObj];
		}
		/**
		 * 设置grid布局及明细
		 * @param {{[cols]:string,[rows]:string,[colAuto]:string,[rowAuto]:string,[gap]:string,[align]:string,[alignV]:string}} [v] 数值
		 * @returns {this}
		 */
		grid(v) {
			this.dom.classList.add('wgs-grid');
			let ss = this.dom.style;
			v.cols && (ss['grid-template-columns'] = v.cols);
			v.rows && (ss['grid-template-rows'] = v.rows);
			v.colAuto && (ss['grid-auto-cols'] = v.colAuto);
			v.rowAuto && (ss['grid-auto-rows'] = v.rowAuto);
			v.gap && (ss['gap'] = v.gap);
			v.align && (ss['justify-items'] = v.align);
			v.alignV && (ss['align-items'] = v.alignV);
			return this;
		}
		/**
		 * 读取或设置css类
		 * @param {String} [v]
		 * @returns {string|this}
		 */
		clazz(v) {
			if (arguments.length >= 1) {
				this.dom.className = v;
				return this;
			}
			return this.dom.className;
		}
		/**
		 * 获取或修改css类
		 * @param {string} [add] 添加的类
		 * @param {string} [remove] 删除的类
		 * @returns {this}
		 */
		mclazz(add, remove) {
			let list = this.dom.classList;
			for (let c of split(add)) list.add(c);
			for (let c of split(remove)) list.remove(c);
			return this;
		}
		/**
		 * 检查是否拥有css类
		 * @param {string} c css类
		 * @returns {boolean}
		 */
		hasClazz(c) {
			return this.dom.classList.contains(c);
		}
		/**
		 * 切换class。如果有force参数，则强制修改
		 * @param {string} c 类名
		 * @param {boolean} [force] 是否强制添加类
		 * @returns {boolean} 操作后是否还拥有该css类
		 */
		toggleClazz(c, force) {
			return arguments.length === 1 ? this.dom.classList.toggle(c)
				: arguments.length >= 2 ? this.dom.classList.toggle(c, force)
					: false;
		}
		/**
		 * 选择子节点，并添加或删除css类
		 * @param {string} sel 子节点的选择器
		 * @param {string} clazz css类，如果以“!”开头，则删除css
		 * @param {string|HTMLElement|Widget|fnQuery} fnItem 操作项选择器或者dom，或者回调函数（返回true时添加css类）
		 * @returns {number} 选中的个数
		 */
		choice(sel, clazz, fnItem) {
			let op1, op2;
			if (clazz.charCodeAt(0) === 33) {   // 33是叹号
				op1 = 'remove'; op2 = 'add'; clazz = clazz.substring(1);
			}else {
				op1 = 'add'; op2 = 'remove';
			}
			let list = this.dom.querySelectorAll(sel), count = 0;
			if (isFunc(fnItem)) {
				for (let dom of list) {
					if (fnItem(dom)) {
						++count; dom.classList[op1](clazz);
					}else {
						dom.classList[op2](clazz);
					}
				}
			}else {
				let fnd = isStr(fnItem) ? this.dom.querySelector(fnItem) : ((fnItem && fnItem.dom) || fnItem);
				for (let dom of list) {
					if (fnd == dom) {
						++count; dom.classList[op1](clazz);
					}else {
						dom.classList[op2](clazz);
					}
				}
			}
			return count;
		}
		/**
		 * 显示
		 */
		show() {
			this.dom.classList.remove('wgs-hidden');
		}
		/**
		 * 隐藏
		 */
		hide() {
			this.dom.classList.add('wgs-hidden');
		}
		// query -----------------------------------------------------------------------------------------------------------
		/**
		 * 查询子节点
		 * @param {string} sel 选择器
		 * @param {fnQuery} [fn] 若有效，则执行（dom可能为空），并返回该函数的返回值
		 * @returns {Widget|null|*}
		 */
		query(sel, fn) {
			let fnd = this.dom.querySelector(sel);
			return isFunc(fn) ? fn(fnd) : fnd && new Widget(fnd);
		}
		/**
		 * 查询所有符合条件的子节点
		 * @param {string} sel 选择器
		 * @param {fnQuery} [fn] 若有效，则执行，并返回该函数的返回值
		 * @returns {(Widget|*)[]}
		 */
		queryAll(sel, fn) {
			let list = this.dom.querySelectorAll(sel), rtn = [], isFN = isFunc(fn);
			for (let d of list) {
				rtn.push(isFN ? fn(d) : new Widget(d));
			}
			return rtn;
		}
		/**
		 * 查询附近的节点
		 * @param {'parent'|'next'|'prev'|'first'|'last'} name 节点名
		 * @param {string|number} [nSel] 选择器或者第几个
		 * @param {fnQuery} [fn] 若有效，则执行（dom可能为空），并返回该函数的返回值
		 * @returns {Widget|null|*}
		 */
		nearby(name, nSel, fn) {
			let pn = _nearby_map[name];
			if (!pn) return null;
			if (!nSel) nSel = 1;
			let d = this.dom[pn];
			if (isNum(nSel)) {
				while (d && --nSel >= 1) d = d[pn];
			}else {
				while (d && !d.matches(nSel)) d = d[pn];
			}
			return isFunc(fn) ? fn(d) : d && new Widget(d);
		}
		/**
		 * 查询子节点（不包括子节点的子节点）
		 * @param {string|number} nSel 选择器或者第几个，支持负数（从后面选）
		 * @param {fnQuery} [fn] 若有效，则执行（dom可能为空），并返回该函数的返回值
		 * @returns {Ele|null|*}
		 */
		child(nSel, fn) {
			let d = this.dom;
			if (isNum(nSel)) {
				let chds = d.children;
				if (nSel < 0) nSel = chds.length + nSel;
				d = nSel >= 0 && nSel < chds.length ? chds[nSel] : null;
			}else {
				for (d = d.firstElementChild; d; d = d.nextElementSibling) {
					if (d.matches(nSel)) break;
				}
			}
			return isFunc(fn) ? fn(d) : d && new Widget(d);
		}
		/**
		 * 查询所有符合条件的子节点
		 * @param {string} sel 选择器
		 * @param {fnQuery} [fn] 若有效，则执行，并将返回值添加至返回数组
		 * @returns {(Ele|*)[]}
		 */
		children(sel, fn) {
			let ary = [], rtn = [], isFN = isFunc(fn);
			// 先复制一遍，避免后续操作（删除）影响next
			for (let d = this.dom.firstElementChild; d; d = d.nextElementSibling) {
				if (!sel || d.matches(sel)) ary.push(d);
			}
			for (let d of ary) {
				rtn.push(isFN ? fn(d) : new Widget(d));
			}
			return rtn;
		}
		/**
		 * 查找子元素序号
		 * @param {Widget|HTMLElement|*} chd 子元素
		 * @returns {number}
		 */
		findIndex(chd) {
			let fnd = chd instanceof Widget ? chd.dom : chd;
			let d = this.dom.firstElementChild, idx = 0;
			while (d) {
				if (d === fnd) return idx;
				++idx;
				d = d.nextElementSibling;
			}
			return -1;
		}
		// events ----------------------------------------------------------------------------------------------------------
		/**
		 * 绑定事件
		 * @param {string} selEvt 选择器或事件id
		 * @param {string|fnEvent} evtFn 事件id或事件处理函数
		 * @param {fnEvent} [fn] 事件处理函数
		 * @returns {this}
		 */
		on(selEvt, evtFn, fn) {
			if (arguments.length === 2) {
				this.dom['on' + selEvt] = isFunc(evtFn) ? evtFn : null;
			}else if (arguments.length >= 3) {
				let list = this.dom.querySelectorAll(selEvt);
				if (!isFunc(fn)) fn = null;
				for (let d of list) d['on' + evtFn] = fn;
			}
			return this;
		}
		/**
		 * 添加侦听事件
		 * @param {string} selEvt 选择器或事件id
		 * @param {string|fnEvent} evtFn 事件id或事件处理函数
		 * @param {fnEvent} [fn] 事件处理函数
		 * @returns {this}
		 */
		listen(selEvt, evtFn, fn) {
			if (arguments.length === 2 && isFunc(evtFn)) {
				this.dom.addEventListener(selEvt, evtFn);
			}else if (arguments.length >= 3 && isFunc(fn)) {
				let list = this.dom.querySelectorAll(selEvt);
				for (let d of list) d.addEventListener(evtFn, fn);
			}
			return this;
		}
		/**
		 * 派发事件
		 * @param {string} evtId 事件id
		 * @param {*} [params] 参数，可选
		 * @param {number} [delay] 延迟，若设置，则延时触发
		 * @returns {Event|*}
		 */
		dispatch(evtId, params, delay) {
			let evt = (params === undefined || params === null) ?
				new Event(evtId, {bubbles:true,cancelable:true}) : new CustomEvent(evtId, {bubbles:true,cancelable:true,detail:params});
			if (delay >= 0) {
				setTimeout(() => this.dom.dispatchEvent(evt), delay);
			}else {
				this.dom.dispatchEvent(evt);
			}
			return evt;
		}
		/**
		 * 按事件对应的目标，查找tag相同的父节点
		 * @param {Event|EventTarget|HTMLElement} evtTgt 事件目标或事件对象
		 * @param {string} tag 元素tag
		 * @param {fnQuery} [fn] 回调函数
		 * @returns {null|*}
		 */
		findByEvent(evtTgt, tag, fn) {
			let d = evtTgt instanceof Event ? evtTgt.target : evtTgt;
			tag = tag.toUpperCase();
			while (d && d.tagName !== tag) {
				if (d === this.dom) return null;
				d = d.parentElement;
			}
			return d && (isFunc(fn) ? fn(d) : new Widget(d));
		}
	}

	// Widget Lib ----------------------------------------------------------------------------------------------------------

	/**
	 * @type {Object.<string,fnCNew>}
	 */
	let _wlib = {};

	/**
	 * 创建组件
	 * @param {string} tag 标签
	 * @param {string} [clazz] css类
	 * @returns {Widget|*}
	 */
	function cnew(tag, clazz) {
		let fn = _wlib[tag];
		return fn ? fn(clazz) : new Widget(tag, clazz);
	}

	// export object
	const app = {
		i2a, isFunc, isStr, isNum, isPlainObject, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
		urlParam, request, load, post, loadScripts,

		Widget
	};

	return app;

})();
