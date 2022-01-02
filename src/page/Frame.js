import Widget, { register } from "../widget";
import Page from "./Page";


/** Frame */
export default class Frame extends Widget {
	/**
	 * 多页面时，页面所属sheet
	 * @type {Widget}
	 */
	sheet = null;
	/**
	 * 所有页面
	 * @type {Object.<string, Page|*>}
	 */
	pages = null;
	/**
	 * 当前页面
	 * @type {Page}
	 */
	cpage = null;
	/**
	 * 构造函数
	 */
	constructor() {
		super('div', '__CSS-frame');
	}
	/**
	 * 添加页面；如果页面没有id，会随机创建一个
	 * @param {Page|*} p 页面
	 * @returns {Page|*} 返回添加的页面
	 */
	addPage(p) {
		if (!p) return null;
		if (!this.sheet) throw 'No sheet';
		let id = p.id();
		if (!id) p.id(id = nextId('page'));
		this.sheet.append(p);
		(!this.pages) && (this.pages = {});
		this.pages[id] = p;
		return p;
	}
	/**
	 * 获取页面
	 * @param {string} id 页面id
	 * @returns 页面对象
	 */
	getPage(id) {
		return this.pages[id];
	}
	/**
	 * 移除页面
	 * @param {string} id 页面id
	 * @returns {Page|*} 被移除的页面对象
	 */
	removePage(id) {
		let p = this.pages && this.pages[id];
		if (!p) return null;
		delete this.pages[id];
		p.offline();
		return p;
	}
	/**
	 * 移除所有页面
	 */
	removeAllPages() {
		if (!this.pages) return;
		for (let id of Object.keys(this.pages)) {
			this.pages[id].offline();
		}
		this.pages = null;
	}
	/**
	 * 显示页面
	 * @param {string} id 页面id
	 * @param [params] 显示参数
	 * @param {boolean} [noPush] 不添加历史状态
	 */
	showPage(id, params, noPush) {
		let p = this.pages && this.pages[id], old = this.cpage;
		if (!p) {
			// 如果没有页面，则尝试自动创建
			if (!this.sheet) return;
			if (!register(id)) {
				console.error(`Page ${id} undefined.`); return;
			}
			p = cnew(id);
			this.addPage(p);
		}
		if (old) {
			old.hide();
			old.onHide(params);
		}
		this.cpage = p;
		p.show();
		p.onShow(params);
		if (!noPush && (!history.state || history.state.pid != p.pid)) {
			let url = urlParam(null, 'p', pid);
			history.pushState({pid:p.pid}, document.title + '-' + p.title, url);
		}
		this.dispatch('change', {
			oldPid: old && old.id(), pid: p.id()
		}, 0);
	}
}
Frame.register('frame');
