/**
 * Adds a difficulty property to each item of the country array.
 * If the item lacks any necessary properties to classify it, the country's difficulty property will be 'unassigned'.
 */
var classifiyCountries = function(countries) {
    if (!countries) {
        return;
    }

    countries.forEach(function(country) {
        country.difficulty = getDifficultyForCountry(country);
    });

    return countries;
};

var getDifficultyForCountry = function(country) {
    if (country.subregion.indexOf('Europe') >= 0 ||
        country.subregion.indexOf('Australia and New Zealand') >= 0 ||
        (country.subregion.indexOf('South America') >= 0 && country.population >= 25000000) ||
        country.subregion.indexOf('Northern America') >= 0 ||
        (country.subregion.indexOf('Central America') >= 0 && country.population >= 100000000) ||
        (country.subregion.indexOf('Africa') >= 0 && country.population >= 100000000) ||
        (country.subregion.indexOf('Asia') >= 0 && country.population >= 500000000) ||
        country.name === 'Türkei') {
        // easy
        return 'easy';
    } else if ((country.subregion.indexOf('Africa') >= 0 && country.population >= 15000000) ||
        (country.subregion.indexOf('Asia') >= 0 && country.population >= 10000000)  ||
        (country.subregion.indexOf('South America') >= 0 && country.population >= 1000000) ||
        (country.subregion.indexOf('Central America') >= 0 && country.population >= 10000000) ||
        (country.subregion.indexOf('Caribbean') >= 0 && country.population >= 1000000) ||
        ['Tunesien', 'Aserbaidschan', 'Vereinigte Arabische Emirate', 'Georgien', 'Armenien'].indexOf(country.name) >= 0) {
        // medium
        return 'medium';
    } else if ((country.subregion.indexOf('South America') >= 0 && country.population < 1000000) ||
        (country.subregion.indexOf('Africa') >= 0 && country.population < 15000000) ||
        (country.subregion.indexOf('Asia') >= 0 && country.population < 10000000) ||
        (country.subregion.indexOf('Central America') >= 0 && country.population < 10000000) ||
        (country.subregion.indexOf('Caribbean') >= 0 && country.population < 1000000) ||
        (country.region.indexOf('Oceania') >= 0 && country.subregion !== 'Australia and New Zealand')) {
        // hard
        return 'hard';
    } else {
        // unassigned
        return 'unassigned';
    }
};

module.exports = {
    classifiyCountries: classifiyCountries,
    getDifficultyForCOuntry: getDifficultyForCountry
};