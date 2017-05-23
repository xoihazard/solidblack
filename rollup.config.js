import nodeResolvePlugin from 'rollup-plugin-node-resolve'
import commonjsPlugin from 'rollup-plugin-commonjs'
import uglifyPlugin from 'rollup-plugin-uglify'

export default {
    entry: 'src/main.js',
    dest: 'public/bundle.js',
    format: 'iife',
    moduleName: 'xxx',
    plugins: [
        nodeResolvePlugin({
            jsnext: true
        }),
        commonjsPlugin(),
        uglifyPlugin()
    ]
}