module.exports = function(context) {
	const targetName = context.cache(() => process.env.BUNDLE_ENV)

	const isCommonJS = targetName == 'cjs'

	const targets = {
		'cjs': {node: 6},
		'es': {
			browsers: ['ie >= 11']
		}
	}

	return {
		presets: [
			['env', {
				targets: targets[targetName],
				modules: isCommonJS ? 'commonjs' : false,
				loose: isCommonJS ? false : true,
			}]
		],
		plugins: [
			"transform-object-rest-spread",
			"transform-pipeline-operator",
		]
	}
}
