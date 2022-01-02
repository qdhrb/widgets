import {} from './global/types';
import {} from './global/unhandled';
import { i2a, isFunc, isStr, isNum, isPlainObject, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId } from './utils/utils';
import { urlParam, request, load, post, loadScripts } from './utils/http';

import Widget from './widget';

// export object
const app = {
	i2a, isFunc, isStr, isNum, isPlainObject, rand, fix, split, clone, walkAT, findAT, getItem, setItem, nextId, lastId,
	urlParam, request, load, post, loadScripts,

	Widget
};
export default app;