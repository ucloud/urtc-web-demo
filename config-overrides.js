/* config-overrides.js */
const { override, addBabelPlugins,addDecoratorsLegacy } = require('customize-cra');

module.exports = override(
    ...addBabelPlugins([
        'import',
        {
            libraryName: '@ucloud-fe/react-components',
            camel2DashComponentName: false,
            libraryDirectory: 'lib/components'
        }
    ]),
    addDecoratorsLegacy()
);