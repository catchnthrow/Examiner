var utils = {
    handleComponentsCallback : function(err, data, callback){
        if(err != null){
            callback(err, null);
        } else {
            if(null != data && data != undefined){
              callback(null, data);
            } else {
                callback({message: "Error!!!"}, null);
            }
        }
    }
}

module.exports = utils;