import {name, version, author} from './package.json';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const fname = 'widgets';
const key = 'wgs';
const banner =
'/*!\r\n' +
' * ' + name + '\r\n' +
' * @Version ' + version + '\r\n' +
' * @Author ' + author + '\r\n' +
'*/';

export default {
	input: './src/index.js',
	output: [{
		banner:banner,
		file: './dist/' + fname + '-' + version + '.js',
		format: 'iife',
		name: key,
		preferConst:true
	},{
		banner:banner,
		file: './dist/' + fname + '-' + version + '.min.js',
		format: 'iife',
		name: key,
		preferConst:true,
		plugins:[terser()]
	}],
	plugins: [
		replace({
			preventAssignment: true,
			delimiters: ['', ''],
			__CSS: key,
			__EVENT: key,
			__CNEW: true
		})
	]
}