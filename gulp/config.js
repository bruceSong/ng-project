/**
 *  项目基本配置
 */

exports.path = {
	src: './src', // 开发目录
	build: './build', // 发布目录

	// 提供给webpack打包用的入口文件
	// 若新增一个页面，需添加一条入口配置，原则上异步加载
	js: {
		index: ['./src/page/index/controller.js'],
		// 二级路由入口文件chunk名必须是一级路由加二级路由，遵循驼峰命名规范
		index_dialog: ['./src/page/index/dialog/controller.js']
	}
};