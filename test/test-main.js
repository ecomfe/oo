require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/src',
    packages: [
        {
            name: 'eoo',
            location: '.'
        }
    ],

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});