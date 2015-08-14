!function(){"use strict";angular.module("yoPouchSyncApp",["ngCookies","ngResource","ngSanitize","ui.router","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){b.otherwise("/"),c.html5Mode(!0)}])}(),function(){"use strict";angular.module("yoPouchSyncApp").controller("AboutCtrl",["$scope",function(a){}])}(),angular.module("yoPouchSyncApp").config(["$stateProvider",function(a){a.state("about",{url:"/about",templateUrl:"app/about/about.html",controller:"AboutCtrl"})}]),function(){"use strict";angular.module("yoPouchSyncApp").controller("HomeCtrl",["$scope","pouchWrapper",function(a,b){a.grocery=b.data,a.submit=function(){if(console.log("submit: text='"+a.text+"'"),""!==a.text)var c={type:"grocery",text:a.text};b.add(c).then(function(b){a.text=""})["catch"](function(a){console.log(a)})},a.remove=function(a){b.remove(a)["catch"](function(a){console.log(a)})},a.update=function(a){b.update(a)["catch"](function(a){console.log("Problem updating database: ",a)})}}])}(),angular.module("yoPouchSyncApp").config(["$stateProvider",function(a){a.state("home",{url:"/",templateUrl:"app/home/home.html",controller:"HomeCtrl"})}]),function(){"use strict";angular.module("yoPouchSyncApp").factory("myPouchDB",function(){var a=new PouchDB("grocery-list",{auto_compaction:!0});return a.sync("https://quickstartprototypes.cloudant.com/my-sdce",{live:!0}),a})}(),function(){"use strict";angular.module("yoPouchSyncApp").factory("pouchWrapper",["$rootScope","myPouchDB","$q",function(a,b,c){function d(b){a.$apply(function(){return c.when(b)})}function e(b){a.$apply(function(){return c.reject(b)})}function f(c){if(console.log("handleUpdate: change=",c),c.deleted){for(var d=0;d<j.length;++d)if(j[d]._id===c.id){a.$apply(function(){j.splice(d,1)});break}}else b.get(c.id).then(function(b){for(var d=0;d<j.length;++d)if(j[d]._id===c.id){a.$apply(function(){j.splice(d,1),j.push(b)});break}d==j.length&&a.$apply(function(){j.push(b)})})["catch"](function(a){console.log("Error getting doc while handling a change: ",a)})}function g(a){return console.log("addPouch: doc=",a),b.post(a).then(d)["catch"](e)}function h(a){return console.log("removePouch: id=",a._id),b.get(a._id).then(function(a){return b.remove(a).then(d)["catch"](e)})["catch"](e)}function i(a){return console.log("updatePouch: id=",a._id),b.get(a._id).then(function(c){return b.put(a,a._id,c._rev).then(d)["catch"](e)})["catch"](e)}var j=[];return b.changes({live:!0}).on("change",f),{data:j,add:g,remove:h,update:i}}])}(),angular.module("yoPouchSyncApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("yoPouchSyncApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menu=[{title:"Home",link:"/"},{title:"About",link:"/about"}],a.isCollapsed=!0,a.isActive=function(a){return a===b.path()}}]),angular.module("yoPouchSyncApp").run(["$templateCache",function(a){"use strict";a.put("app/about/about.html","<div class=col-md-12><h1>Pouch DB Sync</h1><h2>Problems</h2><ol><li>Without a database, your data is not persistent</li><li>If you store data in remote database to get persistance; but you can't do anything if the network goes down.</li><li>If you store the data in local storage, to get persistance, and can work without a network; but you have multiple copies of your database on each browser, on each computer, or device which accesses the data</li></ol><h2>Solution</h2><ol><li>Pouch DB allows you to organize and store your data in local storage for persistance, and the ability to work offline, on devices or different browsers/computers.</li><li>Couch DB (using Cloudant for free server space), allows for a network accessible common database for syncing all devices/browsers/computers</li><li>This program uses the automatic syncing capabilities of Pouch DB, and Couch DB to allow synchronization of multiple databases across multiple devices/browsers/computers to come in sync when they are connected together on the network.</li></ol><h2>What it does</h2><p>Couch DB (on Cloudant), acts as a central repository for your shared data. A pouch DB instance on each web-page, allows local storage of data on each browser/computer/device, if you aren't connected to the Couch DB database on the network. The next time you are connected to the Couch DB database on the network, the software will automatically sync the databases, so they are consistent.</p><p>So, for instance, suppose you had an instance of this application open on Chrome, another on Firefox, and another version on a mobile device, as well as a central repository on Couch DB (Cloudant). If all of the versions were connected to the network to the Couch DB database, each instance of the program would have an exact copy of the Couch DB database stored in the local Pouch DB database in local storage. If you were to add a record on the Chrome instance of the app, it would update the local storage Pouch DB database. This would trigger an automatic sync with the Couch DB database on the network, and this would then trigger automatic updates on the instances running on Firefox, as well as the mobile device. Since, this program is using Angular JS; which already supports two way data binding, this is an example of six way data binding.</p><ul><li>Two Way data binding - HTML View and $scope in angular is kept in sync</li><li>Three Way data binding - Above, plus kept in sync with local Chrome Pouch DB</li><li>Four Way data binding - Above, plus kept in sync with remote Couch DB (Cloudant)</li><li>Five Way data binding - Above, plus kept in sync with Firefox Pouch DB local storage</li><li>Six Way data binding - Above, plus kept in sync with an Android App Pouch DB instance</li></ul><p>If the network is not available to your mobile device, the local pouch DB database allows you to modify a local copy of the database. Then, when your device is reconnected to the network (couch DB database), it will automatically sync the databases, and these changes will be distributed to all of the other instances that are online.</p></div>"),a.put("app/home/home.html",'<div class=col-md-12><h1>Grocery List</h1><input placeholder="What do you need from the grocery store" ng-model=text ng-keyup="$event.keyCode == 13 ? submit() : null"><br><br><table ng-show="grocery.length>0"><thead><tr><th>Grocery Item</th><th>&nbsp;&nbsp;&nbsp;</th><th>Delete</th><th>&nbsp;&nbsp;&nbsp;</th><th>Update</th></tr></thead><tbody><tr ng-repeat="item in grocery" ng-cloak><td><input ng-model=item.text></td><td></td><td><button ng-click=remove(item)>Delete</button></td><td></td><td><button ng-click=update(item)>Update</button></td></tr></tbody></table></div>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>yo-pouch-sync</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>')}]);