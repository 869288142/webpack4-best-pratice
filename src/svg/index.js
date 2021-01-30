let req = require.context('./assets', false, /\.svg$/);

let requireAll = function (requireContext) {
    requireContext.keys().map(requireContext);
};

requireAll(req);
