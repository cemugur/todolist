/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ (() => {

var base_url = window.location.origin;
var csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); //sorting tasks 

var el = document.getElementById('todolist');
var csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var sortable = new Sortable(el, {
  onEnd: function onEnd(evt) {
    $.ajax({
      url: base_url + '/todo',
      type: 'PUT',
      dataType: 'json',
      data: {
        "_token": csrf,
        "oldIndex": evt.oldIndex,
        "newIndex": evt.newIndex
      },
      success: function success(id) {}
    });
  }
}); //toggle dark and light theme

$('#changeTheme').click(function () {
  $(this).toggleClass("moon sun");
  $('body').toggleClass("light dark");

  if ($(this).hasClass('sun')) {
    $(this).attr('src', base_url + '/imgs/icon-sun.svg');
  } else {
    $(this).attr('src', base_url + '/imgs/icon-moon.svg');
  }
});
$('#confirmoverlay').click(function () {
  $("#confirmbox").hide();
  $("#confirmoverlay").hide();
}); //creating new task

$(document).on("keypress", "input", function (e) {
  if (e.which == 13) {
    var task = $(this).val();

    if (task.length <= 3 || task.length >= 255) {
      var message = 'A task should be <br> <b>minimum 5, maximum 255</b><br> characters';
      Alert.render(message, 'alert');
    } else {
      $.ajax({
        url: base_url + '/todo',
        type: 'POST',
        dataType: 'json',
        data: {
          "_token": csrf,
          "task": task
        },
        success: function success(result) {
          var id = result.data.id;
          $('input').val('');
          var newTask = '<li class="undone" taskID="' + id + '"><div class="dot"><div class="checked"></div></div><div class="txt">' + task + '</div><img src="' + base_url + '/imgs/icon-cross.svg" alt="cross" class="del" draggable="false"></li>';
          $("ul.list").prepend(newTask);
          $('#counter').html($('.undone').length);
          var message = '<b>Task created successfuly :)</b>';
          Alert.render(message, 'alert');
          setTimeout(function () {
            $("#confirmbox").hide();
            $("#confirmoverlay").hide();
          }, 800);
        },
        error: function error(result) {
          var json = $.parseJSON(JSON.stringify(result));
          Alert.render(json.responseJSON.errors.task[0], 'alert');
        }
      });
    }
  }
}); // Todo list filters
//All, Active and Completed, 

$('.link').click(function () {
  $('.link').removeClass("active");
  $(this).addClass("active");
  var filterID = $(this).attr("filter");

  if (filterID == 'done') {
    $("ul.list li").filter('.done').show();
    $("ul.list li").filter('.undone').hide();
  } else if (filterID == 'undone') {
    $("ul.list li").filter('.undone').show();
    $("ul.list li").filter('.done').hide();
  } else {
    $("ul.list li").filter('.undone').show();
    $("ul.list li").filter('.done').show();
  }
}); //Task marked and unmarked functions ////////////
// Showing alert before process

$('body').on('click', '.dot, .del, .all', function () {
  var methodType = "DELETE";

  if ($(this).hasClass('all')) {
    //remove all completed tasks from the list
    $('#confirmbox').attr("taskID", 'all'); //task id saving for the next function

    $('#confirmbox').attr("method", "DELETE"); //determine what will do with the task

    var message = ' <b>Are you sure to remove all completed tasks?</b>';
    Alert.render(message, 'confirm', 'all');
  } else {
    var taskID = $(this).parent("li").attr("taskID");

    if ($(this).hasClass('dot')) {
      //Checked or unchecked task
      var status = $(this).parent("li").attr("class");
      var task = $(this).next().text();
      var message = '"' + task + '" <br><br> <b>Will be marked as done?</b>';

      if (status == "done") {
        var message = '"' + task + '" <br><br> <b>Will be marked as NOT done?</b>';
      }

      methodType = "PATCH";
    } else if ($(this).hasClass('del')) {
      //remove the task from the list
      var status = $(this).parent("li").attr("class");
      var task = $(this).prev().text();
      var message = '"' + task + '" <br><br> <b>Do you want to DELETE?</b>';
    }
  } //task id and method saving for the next function


  $('#confirmbox').attr("taskID", taskID).attr("method", methodType);
  Alert.render(message, 'confirm');
});
$('.alert-no').click(function () {
  Alert.no();
});
$('.alert-ok').click(function () {
  Alert.ok();
});

function CustomAlert() {
  this.render = function () {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var alertType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'confirm';
    $(".confirmboxbody").html(message); //message adding to alert box
    //Getting screen values and arranging alert box width and position 

    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var left = winW > 500 ? winW / 2 - 200 + "px" : left = winW * 0.05 + "px";
    $("#confirmbox").css({
      "display": "block",
      "left": left,
      "top": "100px"
    });
    $("#confirmoverlay").css({
      "display": "block",
      "height": winH + "px"
    }); //adding button according to alert type confirm or alert

    if (alertType == 'confirm') {
      $(".confirm").show();
      $(".alert").hide();
    } else {
      $(".confirm").hide();
      $(".alert").show();
    }
  };

  this.ok = function () {
    $("#confirmbox").hide();
    $("#confirmoverlay").hide();
    var taskID = $('#confirmbox').attr("taskID");
    var methodType = $('#confirmbox').attr("method");
    var csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    $.ajax({
      url: base_url + '/todo/' + taskID,
      type: methodType,
      dataType: 'json',
      data: {
        "_token": csrf
      },
      success: function success(data) {
        if (methodType == 'DELETE') {
          if (taskID == 'all') {
            $('.done').remove();
          } else {
            $("li[taskID='" + taskID + "']").remove();
          }
        } else {
          $("li[taskID='" + taskID + "']").toggleClass("undone done");
        }

        $('#counter').html($('.undone').length);
        var filterID = $('.link.active').attr("filter");

        if (filterID == 'done') {
          $("ul.list li").filter('.done').show();
          $("ul.list li").filter('.undone').hide();
        } else if (filterID == 'undone') {
          $("ul.list li").filter('.done').hide();
          $("ul.list li").filter('.undone').show();
        } else {
          $("ul.list li").filter('.done').show();
          $("ul.list li").filter('.undone').show();
        }
      },
      error: function error(result) {
        var json = $.parseJSON(JSON.stringify(result));
        Alert.render(json.responseJSON.errors, 'alert');
      }
    });
  };

  this.no = function () {
    $("#confirmbox").hide();
    $("#confirmoverlay").hide();
  };
}

var Alert = new CustomAlert();

/***/ }),

/***/ "./resources/css/responsive.scss":
/*!***************************************!*\
  !*** ./resources/css/responsive.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/responsive.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/css/app.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;