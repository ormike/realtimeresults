const path = require('path');

module.exports = {
    entry: [
        './src/index.js',
        './src/index.scss',
        './src/index.html',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    // 'development': original javascript files appear in browser dev tools for debug
    // 'production': javascript is minimized and obfuscated
    mode: 'development',

    // Handle the other things besides javascript
    module: {
        rules: [
            // Process .scss files into .css and copy into the output folder
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: 'css/', name: '[name].css' }
                    },
                    'sass-loader'
                ]
            },
            // Copy other assets to the output folder
            {
                test: /\.(png|jpe?g|gif|html)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: '[name].[ext]' },
                    },
                ],
            },
        ]
    },
};
