/*!
 * Brackets PHP CodeSniffer 0.1.0
 * Lint PHP against coding standards using PHP CodeSniffer.
 *
 * @author Mikael Jorhult
 * @license http://mikaeljorhult.mit-license.org MIT
 */
define( function( require, exports, module ) {
	'use strict';
	
	// Get module dependencies.
	var CodeInspection = brackets.getModule( 'language/CodeInspection' ),
		DocumentManager = brackets.getModule( 'document/DocumentManager' ),
		ExtensionUtils = brackets.getModule( 'utils/ExtensionUtils' ),
		CommandRunner = require( 'modules/CommandRunner' ),
		Parsers = require( 'modules/Parsers' ),
		
		// Variables.
		basePath = ExtensionUtils.getModulePath( module, 'modules/vendor/' ).replace( ' ', '\\ ' ),
		paths = {
			phpcs: 'php ' + basePath + 'phpcs/phpcs.phar',
			phpmd: 'php ' + basePath + 'phpmd/phpmd.phar'
		};
	
	// Lint path and return found errors.
	function getErrors( fullPath ) {
		var filePath = fullPath.replace( new RegExp( ' ', 'g' ), '\\ ' ),
			phpcsCommand = paths.phpcs + ' ' + filePath,
			phpmdCommand = paths.phpmd + ' ' + filePath + ' text cleancode,codesize,controversial,design,naming,unusedcode';
		
		// Run command using Node.
		CommandRunner.run( phpcsCommand, Parsers.phpcs );
		CommandRunner.run( phpmdCommand, Parsers.phpmd );
	}
	
	// Run CodeInspection when a file is saved.
	$( DocumentManager ).on( 'documentSaved', function( event, fileEntry ) {
		getErrors( fileEntry.file.fullPath );
	} );
	
	// Register linting service.
	CodeInspection.register( 'php', {
		name: 'PHP CodeSniffer',
		scanFile: function() {
			return {
				errors: Parsers.errors().phpcs
			};
		}
	} );
	
	CodeInspection.register( 'php', {
		name: 'PHP Mess Detector',
		scanFile: function() {
			return {
				errors: Parsers.errors().phpmd
			};
		}
	} );
} );