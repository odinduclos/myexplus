var admin = angular.module('admin', ['ngRoute', 'ngCookies', 'flash', 'ngMaterial']).run(function($rootScope) {
    $rootScope.url = 'http://www.pierreriche.com:8000/';
    $rootScope.note = []; //niveau de légalité moyen
    $rootScope.alert = function(type,msg){
      $rootScope.message = [];
      if ($rootScope.message)
        $rootScope.message.push(msg);
        $rootScope.alerts = {
            class: type,
            messages:$rootScope.message
        }
    }
    $rootScope.alertClear = function() {
      $rootScope.message = [];
        $rootScope.alerts = {
            class: null,
            messages:$rootScope.message
        }
    }
});

admin.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : "assets/view/index.html",
            controller: 'index'
        })
        .when('/menu', {
            templateUrl: 'assets/view/menu.html',
            controller: 'menu'
        })
        .when('/register', {
            templateUrl: 'assets/view/register.html',
            controller: 'register'
        })
        .when('/stage', {
            templateUrl: 'assets/view/stage.html',
            controller: 'stage'
        })
        .when('/stagiaire', {
            templateUrl: 'assets/view/stagiaire.html',
            controller: 'stagiaire'
        })
        .when('/master', {
            templateUrl: 'assets/view/master.html',
            controller: 'master'
        })
        .when('/rome', {
            templateUrl: 'assets/view/rome.html',
            controller: 'rome'
        })
        .when('/query', {
            templateUrl: 'assets/view/query.html',
            controller: 'query'
        })
        .when('/validation', {
            templateUrl: 'assets/view/validation.html',
            controller: 'validation'
        })
        .when('/skills/:id_stagiaire', {
            templateUrl: 'assets/view/skills.html',
            controller: 'skills'
        })
        .when('/archive', {
            templateUrl : "assets/view/archive.html",
            controller: 'archive'
        })
        .otherwise({redirectTo : "/"})

});

// Basic controllers

admin.controller('print', ['$rooteScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {

    $scope.userRole = $cookies.get('user_role');
    $http.get($rootScope.url+'/utilisateurs', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.users = response.data;
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/')
    });
    $http.get($rootScope.url+'utilisateurs', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.users = response.data;
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/')
    });
}]);
admin.controller('validation', ['$rootScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies){
    $scope.userRole = $cookies.get('user_role');
    if ($scope.userRole == 1) {
      $http.get($rootScope.url+'maitresdestageinfo/'+$cookies.get('user_id'), {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.maitre_de_stage_id = response.data.id;
          $scope.stagess = [];
          $http.get($rootScope.url+'mystagesmaitredestage/'+$scope.maitre_de_stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
            $.each(response.data, function (key, value) {
                $scope.stagess.push(value.id_stage.id);
            });
            $scope.stagiaires = [];
            $.each($scope.stagess, function (key, value) {
                $http.get($rootScope.url+'stagesstagiaires/'+value, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                    if (key != 0 && !$scope.stagiaires.includes(response.data.id_stagiaire))
                    $scope.stagiaires.push(response.data.id_stagiaire);
                });
            });
          });
        }).catch(function(error) {
          $cookies.remove('token');
          $location.path('/')
        });
    }
    else {
      $http.get($rootScope.url+'stagiaires', {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.stagiaires = response.data;
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
    }
    $scope.disableFlash = function() {
      $rootScope.alertClear();
    };
}]);

//Controller Login

admin.controller('index', ['$rootScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
    var token = $cookies.get('token');
    if(!token){
        $scope.data = "no user";
        $location.path('/')
    }
    else {
        $scope.userRole = $cookies.get('user_role');
        $location.path('/menu')
    }
}]);

// Ne sert à rien

admin.controller('register', ['$rootScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies){
  $scope.userRole = $cookies.get('user_role');
  var userRole = $cookies.get('user_role');
  if (userRole == 3) {
    $http.get($rootScope.url+'utilisateurs', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.users = response.data;
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/')
    });
  }
  else {
    $rootScope.alert('danger', 'Vous ne disposez pas des droits requis pour accédez a cette page');
    setTimeout(function(){
      $rootScope.alertClear();
    }, 3000);$cookies.get('user_role')
    $location.path('/menu');
  }
}]);

// Menu liste stagiaires

admin.controller('menu', ['$rootScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
  $scope.userRole = $cookies.get('user_role');
  if ($scope.userRole == 1) {
    $http.get($rootScope.url+'maitresdestageinfo/'+$cookies.get('user_id'), {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.maitre_de_stage_id = response.data.id;
        $scope.stagess = [];
        $http.get($rootScope.url+'mystagesmaitredestage/'+$scope.maitre_de_stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
          $.each(response.data, function (key, value) {
              $scope.stagess.push(value.id_stage.id);
          });
          $scope.stagiaires = [];
          $.each($scope.stagess, function (key, value) {
              $http.get($rootScope.url+'stagesstagiaires/'+value, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                    $scope.stagiaires.push(response.data.id_stagiaire);
              })
              .finally(function() {
                var stagiaires = [];
                $.each($scope.stagiaires, function (key, value) {
                    if(key != 0 && !stagiaires.includes(value))
                      stagiaires.push(value);
                });
                $scope.users = stagiaires;
                $.each($scope.users, function (key, value) {
                    $http.get($rootScope.url+'stagiaireinfo/' + value.id_utilisateur.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                        $http.get($rootScope.url+'mystages/' + response.data.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                            $.each(response.data, function (mykey, value) {
                                var today = new Date();
                                var dd = today.getDate();
                                var mm = today.getMonth()+1;
                                var yyyy = today.getFullYear();
                                today = yyyy + '-' + mm + '-' + dd;
                                today = Date.parse(today);
                                var date_debut = Date.parse(value.id_stage.date_debut);
                                var date_fin = Date.parse(value.id_stage.date_fin);

                                if (today > date_debut && today < date_fin) {
                                    $scope.users[key].current_stage = value;
                                }
                                else if (today < date_debut && today < date_fin) {
                                    $scope.users[key].futur_stage = value;
                                }
                            });

                        });
                    });
                });
              });
          });
          // console.log($scope.users);
        });
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
  }
  else {
    $http.get($rootScope.url+'stagiaires', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.users = response.data;
        $.each(response.data, function (key, value) {
            $http.get($rootScope.url+'stagiaireinfo/' + value.id_utilisateur.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                $http.get($rootScope.url+'mystages/' + response.data.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                    $.each(response.data, function (mykey, value) {
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1;
                        var yyyy = today.getFullYear();
                        today = yyyy + '-' + mm + '-' + dd;
                        today = Date.parse(today);
                        var date_debut = Date.parse(value.id_stage.date_debut);
                        var date_fin = Date.parse(value.id_stage.date_fin);

                        if (today > date_debut && today < date_fin) {
                            $scope.users[key].current_stage = value;
                        }
                        else if (today < date_debut && today < date_fin) {
                            $scope.users[key].futur_stage = value;
                        }
                    });

                });
            });
        });
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/');
    });
  }
  $scope.createStage = function(id, mail)
  {
    $rootScope.newdatavalue = {'id': id, 'mail': mail};
    $location.path('/stage');
  }
  // $http.get("http://localhost:8000/stages", {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
  //     console.log(response.data);
  // });
}]);

// Creation Stage

admin.controller('stage', ['$rootScope', '$location', '$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
    $scope.userRole = $cookies.get('user_role');
    if ($scope.userRole > 1) {
      $http.get($rootScope.url+'stagesstagiaires', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.metiersD = [];
        $scope.stagiairesD = [];
        for (var i = 0; i < response.data.length; i++) {
          response.data[i]
          $http.get($rootScope.url+'metiers/' + response.data[i].id_stage.id_metier.id , {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              $scope.metiersD.push(response.data.titre);
          });
          $http.get($rootScope.url+'stagiaires/' + response.data[i].id_stagiaire.id , {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              $scope.stagiairesD.push(response.data.prenom + " " + response.data.nom);
          });
        }
        $scope.stages = response.data;
      }).catch(function(error) {
        console.log(error);
        // $cookies.remove('token');
        // $location.path('/')
      });
      if ($rootScope.newdatavalue != undefined) {
        $scope.userId = $rootScope.newdatavalue;
      }
      else {
        $scope.userId = undefined;
      }
      $http.get($rootScope.url+'stagiaires', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.stagiaire = response.data;
          if ($scope.userId != undefined) {
            for (var i = 0; i < $scope.stagiaire.length; i++) {
              if ($scope.stagiaire[i].id == $scope.userId.id) {
                $scope.stagiaire = $scope.stagiaire[i].id;
              }
            }
          }
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
      $http.get($rootScope.url+'maitresdestage', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.masters = response.data;
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
      $http.get($rootScope.url+'stagiaires', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.stagiaires = response.data;
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
      $http.get($rootScope.url+'metiers', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.metiers = response.data;
      }).catch(function(error) {
        $cookies.remove('token');
        $location.path('/')
      });
  }
  else {
    $location.path('/menu');
  }
}]);

// stagiaire
admin.controller('stagiaire', ['$rootScope', '$location', '$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
  $scope.userRole = $cookies.get('user_role');
  if ($scope.userRole < 2)
    $location.path('/menu');
}]);

admin.controller('master', ['$rootScope', '$location', '$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
  $scope.userRole = $cookies.get('user_role');
  if ($scope.userRole < 2)
    $location.path('/menu');
}]);

// Confirmation inscriptions

admin.controller('query', ['$rootScope', '$location', '$scope', '$http', '$cookies',
    function ($rootScope, $location, $scope, $http, $cookies) {
      $scope.userRole = $cookies.get('user_role');
      if ($scope.userRole > 1) {
        $http.get($rootScope.url + 'stagiaires', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            $scope.data = response.data;
        }).catch(function(error) {
          angular.forEach($cookies, function (cookie, key) {
            if (key.indexOf('NAV-') > -1) {
                 delete $cookies[key];
            }
          });
          $location.path('/')
        });
      }
      else {
        $location.path('/menu');
      }
}]);

admin.controller('skills', ['$routeParams', '$rootScope', '$location', '$scope', '$http', '$cookies',
    function ($routeParams, $rootScope, $location, $scope, $http, $cookies) {
      $scope.userRole = $cookies.get('user_role');
      if ($scope.userRole == 1) {
        $http.get($rootScope.url+'maitresdestageinfo/'+$cookies.get('user_id'), {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.maitre_de_stage_id = response.data.id;
          $scope.stagess = [];
          $http.get($rootScope.url+'mystagesmaitredestage/'+$scope.maitre_de_stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
            $.each(response.data, function (key, value) {
                $scope.stagess.push(value.id_stage.id);
            });
            $http.get($rootScope.url + 'mystages/' + $routeParams.id_stagiaire, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                var stages = [];
                $.each(response.data, function (key, value) {
                  if ($scope.stagess.includes(value.id_stage.id))
                    stages.push(value);
                });
                $scope.stages = stages;
                $scope.metiers = [];
                $.each(response.data, function (key, value) {
                    var test = getCompetence();
                    $scope.metiers.push(test.$$state);
                    function getCompetence() {
                        var tmp = $http.get($rootScope.url + 'mycompetences/' + value.id_stage.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                            return response.data;
                        });
                        return tmp;
                    }
                });
            })
          });
        });
      }
      else {
        $http.get($rootScope.url + 'mystages/' + $routeParams.id_stagiaire, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            $scope.stages = response.data;
            $scope.metiers = [];
            $.each(response.data, function (key, value) {
                var test = getCompetence();
                $scope.metiers.push(test.$$state);
                function getCompetence() {
                    var tmp = $http.get($rootScope.url + 'mycompetences/' + value.id_stage.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                        return response.data;
                    });
                    return tmp;
                }
            });
        }).catch(function(error) {
          angular.forEach($cookies, function (cookie, key) {
            if (key.indexOf('NAV-') > -1) {
                 delete $cookies[key];
            }
          });
          $location.path('/')
        });
      }
        $http.get($rootScope.url + 'stagiaires/' + $routeParams.id_stagiaire, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            $scope.stagiaire = response.data;
        }).catch(function(error) {
          angular.forEach($cookies, function (cookie, key) {
            if (key.indexOf('NAV-') > -1) {
                 delete $cookies[key];
            }
          });
          $location.path('/')
        });
    }]);

admin.controller('TabController', ['$scope', '$cookies', function($scope, $cookies) {
    $scope.userRole = $cookies.get('user_role');
    $scope.tab = 1;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };
}]);

admin.controller('archive', ['$rootScope', '$location','$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
    $scope.userRole = $cookies.get('user_role');
    //$cookies.get('user_id') id du maitre connecté
    $http.get($rootScope.url+'maitresdestageinfo/'+$cookies.get('user_id'), {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.maitre_de_stage_id = response.data.id;
        $scope.stages = [];
        $http.get($rootScope.url+'mystagesmaitredestage/'+$scope.maitre_de_stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
            $.each(response.data, function (key, value) {
                $scope.stages.push(value.id_stage.id);
            });
            $scope.stagiaires = [];
            $.each($scope.stages, function (key, value) {
                $http.get($rootScope.url+'stagesstagiaires/'+value, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                    if (!$scope.stagiaires.includes(response.data.id_stagiaire) && key != 0) {
                      $scope.stagiaires.push(response.data.id_stagiaire);
                    }
                });
            });
            $scope.load_competence = function (id) {

                $http.get($rootScope.url+'stagiaires/' + id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                    $scope.cur_stagiaire = response.data;
                });
                $scope.competences = [];
                $http.get($rootScope.url+'mystages/'+id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                    $.each(response.data, function (key, value) {
                        $http.get($rootScope.url+'mycompetences/'+value.id_stage.id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response) {
                            $.each(response.data, function (key, value) {
                              if (value.validation_responsable)
                                $scope.competences.push(value);
                            });
                        });
                    });
                });
            };
        });
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/')
    });
}]);


// Routing + Body functions


admin.controller('post', ['$rootScope', '$route', '$location','$scope', '$http', '$cookies', 'flash', function ($rootScope, $route, $location, $scope, $http, $cookies, Flash) {
  $scope.userRole = $cookies.get('user_role');
    $scope.list = [1,2,3,4,5];
    $scope.submit = function () {
        var credentials = {
            mail: this.email,
            password: this.password
        };
        $http.post($rootScope.url+'connexion', credentials).then(function (response) {
            if (response.data.message_err) {
                $scope.error = 'Mauvaise combinaison mot de passe/mail';
            }
            else {
                $cookies.put('token', response.data.value);
                $cookies.put('token_id', response.data.id);
                $cookies.put('user_id', response.data.user.id);
                $cookies.put('user_role', response.data.user.role);
                $rootScope.userRole = response.data.user.role;
                $scope.user_role = response.data.user.role;
                $location.path('/menu');
            }
        });
    };
    $scope.logout = function () {
        var data = $cookies.get('token_id');
        $http.delete($rootScope.url+'deconnexion/' + data, {
            headers: {
                'Content-Type': 'x-www-form-urlencoded/json;charset=utf-8',
                'X-Auth-Token': $cookies.get('token')
            }
        }).then(function (response) {
            $cookies.remove('user');
            $cookies.remove('token');
            $cookies.remove('token_id');
            $location.path('/');
        });
    };

    $scope.validateEmail = function (email) {
      if (email == undefined) {
        return false;
      }
      var chrbeforAt = email.substr(0, email.indexOf('@'));
      if (!($.trim(email).length > 127)) {
          if (chrbeforAt.length >= 2) {
              var re = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
              return re.test(email);
          } else {
              return false;
          }
      } else {
          return false;
      }
    }

    // Inscriptions en tous genres
    $scope.create_admin =function (roleInt) {
        var userRole = $cookies.get('user_role');
        if (userRole != 3) {
          $rootScope.alert('danger', 'Vous ne disposez pas des droits requis pour éffectuer cette action');
          setTimeout(function(){
            $rootScope.alertClear();
          }, 3000);
        }
        else {
          var mail = this.mail;
          var role = roleInt;

          if (!this.validateEmail(mail)) {
            $rootScope.alert('danger', 'Veuillez entrez une adresse mail valide');
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
            return;
          }

          var data = 'mail='+mail+"&role="+role;

          $http.post($rootScope.url+"utilisateurs/new", data, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'X-Auth-Token': $cookies.get('token')
              }
          }).then(function (response) {
            if (response.message_err == undefined) {
              $rootScope.alert('success', "Utilisateur ajouté");
              setTimeout(function(){
                $rootScope.alertClear();
              }, 3000);
              $route.reload();
            }
            else {
              $rootScope.alert('danger', response.message_err);
              setTimeout(function(){
                $rootScope.alertClear();
              }, 3000);
            }
          });
        }
    };
    $scope.disableFlash = function() {
      $rootScope.alertClear();
    };
    $scope.register = function (roleInt) {
        var mail = this.mail;
        var password = this.password;
        var role = roleInt;
        var firstname = this.firstname;
        var lastname = this.lastname;
        var data = 'mail=' + mail + '&role=' + role + '&nom=' + firstname + '&prenom=' + lastname;
        if (this.enterprise) {
            data += '&nom_entreprise=' + this.enterprise;
        }
        if (this.password){
            data += '&password_hash=' + password;
        }
        $http.post($rootScope.url+"utilisateurs/new", data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': $cookies.get('token')
            }
        }).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Utilisateur ajouté");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
        });
    };

    //Creer Stage

    $scope.formatDate = function(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    $scope.stage = function () {
       var master = this.master;
       var stagiaire = this.stagiaire;
       var metier = this.metier;
       var end = this.ends;
       var begin = this.begin;
       if (typeof master == ('undefined' || null) || typeof stagiaire == ('undefined' || null) || typeof metier == ('undefined' || null) || end == null || begin == null) {
         $rootScope.alert('danger', 'Tout les champs doivent etre remplis, veuillez vérifier votre saisie');
         setTimeout(function(){
           $rootScope.alertClear();
         }, 3000);
       }
       else {
         $http.post($rootScope.url+'stages/new', {id_metier: metier, id_stagiaire: stagiaire, date_debut: $scope.formatDate(begin), date_fin: $scope.formatDate(end)}, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
             $http.post($rootScope.url+'stagesstagiaires/new', {id_stage: response.data.id, id_stagiaire: stagiaire}, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                 $http.post($rootScope.url+'stagesmaitresdestage/new', {idStage: response.data.id, idMaitreDeStage: parseInt(master)}, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                   console.log(response);
                   if (response.message_err == undefined) {
                     $rootScope.alert('success', "Ce stage a bien été ajouté");
                     setTimeout(function(){
                       $rootScope.alertClear();
                     }, 3000);
                   }
                   else {
                     $rootScope.alert('danger', response.message_err);
                     setTimeout(function(){
                       $rootScope.alertClear();
                     }, 3000);
                   }
                 });
             })
         });
      }
   };
   $scope.rmvstage = function () {
      var stage_id = this.stage;
      console.log(stage_id);
      if (typeof stage_id == ('undefined' || null)) {
        $rootScope.alert('danger', 'Tout les champs doivent etre remplis, veuillez vérifier votre saisie');
        setTimeout(function(){
          $rootScope.alertClear();
        }, 3000);
      }
      else {
        $http.delete($rootScope.url+'stages/' + stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Le stage a bien été supprimé");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          $route.reload();
        })
     }
  };
    $scope.r_register = function () {
        $location.path('/register');
    };
    $scope.delete = function (id) {
        $http.delete($rootScope.url+'utilisateurs/' + id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            if (response.message_err == undefined) {
              $rootScope.alert('success', "L'utilisateur a bien été supprimé");
              setTimeout(function(){
                $rootScope.alertClear();
              }, 3000);
            }
            else {
              $rootScope.alert('danger', response.message_err);
              setTimeout(function(){
                $rootScope.alertClear();
              }, 3000);
            }
            $route.reload();
        })
    };
    $scope.send_confirmation = function (bool, id) {
        if (bool == 0) {
            $http.delete($rootScope.url + 'stagiaires/' + id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              if (response.message_err == undefined) {
                $rootScope.alert('success', "Le stagiaire a bien été supprimé");
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
              else {
                $rootScope.alert('danger', response.message_err);
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
                $route.reload();
            });
        }
        else if (bool == 1) {
            var data = [];
            $http.patch($rootScope.url + 'stagiaires/activation/' + id, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': $cookies.get('token')
                }
            }).then(function (response) {
                if (response.message_err == undefined) {
                  $rootScope.alert('success', "Le compte a été activé");
                  setTimeout(function(){
                    $rootScope.alertClear();
                  }, 3000);
                }
                else {
                  $rootScope.alert('danger', response.message_err);
                  setTimeout(function(){
                    $rootScope.alertClear();
                  }, 3000);
                }
                $route.reload();

            });
        }
    };


    $scope.skills = function () {
        $location.path('/skills/:id_stagiaire');
    };
    $scope.archive = function () {
        $location.path('/archive');
    };
    $scope.r_stage = function (data) {
        $rootScope.newdatavalue = undefined;
        $location.path('/stage');
    };
    $scope.r_stagiaire = function () {
        $location.path('/stagiaire');
    };
    $scope.r_master = function () {
        $location.path('/master');
    };
    $scope.r_query = function () {
        $location.path('/query');
    };
    $scope.r_rome = function () {
        $location.path('/rome');
    };
    $scope.r_validation = function () {
        $location.path('/validation');
    };
    $scope.r_admin = function () {
        $location.path('/register');
    };
    $scope.r_archive = function () {
        $location.path('/archive');
    };

    $scope.load_stage = function (id) {
        $http.get($rootScope.url+'stagiaires/'+id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          $scope.stagiaire = response.data;
          $http.get($rootScope.url+'mystages/'+response.data.id, {headers: {'X-Auth-Token': $cookies.get('token')}})
            .then(function (response) {
              if ($cookies.get('user_role') == 1) {
                $http.get($rootScope.url+'maitresdestageinfo/'+$cookies.get('user_id'), {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (responsee) {
                    $scope.maitre_de_stage_id = responsee.data.id;
                    $scope.stagess = [];
                    $http.get($rootScope.url+'mystagesmaitredestage/'+$scope.maitre_de_stage_id, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function(response2) {
                      $.each(response2.data, function (key, value) {
                          $scope.stagess.push(value.id_stage.id);
                      });
                      var st = [];
                      $.each(response.data, function (key, value) {
                        if ($scope.stagess.includes(value.id_stage.id))
                          st.push(value);
                      });
                      var stages = st;
                      var stage_name = '';
                      $scope.stages = [];
                      $scope.stage_name = [];
                      if (stages.length === 0){
                          for (var i = 0; i < stages.length; i++){
                              stage_name = stage[i].id_stage.id_metier.titre;
                              $http.get($rootScope.url+'mycompetences/'+stages[i].id_stage.id, {headers: {'X-Auth-Token': $cookies.get('token')}})
                                  .then(function (response) {
                                      $scope.stages.push(response.data + stage_name);
                                  })
                          }
                      }
                      else {
                        for (var i = 0; i < stages.length; i++){
                          $scope.stage_name[stages[i].id_stage.id] = stages[i].id_stage.id_metier.titre;
                          $http.get($rootScope.url+'mycompetences/'+stages[i].id_stage.id, {headers: {'X-Auth-Token': $cookies.get('token')}})
                              .then(function (response) {
                                for (var e = 0; e < response.data.length; e++) {
                                  $scope.stages.push(response.data[e]);
                                }
                          })
                        }
                      }
                    });
                  });
              }
              else {
                var stages = response.data;
                var stage_name = '';
                $scope.stages = [];
                $scope.stage_name = [];
                if (stages.length === 0){
                    for (var i = 0; i < stages.length; i++){
                        stage_name = stage[i].id_stage.id_metier.titre;
                        $http.get($rootScope.url+'mycompetences/'+stages[i].id_stage.id, {headers: {'X-Auth-Token': $cookies.get('token')}})
                            .then(function (response) {
                                $scope.stages.push(response.data + stage_name);
                            })
                    }
                }
                else {
                  for (var i = 0; i < stages.length; i++){
                    $scope.stage_name[stages[i].id_stage.id] = stages[i].id_stage.id_metier.titre;
                    $http.get($rootScope.url+'mycompetences/'+stages[i].id_stage.id, {headers: {'X-Auth-Token': $cookies.get('token')}})
                        .then(function (response) {
                          for (var e = 0; e < response.data.length; e++) {
                            $scope.stages.push(response.data[e]);
                          }
                    })
                  }
                }
              }

            });
        });
    };
    $scope.add = function (note, skill) {
        $rootScope.note = {note: note, skill: skill};
    };
    $scope.note = function (stage) {
        var skill = stage.id;
        if ($rootScope.note.skill === skill){

            var data = {
                competenceMaitreDeStage: $rootScope.note.note,
                competenceStagiaire: $rootScope.note.note,
                validationResponsable: 1
            };
            $http.patch($rootScope.url+'stagiairescompetences/'+skill, data, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              if (response.message_err == undefined) {
                $rootScope.alert('success',"Compétence validée");
                // window.location.reload();
                  stage.hide = true;
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
              else {
                $rootScope.alert('danger', response.message_err);
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
            });
        }
        else {
          var data = {
              validationResponsable: 1
          };
          $http.patch($rootScope.url+'stagiairescompetences/'+skill, data, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              if (response.message_err == undefined) {
                $rootScope.alert('success',"Compétence validée");
                  stage.hide = true;
                  setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
              else {
                $rootScope.alert('danger', response.message_err);
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
          });
        }
    };
    $scope.validate = function (skill) {
        if ($rootScope.note.skill === skill){
            var data = {
                competenceMaitreDeStage: $rootScope.note.note,
                competenceStagiaire: $rootScope.note.note,
                validationResponsable: 1
            };
            $http.patch($rootScope.url+'stagiairescompetences/'+skill, data, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              if (response.message_err == undefined) {
                $rootScope.alert('success',"Compétence validée");
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
              else {
                $rootScope.alert('danger', response.message_err);
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
            });
        }
        else {
          var data = {
              validationResponsable: 1
          };
          $http.patch($rootScope.url+'stagiairescompetences/'+skill, data, {headers: {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
              if (response.message_err == undefined) {
                $rootScope.alert('success',"Compétence validée");
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
              else {
                $rootScope.alert('danger', response.message_err);
                setTimeout(function(){
                  $rootScope.alertClear();
                }, 3000);
              }
          });
        }
    };

    $scope.disableFlash = function() {
      $rootScope.alertClear();
    };

}]);

admin.controller('rome', ['$rootScope', '$location', '$scope', '$http', '$cookies', function ($rootScope, $location, $scope, $http, $cookies) {
    $scope.userRole = $cookies.get('user_role');
    if ($scope.userRole < 2)
      $location.path('/menu');
    //Autocompleter les selecteurs pour la liste de metiers
    $http.get($rootScope.url+'metiers', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
        $scope.metiers = response.data;
    }).catch(function(error) {
      $cookies.remove('token');
      $location.path('/')
    });

    $scope.disableFlash = function() {
      $rootScope.alertClear();
    };

    //metiers//

    $scope.hideElement = true;

    $scope.openFile = function(event) {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function(){
            $scope.dataURL = reader.result;
        };
        reader.readAsDataURL(input.files[0]);
    };

    //Ajouter un metier
    $scope.submitMetier = function() {
        var data = {
            titre: this.titreMetier,
            photo_path: $scope.dataURL,
            definition: this.definitionMetier
        };

        $http.post($rootScope.url+'metiers/new', data, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Metier ajouté");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }

            $scope.titreMetier = null;
            $scope.definitionMetier = null;

            $http.get($rootScope.url+'metiers', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                $scope.metiers = response.data;
            });
        });
    };

    //Autocompleter le form en fonction d'un metier choisi
    $scope.formAutoCompleteMetier = function() {
        $scope.titreMetierModif = $scope.idMetierModif.titre;
        $scope.definitionMetierModif = $scope.idMetierModif.definition;
    };

    //Modifier un metier
    $scope.submitMetierModif = function() {
        var data = {
            titre: this.titreMetierModif,
            definition: this.definitionMetierModif,
            photoPath: $scope.dataURL
        };
        $http.patch($rootScope.url+'metiers/'+$scope.idMetierModif.id, data, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Metier modifié");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }

            $scope.titreMetierModif = null;
            $scope.definitionMetierModif = null;

            $http.get($rootScope.url+'metiers', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                $scope.metiers = response.data;
            });
        });
    };

    //Supprimmer un metier
    $scope.submitMetierDelete = function() {

        $http.delete($rootScope.url+'metiers/'+$scope.idMetierDelete.id ,{headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Metier supprimé");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
            $http.get($rootScope.url+'metiers', {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                $scope.metiers = response.data;
            });
        }).catch(function(error) {
        // Catch and handle exceptions from success/error/finally functions
          $rootScope.alert('danger', "Impossible de supprimer ce métier veuillez vérifier que celui-ci ne soit attribué a aucun stage");
          setTimeout(function(){
            $rootScope.alertClear();
          }, 3000);
        });
    };

    //competences//

    //Ajouter une competence a un metier
    $scope.submitComp = function() {
        var data = {
            id_metier: this.idMetierComp,
            titre: this.titreComp,
            type: this.typeComp
        };

        $http.post($rootScope.url+'competences/new', data, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Compétence ajouté");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
            $scope.titreComp = null;
        });
    };

    //Rechercher les competences en fonction d'un metier choisi
    $scope.findCompModif = function() {
        $http.get($rootScope.url+'competencesmetier/'+$scope.idMetierModifComp.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            if (response.message_err != undefined) {
              $rootScope.alert('danger', response.message_err);
              setTimeout(function(){

                $rootScope.alertClear();
              }, 3000);
            }
            else {
                $scope.competencesMetier = response.data;
            }
        });
    };

    //Autocompleter le form en fonction d'un metier choisi
    $scope.formAutoCompleteComp = function() {
        $scope.titreCompModif = $scope.idCompModif.titre;
        $scope.definitionCompModif = $scope.idCompModif.type;
    };

    //Modifier une competence
    $scope.submitCompModif = function() {

        var data = {
            idMetier: $scope.idMetierModifComp.id,
            titre: this.titreCompModif,
            type: this.typeCompModif
        };

        $http.patch($rootScope.url+'competences/'+$scope.idCompModif.id, data, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Compétence modifié");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }

            $scope.titreCompModif = null;
            $scope.typeCompModif = null;

            $http.get($rootScope.url+'competencesmetier/'+$scope.idMetierModifComp.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                if (response.message_err != undefined) {
                  $rootScope.alert('danger', response.message_err);
                  setTimeout(function(){

                    $rootScope.alertClear();
                  }, 3000);
                }
                else {
                    $scope.competencesMetier = response.data;
                }
            });
        });
    };

    //Rechercher les competences en fonction d'un metier choisi
    $scope.findCompDelete = function() {
        $http.get($rootScope.url+'competencesmetier/'+$scope.idMetierDeleteComp.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
            if (response.message_err != undefined) {
              $rootScope.alert('danger', response.message_err);
              setTimeout(function(){

                $rootScope.alertClear();
              }, 3000);
            }
            else {
                $scope.competencesMetierDelete = response.data;
            }
        });
    };

    //Supprimmer un metier
    $scope.submitMetierCompDelete = function() {

        $http.delete($rootScope.url+'competences/'+$scope.idCompDelete.id ,{headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
          if (response.message_err == undefined) {
            $rootScope.alert('success', "Compétence supprimé");
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
          else {
            $rootScope.alert('danger', response.message_err);
            setTimeout(function(){
              $rootScope.alertClear();
            }, 3000);
          }
            $http.get($rootScope.url+'competencesmetier/'+$scope.idMetierDeleteComp.id, {headers : {'X-Auth-Token': $cookies.get('token')}}).then(function (response) {
                if (response.data.message_err) {
                }
                else {
                    $scope.competencesMetierDelete = response.data;
                }
            });
        });
    };

}]);
