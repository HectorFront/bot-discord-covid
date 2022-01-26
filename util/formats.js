class Formats {

    /**
     *
     * @param str
     * @returns {string}
     */
    static string(str) {
        return (str.normalize("NFD").replace(/[^a-zA-Zs]/g, "")).toLowerCase();
    }

    /**
     *
     * @param n
     * @returns {string}
     */
    static number(n) {
        return (Number(n)).toLocaleString('pt-BR');
    }
}

export default Formats;