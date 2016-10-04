module.exports = {
    port: 8080,
    secretKey: 'i am a super secret key',
    countriesFile: {
        version: 0,
        path: '/path/to/countries/file'
    },
    mail: {
        from: 'sender info',
        options: {
            service: 'Gmail',
            auth: {
                user: 'username',
                pass: 'password'
            }
        }
    },
    useAppCache: false
};