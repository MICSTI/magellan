module.exports = {
    port: 8080,
    secretKey: 'i am a super secret key',
    useHttps: true,
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
    oauth: {
        facebook: {
            api_key: 'FACEBOOK_APP_ID',
            api_secret: 'FACEBOOK_API_SECRET',
            callback_url: 'FACEBOOK_CALLBACK_URL'
        },
        google: {
            api_key: 'GOOGLE_APP_ID',
            api_secret: 'GOOGLE_API_SECRET',
            callback_url: 'GOOGLE_CALLBACK_URL'
        }
    },
    colors: [
        'soft_red',
        'thunderbird',
        'old_brick',
        'new_york_pink',
        'snuff',
        'honey_flower',
        'san_marino',
        'shakespeare',
        'ming',
        'gossip',
        'eucalyptus',
        'mountain_meadow',
        'jade',
        'confetti',
        'california',
        'burnt_orange',
        'jaffa',
        'gallery',
        'edward',
        'lynch'
    ]
};