// 默认promise-reject处理函数
window.addEventListener('unhandledrejection', event => {
	console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});