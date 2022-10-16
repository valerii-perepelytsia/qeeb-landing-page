const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";
const filename = (extension) => !devMode ? `[name].${extension}` : `[contenthash].${extension}`;

module.exports = {
    mode: devMode ? 'development' : 'production',
    target: devMode ? 'web' : 'browserslist',
    devtool: devMode ? 'source-map' : undefined,
    devServer: {
        historyApiFallback: true,
        static: path.resolve(__dirname, './src'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    context: path.resolve(__dirname, 'src'),
    entry: './js/index.js',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ]
    },
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './index.html',
                filename: `./index.html`
            }
        ),
        new MiniCssExtractPlugin(
            {
                filename: `./styles/${filename('css')}`
        },
    )
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
                generator: {
                    filename: 'img/[name][ext]'
                },
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ],
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.mp4$/,
                generator: {
                    filename: 'videos/[name][ext]'
                }
            }
        ],
    },
};