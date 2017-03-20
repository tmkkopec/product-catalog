'use strict';

(function(angular) {
  angular.module("main.controllers", ['ngFileUpload', 'ngFileSaver']);
  angular.module("main.services", []);
  angular.module("main.directives", []);
  angular.module("main", [
    "main.controllers",
    "main.services",
    "main.directives"
    ])
}(angular));