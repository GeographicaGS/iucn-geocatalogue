var deps = {};

deps.templateFolder = 'js/template';

deps.JS = [
    'js/lib/jquery-2.1.4.js',
    'js/lib/jquery-ui.js',
    'js/lib/underscore-1.8.3.js',
    'js/lib/mustache.min.js',
    'js/lib/backbone-1.2.0.js',
    'js/lib/sprintf.js',
    'js/lib/fixedsticky.js',
    'js/lib/leaflet/google.js',
    'js/lib/leaflet/leaflet.markercluster-src.js',


    // Namespace
    'js/Namespace.js',
    'js/Config.js',
    "js/md5.js",
    "js/Map.js",
   
    
    // --------------------
    // ------  Views ------
    // --------------------
    'js/View/ErrorView.js',
    'js/View/NotFoundView.js',
    'js/View/MapView.js',
    'js/View/LoginView.js',
    'js/View/ApplyListView.js',
    'js/View/ApplyView.js',
    'js/View/ApplyBasicInformationView.js',
    'js/View/ApplyInterventionView.js',
    'js/View/ApplyImportView.js',
    'js/View/ApplyExecutionView.js',
    'js/View/ApplyIncidenceView.js',
    'js/View/IndicatorListView.js',
    'js/View/IndicatorView.js',
    'js/View/UserListView.js',
    'js/View/UserView.js',
    'js/View/ProgramView.js',
    

    // --------------------
    // ------  Models ------
    // --------------------
    'js/model/ApplyModel.js',
    'js/model/ApplyIncidenceModel.js',
    'js/model/IndicatorModel.js',
    'js/model/UserModel.js',

    // --------------------
    // ------  Collections ------
    // --------------------
    'js/collection/ApplyCollection.js',
    'js/collection/ApplyGeomCollection.js',
    'js/collection/ApplyIncidenceCollection.js',
    'js/collection/IndicatorCollection.js',
    'js/collection/UserCollection.js',
    'js/collection/ProgramCollection.js',
    'js/collection/TownGeomCollection.js',
    
    // router
    'js/Router.js',
    // app
    'js/App.js'
];



deps.lessFile = 'css/styles.less';

if (typeof exports !== 'undefined') {
    exports.deps = deps;
}