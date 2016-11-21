/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function() {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {

        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            var data = {};
            data["name"] = $("input#name").val();
            data["email"] = $("input#email").val();
            data["phone"] = $("input#phone").val();
            data["message"] = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message

            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }

            $('#success').html('<div class="gif"><img src="../../static/gif/loading-small.gif" /></div>');
            $.ajax({
                url: "/mvc-application/contact/sendEmail/",
                type: "POST",
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false
                }).done(function(data) {
                   if(data.response==="OK"){
                   // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Twoja wiadomosc zostala wyslana. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                }else if(data.response==="FAIL"){
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Przepraszamy" + firstName + ", serwer poczty email nie odpowiada. Proszę spróbować później!");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                }
                });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});
