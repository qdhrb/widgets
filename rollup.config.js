import {name, version, author} from './package.json';
import replace from '@rollup/plugin-replace';

const key = 'widgets';
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
		file: './dist/' + key + '-' + version + '.js',
		format: 'iife',
		name: key,
		preferConst:true
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