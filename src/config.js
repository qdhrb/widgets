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
export function getConfig(name, dft) {
	return _config.hasOwnProperty(name) ? _config[name] : arguments.length >= 2 ? dft : null;
}
/**
 * 设置配置项
 * @param {String} name 配置项
 * @param {*} v 值
 */
export function setConfig(name, v) {
	(arguments.length >= 2) && (_config[name] = v);
}