import { getConfig } from '../config';
import { isPlainObject } from './utils';
/**
 * 获取或设置url参数值
 * @param {string|null} url URL地址，若无效，则使用location.href
 * @param {string} name 参数名
 * @param {*} [val] 值，使用时转为字符串（这里没有检查有效性）
 * @returns {string} 返回参数值，或者修改后的url
 */
export function urlParam(url, name, val) {
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
export function loadScripts(urls) {
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
export function request(method, url, params) {
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
			}else{
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
export function load(url, params) {
	return request('get', url, params);
}
/**
 * POST远程调用
 * @param {string|RequestOption} url URL或整个参数
 * @param {FormData|URLSearchParams|{}} [params] 参数
 * @returns {Promise} 成功则返回response；失败返回{type,code,msg}
 */
export function post(url, params) {
	return request('post', url, params);
}