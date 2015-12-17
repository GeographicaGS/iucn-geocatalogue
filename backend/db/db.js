function init(callback){
    module.exports.BaseModel = new (require('./basemodel.js'));
    module.exports.UserModel = new (require('./usermodel.js'));
    module.exports.ApplyModel = new (require('./applymodel.js'));
    module.exports.LayerModel = new (require('./layermodel.js'));
    module.exports.IndicatorModel = new (require('./indicatormodel.js'));
    module.exports.ProgramModel = new (require('./programmodel.js'));
    module.exports.TownModel = new (require('./townmodel.js'));
    callback();
}

module.exports.init = init
