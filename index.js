var extend = require('extend'),
	path = require('path'),
	fs = require('fs'),
    insert = require('gulp-insert'),
    gutil = require('gulp-util'),
    through = require('through2');

var PLUGIN_NAME = 'gulp-ng2-template-wrap';

var defaults = {
	baseDir: 'app',
	templatesModulePath: 'templates.js',
	templateIdDelimiter: '.'
}

module.exports = exports = function templateWrap(options){

	var opts = extend({}, defaults, (options || {}));
	var templatesFile = path.resolve(opts.baseDir, opts.templatesModulePath);

	return processScripts().on('finish', templatesModulePostProcessing)

	function processScripts(){
		templatesModulePreProcessing();
		
		return through.obj(function(file, encoding, callback) {
			if (file.isNull()) {
		      cb(null, file);
		      return;
		    }

		    if (file.isStream()) {
		      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		      return;
		    }

			callback(null,processFile(file));
		});
	}	

	function templatesModulePreProcessing(){
		fs.writeFileSync(templatesFile, '');
		fs.appendFile(templatesFile, getModuleConfigStart());
	}

	function templatesModulePostProcessing(){
		fs.appendFile(templatesFile, getModuleConfigEnd());
	}

	function processFile(file){
		var template = file.contents;
		var filePath = file.path;
		var baseDir = opts.baseDir;

		var rawPath = filePath.substring(filePath.indexOf(baseDir) + baseDir.length + 1, filePath.indexOf(path.extname(filePath)));
		var pathWithoutDelimiters = rawPath.split(path.sep).join(opts.templateIdDelimiter);
		fs.appendFile(templatesFile, getModuleExportString(pathWithoutDelimiters, '\`' + template + '\`'));
	}


	function getModuleConfigStart(){
		return "var templates = { \n";
	}

	function getModuleConfigEnd(){
		return  "}" + 
				"\n" + 
				"export function getTemplate(id){return templates[id];}";
	}

	function getModuleExportString(filePath, content){
		return "\'" + filePath + "\' : " + content + ',\n';
	}

}