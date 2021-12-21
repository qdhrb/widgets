/** 颜色 */
export default class Color {
	/**
	 * 构造函数
	 * @param {number} r red
	 * @param {number} g green
	 * @param {number} b blue
	 * @param {number} [a] alpha
	 */
	constructor(r, g, b, a = 1) {
		this.r = r; this.g = g; this.b = b; this.a = a;
	}
	/**
	 * 解析颜色字符串
	 * @param {String} str 字符串
	 * @returns {Color}
	 */
	static parse(str) {
		if (!str) return null;
		let m = str.match(this.rgxParse), n;
		if (!m) return null;
		let r, g, b, a = 1;
		if (m[1]) {
			n = parseInt(m[1], 16);
			r = n >> 16 & 0xff;
			g = n >> 8 & 0xff;
			b = n & 0xff;
		}else if (m[2]) {
			r = ((n = parseInt(m[2][0], 16)) << 4) + n;
			g = ((n = parseInt(m[2][1], 16)) << 4) + n;
			b = ((n = parseInt(m[2][2], 16)) << 4) + n;
		}else if (m[3]) {
			r = parseInt(m[3]);
			g = parseInt(m[4]);
			b = parseint(m[5]);
			m[6] && (a = parseFloat(m[6]));
		}
		return new Color(r, g, b, a);
	}
	/**
	 * 复制颜色
	 * @param {Color} from
	 */
	copy(from) {
		this.r = from.r;
		this.g = from.g;
		this.b = from.b;
		this.a = from.a;
	}
	/**
	 * 根据颜色范围，计算中间值
	 * @param {Color} c1 起始颜色
	 * @param {Color} c2 结束颜色
	 * @param {number} rate 比率，默认0.5
	 * @returns {this}
	 */
	mid(c1, c2, rate = 0.5) {
		this.r = c1.r + (c2.r - c1.r) * rate;
		this.g = c1.g + (c2.g - c1.g) * rate;
		this.b = c1.b + (c2.b - c1.b) * rate;
		this.a = c1.a + (c2.a - c1.a) * rate;
		return this;
	}
	/**
	 * 转换为rgb格式
	 * @returns {string}
	 */
	toRGB() {
		return `rgb(${this.r},${this.g},${this.b})`;
	}
	/**
	 * 转换为rgba格式
	 * @returns {string}
	 */
	toRGBA() {
		return `rgb(${this.r},${this.g},${this.b},${this.a})`;
	}
	/**
	 * 转换为#RRGGBB格式
	 * @returns {string}
	 */
	toHEX() {
		let s = ((this.r << 16) + (this.g << 8) + this.b).toString(16);
		return '#' + s.padStart(6, '0');
	}
	/**
	 * @override
	 * @returns {string}
	 */
	toString() {
		return this.toHEX();
	}
}
/**
 * 颜色解析：
 * 1: #rrggbb 格式
 * 2: #rgb
 * 3-6: rgb[a]的三或四个数值
 */
Color.rgxParse = /#([\da-f]{6})|#([\da-f]{3})|rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d?\.?\d*)?\)/;