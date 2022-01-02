import Widget from "../widget";

/** Page */
export default class Page extends Widget {
	/** 构造函数 */
	constructor() {
		super('div', '__CSS-page');
	}
	/**
	 * 初始化
	 * @override
	 */
	onInit() {
	}
	/**
	 * 页面显示
	 * @param [params] 页面显示时的参数
	 * @override
	 */
	onShow(params) {
	}
	/**
	 * 页面隐藏
	 * @param [params] 页面显示时的参数
	 * @override
	 */
	onHide(params) {
	}
}
// 注册：默认页面
Page.register('page');