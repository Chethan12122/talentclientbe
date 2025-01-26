class StringUtils {

    static isEmpty(str: string) {
        return str === undefined || str === null || str.trim().length === 0 || str.length === 0;
    }
}

module.exports = StringUtils