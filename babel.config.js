module.exports = api => {
    const isTest = api.env('test');
    return {
        presets: [
            [
                '@babel/preset-env', !isTest ? {
                    useBuiltIns: 'entry',
                    corejs: 3,
                }: {
                    targets: {node: 'current'}
                }
            ],
            '@vue/babel-preset-jsx'
        ],
    }

};
