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
    passwordRequirements: {
        minLength: 8,
        maxLength: undefined,
        lowercaseChars: 1,
        uppercaseChars: 1,
        numericChars: 1,
        specialChars: 1
    },
    useAppCache: false
};