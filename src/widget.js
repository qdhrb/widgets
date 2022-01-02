import { isFunc, isStr, isNum, split } from "./utils/utils";

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
export default class Widget {
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
			t && (_wlib[t] = fn)
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
		}else{
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
		this.dom.classList.add('__CSS-grid');
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
		}else{
			op1 = 'add'; op2 = 'remove';
		}
		let list = this.dom.querySelectorAll(sel), count = 0;
		if (isFunc(fnItem)) {
			for (let dom of list) {
				if (fnItem(dom)) {
					++count; dom.classList[op1](clazz);
				}else{
					dom.classList[op2](clazz);
				}
			}
		}else{
			let fnd = isStr(fnItem) ? this.dom.querySelector(fnItem) : ((fnItem && fnItem.dom) || fnItem);
			for (let dom of list) {
				if (fnd == dom) {
					++count; dom.classList[op1](clazz);
				}else{
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
		this.dom.classList.remove('__CSS-hidden');
	}
	/**
	 * 隐藏
	 */
	hide() {
		this.dom.classList.add('__CSS-hidden');
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
		}else{
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
		}else{
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
		}else{
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
 * 注册组件
 * @param {string} tag 标签，逗号或空格分隔
 * @param {fnCNew} [fn] 创建函数
 * @returns {undefined|fnCNew|Object.<string,fnCNew>}
 */
export function register(tag, fn) {
	if (arguments.length <= 1) {
		return tag ? _wlib[tag] : _wlib;
	}
	for (let t of split(tag)) {
		t && (_wlib[t] = fn);
	}
	return fn;
}

/**
 * 创建组件
 * @param {string} tag 标签
 * @param {string} [clazz] css类
 * @returns {Widget|*}
 */
export function cnew(tag, clazz) {
	let fn = _wlib[tag];
	return fn ? fn(clazz) : new Widget(tag, clazz);
}
