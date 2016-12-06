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
    loadJqueryComments();
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
            url: "/mvc-application/getNews/",
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


/*
 wtyczka do komentowania newsów
*/
 function showSummernoteDialog(response){
    $('#summernote').html("");
    $("#summernote").summernote("code", response);

    $('#summernote').summernote({
                             height: 300,                 // set editor height
                             minHeight: 500,             // set minimum height of editor
                             maxHeight: 1000,             // set maximum height of editor
                             focus: true,                  // set focus to editable area after initializing summernote

                  });
  }

  function showAddPostDialog(){
     $('.saveMessageButton').toggle(true);
     $('#news_add').toggle(false);

      $.ajax({
             url: "/mvc-application/getPost/",
             type: "POST",
             cache: false,
              data: { idNews: 0}
             }).done(function(data) {
                   showSummernoteDialog(data[0].fields.longnews);
             });

   }

   function updatePost(){
      var post = $('#summernote').summernote('code');
       $('#summernote').summernote('reset');
       $('#summernote').summernote('destroy');
       $('#summernote').html("");

       $.ajax({
            url: "/mvc-application/updatePost/",
            type: "POST",
            cache: false,
            data: { longNews: post }
        }).done(function(data) {
            if(data.response=="OK"){
               reloadSinglePost();
            }

         });

  }
  function reloadSinglePost(){
     $.ajax({
           url: "/mvc-application/getPost/",
           type: "POST",
           cache: false,
           data: { idNews: 0}
           }).done(function(data) {
              $(".longPost").html(data[0].fields.longnews);
              $('.saveMessageButton').toggle(false);
              $('#news_add').toggle(true);
           });

   }


   function deleteNews(newsId){
      $.ajax({
            url: "/mvc-application/deleteNews/",
            type: "POST",
            cache: false,
            data: { id: newsId }
        }).done(function(response) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            showNews();
         });
  }

  function showEditNewsDialog(idNews){
       var edit_modal = new RModal(document.getElementById('edit_news_dialog'), {
               beforeOpen: function(next) {
                    next();
                    getSingleNews(idNews);
                }
                , afterOpen: function() {
                    editNews(idNews);
                }
                , beforeClose: function(next) {
                    next();
                }
                , afterClose: function() {

                }
            });
            window.modal = edit_modal;

            edit_modal.open();
  }

  function showAddNewsDialog(){
       var modal = new RModal(document.getElementById('add_news_dialog'), {
               beforeOpen: function(next) {
                    next();
                }
                , afterOpen: function() {
                    addNews();
                }
                , beforeClose: function(next) {
                    next();
                }
                , afterClose: function() {

                }
            });
            window.modal = modal;

            modal.open();
  }


   function getSingleNews(idNews){
        $.ajax({
              url: "/mvc-application/getPost/",
              type: "POST",
              cache: false,
              data: { idNews: idNews}
        }).done(function(data) {
              $("#edit_news_title").val(data[0].fields.title);
              $("#edit_news_short_title").val(data[0].fields.shortnews);
       });

   }

    function editNews(idNews){
       $("#edit_news").click(function() {
           var title = $("#edit_news_title").val();
           var shortNews = $("#edit_news_short_title").val();
                         $.ajax({
                            url: "/mvc-application/editNews/",
                            type: "POST",
                            cache: false,
                            data: { id:idNews,title: title,shortNews:shortNews }
                        }).done(function(data) {
                            if(data.response=="OK"){
                                 showNews();
                                 $('#edit_news_dialog').toggle(false);
                            }
                         });
            return true;
       });
  }

  function addNews(){
       $("#save_news").click(function() {
           var title = $("#add_news_title").val();
           var shortNews = $("#add_news_short_title").val();
                         $.ajax({
                            url: "/mvc-application/addNews/",
                            type: "POST",
                            cache: false,
                            data: { title: title,shortNews:shortNews }
                        }).done(function(data) {
                            if(data.response=="OK"){
                                 showNews();
                                clearInputAddNews();
                            }
                         });
            return true;
       });
  }

  function clearInputAddNews(){
       //$('#add_news_dialog').toggle(false)
       $("#add_news_title").val('');
       $("#add_news_short_title").val('');
       $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  }

  function loadJqueryComments(){
                $('.comments').comments({
                                        fieldMappings: {
                                            id: 'id',
                                            parent: 'Parent',
                                            content: 'content',
                                            created: 'created',
                                            modified: 'modified',
                                            fullname: 'fullName',
                                            profile_picture_url: 'Profile_picture_url',
                                            created_by_admin: 'Created_by_admin',
                                            created_by_current_user: 'Created_by_current_user',
                                            upvote_count: 'upvote_count',
                                            user_has_upvoted: 'User_has_upvoted',
                                        },
					profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/user_profiles/user-icon.png',
					roundProfilePictures: true,
					textareaRows: 1,
					enableAttachments: false,
					getComments: function(success, error) {
                                            $.ajax({
                                                type: 'post',
                                                url: '/mvc-application/getComments/',
                                                success: function(commentsArray) {

                                                var json_obj = $.parseJSON(commentsArray);

                                                   // alert(commentsArray);
                                                  //  var commentsArray = response;
                                                   // alert(commentsArray);
                                                    success(json_obj)
                                                }
                                                ,
                                                error: error
                                            });
					},
					postComment: function(data, success, error) {
                                             $.ajax({
                                                type: 'post',
                                                dataType: 'json',
                                                data: JSON.stringify(data),
                                                url: '/mvc-application/addComment/',
                                                cache: false,
                                                success: function(response) {
                                                    if(response.response=="OK"){
                                                         success(data)
                                                    }
                                                }
                                                ,
                                                error: error
                                            });
					},
					putComment: function(data, success, error) {
                                                $.ajax({
                                                type: 'post',
                                                dataType: 'json',
                                                data: JSON.stringify(data),
                                                url: '/mvc-application/editComment/',
                                                cache: false,
                                                success: function(response) {
                                                    if(response.response=="OK"){
                                                         success(data)
                                                    }
                                                }
                                                ,
                                                error: error
                                            });
					},
					deleteComment: function(data, success, error) {
						$.ajax({
                                                type: 'get',
                                                url: '/mvc-application/deleteComment?commentId='+data.id,
                                                cache: false,
                                                success: function(response) {
                                                    if(response=="OK"){
                                                         success(data);
                                                    }
                                                }
                                                ,
                                                error: error
                                            });
					},
					upvoteComment: function(data, success, error) {
						$.ajax({
                                                type: 'post',
                                                dataType: 'json',
                                                data: JSON.stringify(data),
                                                url: '/mvc-application/upvoteComment/',
                                                cache: false,
                                                success: function(response) {
                                                    if(response.response=="OK"){
                                                         success(data)
                                                    }
                                                }
                                                ,
                                                error: error
                                            });
					},
				});
  }


  function showAddNewsDialog(){
       var modal = new RModal(document.getElementById('add_news_dialog'), {
               beforeOpen: function(next) {
                    next();
                }
                , afterOpen: function() {
                    addNews();
                }
                , beforeClose: function(next) {
                    next();
                }
                , afterClose: function() {

                }

                // , content: 'Abracadabra'

                // , bodyClass: 'modal-open'
                // , dialogClass: 'modal-dialog-lg'
                // , dialogOpenClass: 'fadeIn'
                // , dialogCloseClass: 'fadeOut'

                // , focus: true
                // , focusElements: ['input.form-control', 'textarea', 'button.btn-primary']

                // , escapeClose: true
            });
            window.modal = modal;

            modal.open();
  }

  function showAddTopicDialog(){
      var modal_add_topic = new RModal(document.getElementById('add-topic-dialog'), {
               beforeOpen: function(next) {
                    next();
                }
                , afterOpen: function() {
                    addForumTopic(modal_add_topic);


                }
                , beforeClose: function(next) {
                    next();
                }
                , afterClose: function() {

                }

                // , content: 'Abracadabra'

                // , bodyClass: 'modal-open'
                // , dialogClass: 'modal-dialog-lg'
                // , dialogOpenClass: 'fadeIn'
                // , dialogCloseClass: 'fadeOut'

                // , focus: true
                // , focusElements: ['input.form-control', 'textarea', 'button.btn-primary']

                // , escapeClose: true
            });
            window.modal = modal_add_topic;

            modal_add_topic.open();
  }


  function addForumTopic(modal_add_topic){
       $("#save_topic").click(function() {
           var title = $("#add_topic_title").val();
           var description = $("#description_topic_title").val();

           $.ajax({
               url: "/mvc-application/forum/addTopic/",
               type: "POST",
               cache: false,
               data: {title: title,description:description}
                   }).done(function(data) {

                           console.log(data.response);
                        if(data.response==="OK"){
                        clearInputAddForumTopic();
                        getTopicForum();
                   }

               });
             modal_add_topic.close();
             //modal_add_topic.dialog.refresh();
       });

  }

function clearInputAddForumTopic(){
     $("#add_topic_title").val("");
     $("#description_topic_title").val("");


}

