class error {
    constructor(code, message, type, suggestion, helpURL){
        this.code = code;
        this.message = message;
        this.type = type;
        if(suggestion){
            this.suggestion = suggestion;
        }

        if(helpURL){
            this.helpURL = helpURL;
        }
    }
}


module.exports = error;