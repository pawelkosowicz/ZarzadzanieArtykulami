/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){

    var csrftoken = getCookie('csrftoken');

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

     $("#oldMessage").click(function() {
       $.ajax({
            url: "/mvc-application/oldNews/",
            type: "POST",
            cache: false
        }).done(function(response) {
           $('#news').html(response);
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
         // alert(response);
         });

    });


     $("#registerpage").click(function() {
       $.ajax({
            url: "/mvc-application/register/",
            cache: false
        }).done(function(data) {
           window.location='/mvc-application/register/';
        });

    });


    jQuery("#password").keyup(function() {
    	  passwordStrength(jQuery(this).val());
    	});

    $('#register-form').on('submit', function (e) {
           e.preventDefault();

       $('.errorRegister').html('<div class="gif"><img src="/static/gif/loading-small.gif" /></div>');

           var email =  $("#email").val();
           var password =$("#password").val();
           var username = $("#username").val();
           var repeatPassword =$('#repeatPassword').val();

            if(password!=repeatPassword){
                $('.errorRegister').html("<div class='alert alert-danger'>");
                        $('.errorRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('.errorRegister > .alert-danger').append("<strong>Proszę podać jednakowe hasła!");
                        $('.errorRegister > .alert-danger').append('</div>');
            }
            else
                registerUser(email,username,password);



        });

    addForumComments();

});

function addForumComments(){
    $("#addForumComment").click(function() {
               var comments = $(".textarea-common").val();
                             $.ajax({
                                url: "/mvc-application/forum/addComment/",
                                type: "POST",
                                cache: false,
                                data: { comments: comments }
                            }).done(function(response) {
                                if(response=="OK")
                                     getAllComments();
                                 $(".textarea-common").val("");
                             });
                return true;
           });
}

function deleteForumComments(commentsId){
      $.ajax({
            url: "/mvc-application/forum/deleteComment/",
            type: "POST",
            cache: false,
            data: { commentsId: commentsId }
        }).done(function(response) {

            getAllComments();
          // $('#news').html(response);
           // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
         // alert(response);
         });
  }

function deleteForumTopic(forumId){
      $.ajax({
            url: "/mvc-application/forum/deleteTopic/",
            type: "POST",
            cache: false,
            data: { forumId: forumId }
        }).done(function(response) {

            getTopicForum();
          // $('#news').html(response);
           // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
         // alert(response);
         });
  }
function getTopicForum(){

      $.ajax({
            url: "/mvc-application/forum/getTopic/",
            type: "POST",
            cache: false,
        }).done(function(response) {
            $('.forum-topic').html(response);
          // $('#news').html(response);
           // $("html, body").animate({ scrollTop: $(document).height() }, "slow");
         // alert(response);
         });
  }


function getAllComments(){
        $('#success').html('<div class="gif"><img src="../../static/gif/loading-small.gif" /></div>');
        $.ajax({
            url: "/mvc-application/forum/getComments/",
            type: "GET",
            cache: false
            }).done(function(response) {
               //   var obj = jQuery.parseJSON(response);
                 // alert(obj);
                  $('.forum-comments').html("");
                  $('.comments-forum').html(response);

                /*  $.each(obj, function(index, val) {
                       $('.forum-comments').append("<tr><td><div class='commentsText'> <div class='row forumComments'>"+val.comments+" </div></div>");
                     $('.forum-comments').append("<div class='row secondLineComment'>"+val.idUser.name+" "+val.dateTime +"</div></td></tr>");
                    });*/

        });
}



function registerUser(email,username,password){
    $.ajax({
                url: "/mvc-application/register/",
                type: "POST",
                cache: false,
                data: { email: email,
                        username: username,
                        password:password}
            }).done(function(data) {
                if(data.response==="OK"){
                    $('.errorRegister').html("<div class='alert alert-success'>");
                        $('.errorRegister > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('.errorRegister > .alert-success').append("<strong>Konto zostało utworzone!");
                        $('.errorRegister > .alert-success').append('</div>');
                    $('#register-form').trigger("reset");
                }else if(data.response==="FAIL"){
                    $('.errorRegister').html("<div class='alert alert-danger'>");
                        $('.errorRegister > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('.errorRegister > .alert-danger').append("<strong>Uzytkownik o podanej nazwie istnieje!");
                        $('.errorRegister > .alert-danger').append('</div>');

                }
            })
}



function showNews(){
    $('#news').html('<div class="gif"><img src="../static/gif/loading.gif" /></div>');

    $.ajax({
            url: "/mvc-application/news/",
            type: "POST",
            cache: false,
        }).done(function(response) {
           $('#news').html(response);

         // alert(response);
    });
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function passwordStrength(password) {

	var desc = [{'width':'0px'}, {'width':'20%'}, {'width':'40%'}, {'width':'60%'}, {'width':'80%'}, {'width':'100%'}];

	var descClass = ['', 'progress-bar-danger', 'progress-bar-danger', 'progress-bar-warning', 'progress-bar-success', 'progress-bar-success'];

	var score = 0;

	if (password.length > 2) score++;

	if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) score++;

	if (password.match(/\d+/)) score++;

	if ( password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) )	score++;

	if (password.length > 8) score++;

	$("#jak_pstrength").removeClass(descClass[score-1]).addClass(descClass[score]).css(desc[score]);
}