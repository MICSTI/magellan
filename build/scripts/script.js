var magellan=angular.module("magellan",["ui.router"],["$httpProvider",function(t){t.interceptors.push("AuthInterceptor")}]);magellan.controller("AppCtrl",["$scope","$state","UserSrv",function(t,e,o){t.app={config:{title:"Magellan",subtitle:"Test your knowledge about the countries of our world",author:"Michael Stifter"}},o.getUserFromStorage().then(function(e){t.user=e})["catch"](function(t){console.error(t)}),t.$on("app.login",function(o,n){t.user=n,e.go("quiz")}),t.$on("app.logout",function(o,n){t.user=null,e.go("home")})}]),angular.module("magellan").factory("AuthTokenSrv",["$window",function(t){var e=t.sessionStorage,o="auth-token",n=function(){return e.getItem(o)},r=function(t){t?e.setItem(o,t):e.removeItem(o)};return{getToken:n,setToken:r}}]),angular.module("magellan").factory("AuthInterceptor",["AuthTokenSrv",function(t){var e=function(e){var o=t.getToken();return o&&(e.headers=e.headers||{},e.headers["X-Auth"]=o),e};return{request:e}}]),angular.module("magellan").controller("DropdownCtrl",["$scope",function(t){function e(){u=!u}function o(){u=!0}function n(){u=!1}function r(){return u}var u=!1;t.toggleDropdown=e,t.showDropdown=o,t.hideDropdown=n,t.isDropdownVisible=r}]),angular.module("magellan").factory("FocusSrv",["$timeout","$window",function(t,e){return function(o){t(function(){var t=e.document.getElementById(o);t&&t.focus()})}}]),angular.module("magellan").controller("LoginCtrl",["$scope","UserSrv","FocusSrv",function(t,e,o){t.login=function(o,n){e.login(o,n).then(function(e){t.$emit("app.login",e.data)})["catch"](function(t){console.error(t)})},o("username")}]),angular.module("magellan").controller("LogoutCtrl",["$scope","UserSrv",function(t,e){e.logout().then(function(){t.$emit("app.logout")})}]),angular.module("magellan").config(["$locationProvider","$stateProvider","$urlRouterProvider",function(t,e,o){t.html5Mode(!0),o.otherwise("/home"),e.state("home",{url:"/home",templateUrl:"/build/views/home.partial.html"}).state("quiz",{url:"/quiz",templateUrl:"/build/views/quiz.partial.html"}).state("login",{url:"/login",templateUrl:"/build/views/login.partial.html"}).state("logout",{url:"/logout",controller:"LogoutCtrl"}).state("register",{url:"/register",templateUrl:"/build/views/register.partial.html"}).state("about",{url:"/about",templateUrl:"/build/views/about.partial.html"})}]),angular.module("magellan").factory("UserSrv",["$http","AuthTokenSrv",function(t,e){var o=this,n=function(){return t.get("/api/user")},r=function(){return new Promise(function(t,o){var r=e.getToken();r?(e.setToken(r),n().then(function(e){t(e.data)})["catch"](function(t){o(t)})):o("No token in storage")})},u=function(r,u){return t.post("/api/session",{username:r,password:u}).then(function(t){return o.token=t.data,e.setToken(o.token),n()})},l=function(){return new Promise(function(t,n){o.token=null,e.setToken(),t()})};return{getUser:n,getUserFromStorage:r,login:u,logout:l}}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNjcmlwdC5qcyIsImF1dGgtdG9rZW4uc2VydmljZS5qcyIsImF1dGguaW50ZXJjZXB0b3IuanMiLCJkcm9wZG93bi5jdHJsLmpzIiwiZm9jdXMuc2VydmljZS5qcyIsImxvZ2luLmN0cmwuanMiLCJsb2dvdXQuY3RybC5qcyIsInJvdXRlcy5qcyIsInVzZXIuc2VydmljZS5qcyJdLCJuYW1lcyI6WyJtYWdlbGxhbiIsImFuZ3VsYXIiLCJtb2R1bGUiLCIkaHR0cFByb3ZpZGVyIiwiaW50ZXJjZXB0b3JzIiwicHVzaCIsImNvbnRyb2xsZXIiLCIkc2NvcGUiLCIkc3RhdGUiLCJVc2VyU3J2IiwiYXBwIiwiY29uZmlnIiwidGl0bGUiLCJzdWJ0aXRsZSIsImF1dGhvciIsImdldFVzZXJGcm9tU3RvcmFnZSIsInRoZW4iLCJ1c2VyIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwiJG9uIiwiZXZlbnQiLCJkYXRhIiwiZ28iLCJmYWN0b3J5IiwiJHdpbmRvdyIsInN0b3JlIiwic2Vzc2lvblN0b3JhZ2UiLCJrZXkiLCJnZXRUb2tlbiIsImdldEl0ZW0iLCJzZXRUb2tlbiIsInRva2VuIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJBdXRoVG9rZW5TcnYiLCJhZGRUb2tlbiIsImhlYWRlcnMiLCJyZXF1ZXN0IiwidG9nZ2xlRHJvcGRvd24iLCJ2aXNpYmxlIiwic2hvd0Ryb3Bkb3duIiwiaGlkZURyb3Bkb3duIiwiaXNEcm9wZG93blZpc2libGUiLCIkdGltZW91dCIsImlkIiwiZWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJmb2N1cyIsIkZvY3VzU3J2IiwibG9naW4iLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwicmVzcG9uc2UiLCIkZW1pdCIsImxvZ291dCIsIiRsb2NhdGlvblByb3ZpZGVyIiwiJHN0YXRlUHJvdmlkZXIiLCIkdXJsUm91dGVyUHJvdmlkZXIiLCJodG1sNU1vZGUiLCJvdGhlcndpc2UiLCJzdGF0ZSIsInVybCIsInRlbXBsYXRlVXJsIiwiJGh0dHAiLCJzZWxmIiwidGhpcyIsImdldFVzZXIiLCJnZXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInBvc3QiXSwibWFwcGluZ3MiOiJBQUFBLEdBQUFBLFVBQUFDLFFBQUFDLE9BQUEsWUFDQSxjQ0NJLGdCREFKLFNBQUFDLEdBQ0FBLEVBQUFDLGFBQUFDLEtBQUEscUJBR0FMLFVBQUFNLFdBQUEsV0FBQSxTQUFBLFNBQUEsVUFBQSxTQUFBQyxFQUFBQyxFQUFBQyxHQUVBRixFQUFBRyxLQUNBQyxRQUNBQyxNQUFBLFdBQ0FDLFNBQUEsdURBQ0FDLE9BQUEsb0JBS0FMLEVBQUFNLHFCQUNBQyxLQUFBLFNBQUFDLEdBRUFWLEVBQUFVLEtBQUFBLElBSEFSLFNBS0EsU0FBQVMsR0FDQUMsUUFBQUMsTUFBQUYsS0FJQVgsRUFBQWMsSUFBQSxZQUFBLFNBQUFDLEVBQUFDLEdBRUFoQixFQUFBVSxLQUFBTSxFQUdBZixFQUFBZ0IsR0FBQSxVQUdBakIsRUFBQWMsSUFBQSxhQUFBLFNBQUFDLEVBQUFDLEdBRUFoQixFQUFBVSxLQUFBLEtBR0FULEVBQUFnQixHQUFBLGFFdENBdkIsUUFDQUMsT0FBQSxZQUNBdUIsUUFBQSxnQkFBQSxVQUFBLFNBQUFDLEdBQ0EsR0FBQUMsR0FBQUQsRUFBQUUsZUFDQUMsRUFBQSxhQUVBQyxFQUFBLFdBQ0EsTUFBQUgsR0FBQUksUUFBQUYsSUFHQUcsRUFBQSxTQUFBQyxHQUNBQSxFQUNBTixFQUFBTyxRQUFBTCxFQUFBSSxHQUVBTixFQUFBUSxXQUFBTixHQUlBLFFBQ0FDLFNBQUFBLEVBQ0FFLFNBQUFBLE1DcEJBL0IsUUFDQUMsT0FBQSxZQUNBdUIsUUFBQSxtQkFBQSxlQUFBLFNBQUFXLEdBQ0EsR0FBQUMsR0FBQSxTQUFBMUIsR0FDQSxHQUFBc0IsR0FBQUcsRUFBQU4sVUFPQSxPQUxBRyxLQUNBdEIsRUFBQTJCLFFBQUEzQixFQUFBMkIsWUFDQTNCLEVBQUEyQixRQUFBLFVBQUFMLEdBR0F0QixFQUdBLFFBQ0E0QixRQUFBRixNQ2ZBcEMsUUFDQUMsT0FBQSxZQUNBSSxXQUFBLGdCQUFBLFNBQUEsU0FBQUMsR0FRQSxRQUFBaUMsS0FDQUMsR0FBQUEsRUFHQSxRQUFBQyxLQUNBRCxHQUFBLEVBR0EsUUFBQUUsS0FDQUYsR0FBQSxFQUdBLFFBQUFHLEtBQ0EsTUFBQUgsR0FwQkEsR0FBQUEsSUFBQSxDQUVBbEMsR0FBQWlDLGVBQUFBLEVBQ0FqQyxFQUFBbUMsYUFBQUEsRUFDQW5DLEVBQUFvQyxhQUFBQSxFQUNBcEMsRUFBQXFDLGtCQUFBQSxLQ1JBM0MsUUFDQUMsT0FBQSxZQUNBdUIsUUFBQSxZQUFBLFdBQUEsVUFBQSxTQUFBb0IsRUFBQW5CLEdBQ0EsTUFBQSxVQUFBb0IsR0FLQUQsRUFBQSxXQUNBLEdBQUFFLEdBQUFyQixFQUFBc0IsU0FBQUMsZUFBQUgsRUFFQUMsSUFDQUEsRUFBQUcsY0NaQWpELFFBQ0FDLE9BQUEsWUFDQUksV0FBQSxhQUFBLFNBQUEsVUFBQSxXQUFBLFNBQUFDLEVBQUFFLEVBQUEwQyxHQUNBNUMsRUFBQTZDLE1BQUEsU0FBQUMsRUFBQUMsR0FDQTdDLEVBQUEyQyxNQUFBQyxFQUFBQyxHQUNBdEMsS0FBQSxTQUFBdUMsR0FFQWhELEVBQUFpRCxNQUFBLFlBQUFELEVBQUFoQyxRQUhBZCxTQUtBLFNBQUFTLEdBQ0FDLFFBQUFDLE1BQUFGLE1BT0FpQyxFQUFBLGVDakJBbEQsUUFDQUMsT0FBQSxZQUNBSSxXQUFBLGNBQUEsU0FBQSxVQUFBLFNBQUFDLEVBQUFFLEdBQ0FBLEVBQUFnRCxTQUNBekMsS0FBQSxXQUVBVCxFQUFBaUQsTUFBQSxtQkNSQXZELFFBQUFDLE9BQUEsWUFDQVMsUUFBQSxvQkFBQSxpQkFBQSxxQkFBQSxTQUFBK0MsRUFBQUMsRUFBQUMsR0FFQUYsRUFBQUcsV0FBQSxHQUVBRCxFQUFBRSxVQUFBLFNBRUFILEVBQ0FJLE1BQUEsUUFDQUMsSUFBQSxRQUNBQyxZQUFBLG1DQUVBRixNQUFBLFFBQ0FDLElBQUEsUUFDQUMsWUFBQSxtQ0FFQUYsTUFBQSxTQUNBQyxJQUFBLFNBQ0FDLFlBQUEsb0NBRUFGLE1BQUEsVUFDQUMsSUFBQSxVQUNBMUQsV0FBQSxlQUVBeUQsTUFBQSxZQUNBQyxJQUFBLFlBQ0FDLFlBQUEsdUNBRUFGLE1BQUEsU0FDQUMsSUFBQSxTQUNBQyxZQUFBLHVDQzVCQWhFLFFBQ0FDLE9BQUEsWUFDQXVCLFFBQUEsV0FBQSxRQUFBLGVBQUEsU0FBQXlDLEVBQUE5QixHQUNBLEdBQUErQixHQUFBQyxLQUVBQyxFQUFBLFdBQ0EsTUFBQUgsR0FBQUksSUFBQSxjQUdBdkQsRUFBQSxXQUNBLE1BQUEsSUFBQXdELFNBQUEsU0FBQUMsRUFBQUMsR0FDQSxHQUFBeEMsR0FBQUcsRUFBQU4sVUFFQUcsSUFDQUcsRUFBQUosU0FBQUMsR0FFQW9DLElBQ0FyRCxLQUFBLFNBQUF1QyxHQUNBaUIsRUFBQWpCLEVBQUFoQyxRQUZBOEMsU0FJQSxTQUFBbkQsR0FDQXVELEVBQUF2RCxNQUlBdUQsRUFBQSwwQkFLQXJCLEVBQUEsU0FBQUMsRUFBQUMsR0FDQSxNQUFBWSxHQUFBUSxLQUFBLGdCQUNBckIsU0FBQUEsRUFDQUMsU0FBQUEsSUFDQXRDLEtBQUEsU0FBQXVDLEdBTUEsTUFMQVksR0FBQWxDLE1BQUFzQixFQUFBaEMsS0FHQWEsRUFBQUosU0FBQW1DLEVBQUFsQyxPQUVBb0MsT0FJQVosRUFBQSxXQUNBLE1BQUEsSUFBQWMsU0FBQSxTQUFBQyxFQUFBQyxHQUNBTixFQUFBbEMsTUFBQSxLQUdBRyxFQUFBSixXQUVBd0MsTUFJQSxRQUNBSCxRQUFBQSxFQUNBdEQsbUJBQUFBLEVBQ0FxQyxNQUFBQSxFQUNBSyxPQUFBQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbWFnZWxsYW4gPSBhbmd1bGFyLm1vZHVsZShcIm1hZ2VsbGFuXCIsIFtcclxuICAgICd1aS5yb3V0ZXInXHJcbl0sIGZ1bmN0aW9uIGNvbmZpZygkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBdXRoSW50ZXJjZXB0b3InKTtcclxufSk7XHJcblxyXG5tYWdlbGxhbi5jb250cm9sbGVyKFwiQXBwQ3RybFwiLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSwgVXNlclNydikge1xyXG4gICAgLy8gLS0tLS0tLS0tLS0gQXBwIGNvbmZpZyAtLS0tLS0tLS0tLS1cclxuICAgICRzY29wZS5hcHAgPSB7XHJcbiAgICAgICAgY29uZmlnOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIk1hZ2VsbGFuXCIsXHJcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIlRlc3QgeW91ciBrbm93bGVkZ2UgYWJvdXQgdGhlIGNvdW50cmllcyBvZiBvdXIgd29ybGRcIixcclxuICAgICAgICAgICAgYXV0aG9yOiBcIk1pY2hhZWwgU3RpZnRlclwiXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLSBBcHAgaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tXHJcbiAgICBVc2VyU3J2LmdldFVzZXJGcm9tU3RvcmFnZSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgICAgICAvLyBzdG9yZSB1c2VyIG9iamVjdCBpbiBzY29wZVxyXG4gICAgICAgICAgICAkc2NvcGUudXNlciA9IHVzZXI7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAvLyAtLS0tLS0tLS0tLSBFdmVudCBoYW5kbGluZyAtLS0tLS0tLS0tLS1cclxuICAgICRzY29wZS4kb24oJ2FwcC5sb2dpbicsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgLy8gc3RvcmUgdXNlciBvYmplY3QgaW4gc2NvcGVcclxuICAgICAgICAkc2NvcGUudXNlciA9IGRhdGE7XHJcblxyXG4gICAgICAgIC8vIGdvIHRvIHF1aXogcGFnZVxyXG4gICAgICAgICRzdGF0ZS5nbygncXVpeicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLiRvbignYXBwLmxvZ291dCcsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgLy8gcmVtb3ZlIHVzZXIgb2JqZWN0IGZyb20gc2NvcGVcclxuICAgICAgICAkc2NvcGUudXNlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIGdvIHRvIGhvbWUgcGFnZVxyXG4gICAgICAgICRzdGF0ZS5nbygnaG9tZScpO1xyXG4gICAgfSk7XHJcbn0pOyIsInZhciBtYWdlbGxhbiA9IGFuZ3VsYXIubW9kdWxlKFwibWFnZWxsYW5cIiwgW1xyXG4gICAgJ3VpLnJvdXRlcidcclxuXSwgW1wiJGh0dHBQcm92aWRlclwiLCBmdW5jdGlvbiBjb25maWcoJGh0dHBQcm92aWRlcikge1xyXG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnQXV0aEludGVyY2VwdG9yJyk7XHJcbn1dKTtcclxuXHJcbm1hZ2VsbGFuLmNvbnRyb2xsZXIoXCJBcHBDdHJsXCIsIFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIlVzZXJTcnZcIiwgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGUsIFVzZXJTcnYpIHtcclxuICAgIC8vIC0tLS0tLS0tLS0tIEFwcCBjb25maWcgLS0tLS0tLS0tLS0tXHJcbiAgICAkc2NvcGUuYXBwID0ge1xyXG4gICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICB0aXRsZTogXCJNYWdlbGxhblwiLFxyXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCJUZXN0IHlvdXIga25vd2xlZGdlIGFib3V0IHRoZSBjb3VudHJpZXMgb2Ygb3VyIHdvcmxkXCIsXHJcbiAgICAgICAgICAgIGF1dGhvcjogXCJNaWNoYWVsIFN0aWZ0ZXJcIlxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0gQXBwIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLVxyXG4gICAgVXNlclNydi5nZXRVc2VyRnJvbVN0b3JhZ2UoKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgICAgICAgLy8gc3RvcmUgdXNlciBvYmplY3QgaW4gc2NvcGVcclxuICAgICAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgLy8gLS0tLS0tLS0tLS0gRXZlbnQgaGFuZGxpbmcgLS0tLS0tLS0tLS0tXHJcbiAgICAkc2NvcGUuJG9uKCdhcHAubG9naW4nLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG4gICAgICAgIC8vIHN0b3JlIHVzZXIgb2JqZWN0IGluIHNjb3BlXHJcbiAgICAgICAgJHNjb3BlLnVzZXIgPSBkYXRhO1xyXG5cclxuICAgICAgICAvLyBnbyB0byBxdWl6IHBhZ2VcclxuICAgICAgICAkc3RhdGUuZ28oJ3F1aXonKTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS4kb24oJ2FwcC5sb2dvdXQnLCBmdW5jdGlvbihldmVudCwgZGF0YSkge1xyXG4gICAgICAgIC8vIHJlbW92ZSB1c2VyIG9iamVjdCBmcm9tIHNjb3BlXHJcbiAgICAgICAgJHNjb3BlLnVzZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBnbyB0byBob21lIHBhZ2VcclxuICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcclxuICAgIH0pO1xyXG59XSk7XG4ndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdtYWdlbGxhbicpXHJcbiAgICAuZmFjdG9yeSgnQXV0aFRva2VuU3J2JywgW1wiJHdpbmRvd1wiLCBmdW5jdGlvbigkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIHN0b3JlID0gJHdpbmRvdy5zZXNzaW9uU3RvcmFnZTtcclxuICAgICAgICB2YXIga2V5ID0gJ2F1dGgtdG9rZW4nO1xyXG5cclxuICAgICAgICB2YXIgZ2V0VG9rZW4gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmdldEl0ZW0oa2V5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgc2V0VG9rZW4gPSBmdW5jdGlvbih0b2tlbikge1xyXG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgICAgIHN0b3JlLnNldEl0ZW0oa2V5LCB0b2tlbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXHJcbiAgICAgICAgICAgIHNldFRva2VuOiBzZXRUb2tlblxyXG4gICAgICAgIH07XHJcbiAgICB9XSk7XG4ndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdtYWdlbGxhbicpXHJcbiAgICAuZmFjdG9yeSgnQXV0aEludGVyY2VwdG9yJywgW1wiQXV0aFRva2VuU3J2XCIsIGZ1bmN0aW9uKEF1dGhUb2tlblNydikge1xyXG4gICAgICAgIHZhciBhZGRUb2tlbiA9IGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5TcnYuZ2V0VG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUF1dGgnXSA9IHRva2VuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuXHJcbiAgICAgICAgfTtcclxuICAgIH1dKTtcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb250cm9sbGVyKCdEcm9wZG93bkN0cmwnLCBbXCIkc2NvcGVcIiwgZnVuY3Rpb24oJHNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgJHNjb3BlLnRvZ2dsZURyb3Bkb3duID0gdG9nZ2xlRHJvcGRvd247XHJcbiAgICAgICAgJHNjb3BlLnNob3dEcm9wZG93biA9IHNob3dEcm9wZG93bjtcclxuICAgICAgICAkc2NvcGUuaGlkZURyb3Bkb3duID0gaGlkZURyb3Bkb3duO1xyXG4gICAgICAgICRzY29wZS5pc0Ryb3Bkb3duVmlzaWJsZSA9IGlzRHJvcGRvd25WaXNpYmxlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVEcm9wZG93bigpIHtcclxuICAgICAgICAgICAgdmlzaWJsZSA9ICF2aXNpYmxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0Ryb3Bkb3duKCkge1xyXG4gICAgICAgICAgICB2aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGhpZGVEcm9wZG93bigpIHtcclxuICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNEcm9wZG93blZpc2libGUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2aXNpYmxlO1xyXG4gICAgICAgIH1cclxuICAgIH1dKTtcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5mYWN0b3J5KCdGb2N1c1NydicsIFtcIiR0aW1lb3V0XCIsIFwiJHdpbmRvd1wiLCBmdW5jdGlvbigkdGltZW91dCwgJHdpbmRvdykge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpZCkge1xyXG4gICAgICAgICAgICAvLyB0aW1lb3V0IG1ha2VzIHN1cmUgdGhhdCBpcyBpbnZva2VkIGFmdGVyIGFueSBvdGhlciBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXHJcbiAgICAgICAgICAgIC8vIGUuZy4gY2xpY2sgZXZlbnRzIHRoYXQgbmVlZCB0byBydW4gYmVmb3JlIHRoZSBmb2N1cyBvclxyXG4gICAgICAgICAgICAvLyBpbnB1dHMgZWxlbWVudHMgdGhhdCBhcmUgaW4gYSBkaXNhYmxlZCBzdGF0ZSBidXQgYXJlIGVuYWJsZWQgd2hlbiB0aG9zZSBldmVudHNcclxuICAgICAgICAgICAgLy8gYXJlIHRyaWdnZXJlZC5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICR3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfV0pO1xuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnbWFnZWxsYW4nKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsIFtcIiRzY29wZVwiLCBcIlVzZXJTcnZcIiwgXCJGb2N1c1NydlwiLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTcnYsIEZvY3VzU3J2KSB7XHJcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIFVzZXJTcnYubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpbmZvcm0gYXBwbGljYXRpb24gY29udHJvbCBhYm91dCBsb2dpbiBldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnYXBwLmxvZ2luJywgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogbm90aWZ5IHVzZXIgYWJvdXQgZXJyb3IgaW4gbG9naW4gcHJvY2Vzc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gZm9jdXMgdXNlcm5hbWUgZmllbGRcclxuICAgICAgICBGb2N1c1NydigndXNlcm5hbWUnKTtcclxuICAgIH1dKTtcbid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb250cm9sbGVyKCdMb2dvdXRDdHJsJywgW1wiJHNjb3BlXCIsIFwiVXNlclNydlwiLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTcnYpIHtcclxuICAgICAgICBVc2VyU3J2LmxvZ291dCgpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5mb3JtIGFwcGxpY2F0aW9uIGNvbnRyb2wgYWJvdXQgbG9nb3V0IGV2ZW50XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGVtaXQoJ2FwcC5sb2dvdXQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XSk7XG5hbmd1bGFyLm1vZHVsZSgnbWFnZWxsYW4nKVxyXG4gICAgLmNvbmZpZyhbXCIkbG9jYXRpb25Qcm92aWRlclwiLCBcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJHVybFJvdXRlclByb3ZpZGVyXCIsIGZ1bmN0aW9uKCRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gZW5hYmxlIEhUTUw1IHB1c2hzdGF0ZVxyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcclxuXHJcbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2hvbWUnKTtcclxuXHJcbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYnVpbGQvdmlld3MvaG9tZS5wYXJ0aWFsLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncXVpeicsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9xdWl6JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2J1aWxkL3ZpZXdzL3F1aXoucGFydGlhbC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ2luJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2J1aWxkL3ZpZXdzL2xvZ2luLnBhcnRpYWwuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdsb2dvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9nb3V0JyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dvdXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ3JlZ2lzdGVyJywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2J1aWxkL3ZpZXdzL3JlZ2lzdGVyLnBhcnRpYWwuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdhYm91dCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9hYm91dCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9idWlsZC92aWV3cy9hYm91dC5wYXJ0aWFsLmh0bWwnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfV0pO1xuJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnbWFnZWxsYW4nKVxyXG4gICAgLmZhY3RvcnkoJ1VzZXJTcnYnLCBbXCIkaHR0cFwiLCBcIkF1dGhUb2tlblNydlwiLCBmdW5jdGlvbigkaHR0cCwgQXV0aFRva2VuU3J2KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXInKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgZ2V0VXNlckZyb21TdG9yYWdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IEF1dGhUb2tlblNydi5nZXRUb2tlbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIEF1dGhUb2tlblNydi5zZXRUb2tlbih0b2tlbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdldFVzZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyB0b2tlbiwgd2UgcmVqZWN0IHRoZSBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiTm8gdG9rZW4gaW4gc3RvcmFnZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Nlc3Npb24nLCB7XHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmRcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi50b2tlbiA9IHJlc3BvbnNlLmRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gc2F2ZSB0b2tlbiBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICBBdXRoVG9rZW5TcnYuc2V0VG9rZW4oc2VsZi50b2tlbik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFVzZXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGxvZ291dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRva2VuID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdG9rZW4gbG9jYWxseVxyXG4gICAgICAgICAgICAgICAgQXV0aFRva2VuU3J2LnNldFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRVc2VyOiBnZXRVc2VyLFxyXG4gICAgICAgICAgICBnZXRVc2VyRnJvbVN0b3JhZ2U6IGdldFVzZXJGcm9tU3RvcmFnZSxcclxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dFxyXG4gICAgICAgIH1cclxuICAgIH1dKTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdtYWdlbGxhbicpXHJcbiAgICAuZmFjdG9yeSgnQXV0aFRva2VuU3J2JywgZnVuY3Rpb24oJHdpbmRvdykge1xyXG4gICAgICAgIHZhciBzdG9yZSA9ICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2U7XHJcbiAgICAgICAgdmFyIGtleSA9ICdhdXRoLXRva2VuJztcclxuXHJcbiAgICAgICAgdmFyIGdldFRva2VuID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5nZXRJdGVtKGtleSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHNldFRva2VuID0gZnVuY3Rpb24odG9rZW4pIHtcclxuICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5zZXRJdGVtKGtleSwgdG9rZW4pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RvcmUucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxyXG4gICAgICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW5cclxuICAgICAgICB9O1xyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnbWFnZWxsYW4nKVxyXG4gICAgLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uKEF1dGhUb2tlblNydikge1xyXG4gICAgICAgIHZhciBhZGRUb2tlbiA9IGZ1bmN0aW9uKGNvbmZpZykge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBBdXRoVG9rZW5TcnYuZ2V0VG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWydYLUF1dGgnXSA9IHRva2VuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IGFkZFRva2VuXHJcbiAgICAgICAgfTtcclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb250cm9sbGVyKCdEcm9wZG93bkN0cmwnLCBmdW5jdGlvbigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgdmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAkc2NvcGUudG9nZ2xlRHJvcGRvd24gPSB0b2dnbGVEcm9wZG93bjtcclxuICAgICAgICAkc2NvcGUuc2hvd0Ryb3Bkb3duID0gc2hvd0Ryb3Bkb3duO1xyXG4gICAgICAgICRzY29wZS5oaWRlRHJvcGRvd24gPSBoaWRlRHJvcGRvd247XHJcbiAgICAgICAgJHNjb3BlLmlzRHJvcGRvd25WaXNpYmxlID0gaXNEcm9wZG93blZpc2libGU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZURyb3Bkb3duKCkge1xyXG4gICAgICAgICAgICB2aXNpYmxlID0gIXZpc2libGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RHJvcGRvd24oKSB7XHJcbiAgICAgICAgICAgIHZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGlkZURyb3Bkb3duKCkge1xyXG4gICAgICAgICAgICB2aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc0Ryb3Bkb3duVmlzaWJsZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZpc2libGU7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnbWFnZWxsYW4nKVxyXG4gICAgLmZhY3RvcnkoJ0ZvY3VzU3J2JywgZnVuY3Rpb24oJHRpbWVvdXQsICR3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgICAgICAgLy8gdGltZW91dCBtYWtlcyBzdXJlIHRoYXQgaXMgaW52b2tlZCBhZnRlciBhbnkgb3RoZXIgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxyXG4gICAgICAgICAgICAvLyBlLmcuIGNsaWNrIGV2ZW50cyB0aGF0IG5lZWQgdG8gcnVuIGJlZm9yZSB0aGUgZm9jdXMgb3JcclxuICAgICAgICAgICAgLy8gaW5wdXRzIGVsZW1lbnRzIHRoYXQgYXJlIGluIGEgZGlzYWJsZWQgc3RhdGUgYnV0IGFyZSBlbmFibGVkIHdoZW4gdGhvc2UgZXZlbnRzXHJcbiAgICAgICAgICAgIC8vIGFyZSB0cmlnZ2VyZWQuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAkd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIFVzZXJTcnYsIEZvY3VzU3J2KSB7XHJcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIFVzZXJTcnYubG9naW4odXNlcm5hbWUsIHBhc3N3b3JkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpbmZvcm0gYXBwbGljYXRpb24gY29udHJvbCBhYm91dCBsb2dpbiBldmVudFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZW1pdCgnYXBwLmxvZ2luJywgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogbm90aWZ5IHVzZXIgYWJvdXQgZXJyb3IgaW4gbG9naW4gcHJvY2Vzc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gZm9jdXMgdXNlcm5hbWUgZmllbGRcclxuICAgICAgICBGb2N1c1NydigndXNlcm5hbWUnKTtcclxuICAgIH0pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb250cm9sbGVyKCdMb2dvdXRDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyU3J2KSB7XHJcbiAgICAgICAgVXNlclNydi5sb2dvdXQoKVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluZm9ybSBhcHBsaWNhdGlvbiBjb250cm9sIGFib3V0IGxvZ291dCBldmVudFxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdhcHAubG9nb3V0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfSk7IiwiYW5ndWxhci5tb2R1bGUoJ21hZ2VsbGFuJylcclxuICAgIC5jb25maWcoZnVuY3Rpb24oJGxvY2F0aW9uUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICAvLyBlbmFibGUgSFRNTDUgcHVzaHN0YXRlXHJcbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xyXG5cclxuICAgICAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaG9tZScpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvaG9tZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9idWlsZC92aWV3cy9ob21lLnBhcnRpYWwuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdxdWl6Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3F1aXonLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYnVpbGQvdmlld3MvcXVpei5wYXJ0aWFsLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYnVpbGQvdmlld3MvbG9naW4ucGFydGlhbC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2xvZ291dCcsIHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9sb2dvdXQnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ291dEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVnaXN0ZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYnVpbGQvdmlld3MvcmVnaXN0ZXIucGFydGlhbC5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2Fib3V0Jywge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL2Fib3V0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2J1aWxkL3ZpZXdzL2Fib3V0LnBhcnRpYWwuaHRtbCdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9KTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdtYWdlbGxhbicpXHJcbiAgICAuZmFjdG9yeSgnVXNlclNydicsIGZ1bmN0aW9uKCRodHRwLCBBdXRoVG9rZW5TcnYpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciBnZXRVc2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcicpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBnZXRVc2VyRnJvbVN0b3JhZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gQXV0aFRva2VuU3J2LmdldFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aFRva2VuU3J2LnNldFRva2VuKHRva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0VXNlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHRva2VuLCB3ZSByZWplY3QgdGhlIHByb21pc2VcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJObyB0b2tlbiBpbiBzdG9yYWdlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbG9naW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvc2Vzc2lvbicsIHtcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcclxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRva2VuID0gcmVzcG9uc2UuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBzYXZlIHRva2VuIGxvY2FsbHlcclxuICAgICAgICAgICAgICAgIEF1dGhUb2tlblNydi5zZXRUb2tlbihzZWxmLnRva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VXNlcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2YXIgbG9nb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudG9rZW4gPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0b2tlbiBsb2NhbGx5XHJcbiAgICAgICAgICAgICAgICBBdXRoVG9rZW5TcnYuc2V0VG9rZW4oKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdldFVzZXI6IGdldFVzZXIsXHJcbiAgICAgICAgICAgIGdldFVzZXJGcm9tU3RvcmFnZTogZ2V0VXNlckZyb21TdG9yYWdlLFxyXG4gICAgICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgICAgIGxvZ291dDogbG9nb3V0XHJcbiAgICAgICAgfVxyXG4gICAgfSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
