// GLOBAL VARIABLES
    // user info
    var firstName = '',
	    lastName = '',
		fullName = '',
	    leglalCompanyName = '', //Legal Business Name
		companyEmail = '',
		companyPhone = '',
		startDate = '',
		companyWebsite = '';
	
	// Employer identification number
	var ownerEIN = '',
		businessAddress = '',
		ownerRole = '',
		ownerCity = '',
		ownerState = '',
		ownerZipCode = '';

    var fullTimeEmployees2020,
        partTimeEmployees2020,
        fullTimeEmployees2021,
        partTimeEmployees2021;

		
    // report summary
	var LINE_27_941X_TTL = 0,
	    DATA_TTL = 0,
	    COMMISSION_TTL = 0;
    
	// report for each quarter
    let result_output = [];
	
	// sent email flag
	let email_sent_flag = false;
	
	var QuarterIndex = ["2020_Q2", "2020_Q3", "2020_Q4", "2021_Q1", "2021_Q2", "2021_Q3"];
	
	var todayDate = new Date().toJSON().slice(0,10).split('-').reverse().join('/'); // mm/dd/yyyyy
	

$(document).ready(function(){

    // build states options list
	var states_options_html = '<option value="" selected> - None - </option>';
	for (var stateID in stateNames) {
	    //console.log("ID: " + stateID);	
	    //console.log("name: " + stateNames[stateID]);	
		states_options_html += '<option value="' + stateID + '" >' + stateNames[stateID] + '</option>';
	}
	$('.group__input.required.state select').html(states_options_html);
    

	$('.roundes input').on('change' ,function(e){
		e.preventDefault();
		if ($(this).prop('checked') == true) {
			$('.step__rounds').removeClass("one__round");
			$('.step__rounds').removeClass("round__two");
			$('.step__rounds').removeClass("both");
			$('.step__rounds').removeClass("no__rounds");
			$('.step__rounds').addClass($(this).val());
		}
	});

	$('.erc__check input').on("change" ,function(e){
		e.preventDefault();

		$('.erc__check input').each(function(index,elem){
			if ($(elem).prop("checked") == true) {
				$(".check__refunds .elem__check[data-elem='"+ $(elem).attr("data-value") + "']").css("display" ,"flex")  ;
			} else {
				$(".check__refunds .elem__check[data-elem='"+ $(elem).attr("data-value") + "']").css("display" ,"none")  ;
			}
		});
	});
	$('.sb__button').on('click' ,function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
			$('.erc__box').css("display" ,"none");
			$('.refund__box').fadeIn(300);
		}
	});

	$('.cash__button').on("click" ,function(e){
		e.preventDefault();
		$('.main__step').css("display" ,"none");
		$('.erc__box').fadeIn(300);
	});


	$('.edit>a').on('click' ,function(e){
		e.preventDefault();
		$('.form__step').css("display" ,"none");
		$('.main__step').fadeIn(300);
		$(this).closest('.form__step').addClass("back");
		$('.main__step .next__buttons').addClass('pre');
	});


	$('.redirect__back').on("click" ,function(e){
		e.preventDefault();
		$(this).closest('.form__step').css("display" ,"none")
																.prev().fadeIn(300);
	});

	$('.refer__button').on("click" ,function(e){
		$('.form__step').css("display" ,"none");
		$(this).closest('.form__step').addClass("back");
		$('.form__step.refer').fadeIn(300);
	});
	$('.form__step.refer .back>a').on('click' ,function(e){
		e.preventDefault();
		$('.form__step').css("display" ,'none');
		$('.form__step.back').fadeIn(300);
	});

	$('.upload__docs>a').on('click' ,function(e){
		e.preventDefault();
		$('.claim__info').css('display' ,"none");
		$('.document__steps').fadeIn(300);
	});

	function checkQuarters(){
		$('.quarters__wrapper--checkboxes .check__box .elem__checkbox').each(function(index,elem){
			if ($(elem).find('input').prop("checked") == true) {
				$(".update__dropdown input[data-check='"+ $(elem).attr('data-check') +"']").prop("checked" ,false);
				$(".update__dropdown input[data-check='"+ $(elem).attr('data-check') +"']").click();
				$('.container__quarters > .elem__quarter').css('display' , 'none');
			} else {
				$(".update__dropdown input[data-check='"+ $(elem).attr('data-check') +"']").prop("checked" ,true);
				$(".update__dropdown input[data-check='"+ $(elem).attr('data-check') +"']").click();
				$('.container__quarters > .elem__quarter').css('display' , 'none');
			}
		
			let amount = 0;
			 $('.quarters__container>.elem__quarter').each(function(index,elem){
			 	if (!$(elem).hasClass("non__index")) {
			 		amount++;
			 	}
			 });
			$('.head__quarters>h6').text("You selected "+ amount +" quarters");
		});
	}
	let timer;
	$('.quarters__wrapper--checkboxes input').on("change", function () {
		var isFirst = true
		$('.quarters__wrapper--checkboxes .elem__checkbox').each(function (index, elem) {
			var quarterElement = $(".quarters__container>.elem__quarter." + $(elem).attr("data-check"));
			quarterElement.removeClass("filling");
			quarterElement.removeClass("will__filled");
			if ($(elem).find('input').prop('checked') == true) {
				quarterElement.removeClass("non__index");
				if (isFirst) {
					quarterElement.addClass("filling");
					isFirst = false;
				} else {
					quarterElement.addClass("will__filled");
				}
			} else {
				quarterElement.addClass("non__index");
			}
		});
		if (timer) {
			clearTimeout(timer);
			timer = setTimeout(function(){
				checkQuarters();	
				isFirst = true;
			}, 1000);
		} else {
			timer = setTimeout(function(){
				checkQuarters();
				isFirst = true;
			}, 1000);
		}
		
	});

	$('.refund__waiting>a').on("click" ,function(e){
		e.preventDefault();
		$(this).closest('.form__step').css("display" ,"none");
		$(this).closest(".form__step").next().fadeIn(300);
	});

	$('.refund__').on("click" ,function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
			$('.update__dropdown .dropdown__box ul li').each(function(index,elem){
				if ($(elem).find('input').prop('checked') == true) {
					$(".check__refunds .elem__check[data-elem='"+ $(elem).find('input').attr("data-check") +"]").css("display" ,'flex');
				} else {
					$(".check__refunds .elem__check[data-elem='"+ $(elem).find('input').attr("data-check") +"]").css("display" ,'none');
				}
			});
			$(this).closest('.form__step').css("display" ,"none");
			$('.refund__box').fadeIn(300);
			$('.update__dropdown .dropdown__box ul li').each(function(index,elem){
				if ($(elem).find("input").prop('checked') == true) {
					$(".check__refunds>.elem__check[data-elem='"+ $(elem).find('input').attr("data-check") +"']").css("display" ,"flex");
				} else{
					$(".check__refunds>.elem__check[data-elem='"+ $(elem).find('input').attr("data-check") +"']").css("display" ,"none");
				}
			});
		}
		
	});

	$('.employees__period input').on("change" ,function(e){
		if ($(this).prop('checked') == true) {
			$(this).closest('.employees__period').find("input").prop("checked" ,false);
			$(this).prop("checked" , true);
			if ($(this).attr("data-state") == "Yes") {
				$(this).closest('.elem__quarter').find(".owners").removeClass("disabled");
				$(this).closest('.elem__quarter').find(".owners .error").removeClass('error');
				$(this).closest('.elem__quarter').find(".owners .required").removeClass("disabled");
			} else{
				$(this).closest('.elem__quarter').find(".owners .required").addClass("disabled");
				$(this).closest('.elem__quarter').find(".owners").addClass("disabled");			
				$(this).closest('.elem__quarter').find(".owners .error").removeClass('error')
			}
		} else{
			$(this).prop("checked" ,true);
		}
	});


	

	$('.droppable a').on("click" ,function(e){
		e.preventDefault();
		$(this).closest('.droppable').find("input").click();
	});
	$('.droppable input').on('change', function () {
		$el = $(".js-file-list").remove();

		for (var file of this.files) {
			var $el = $("<p class='js-file-list' />");
			//$el = $(".js-file-list")[0];
			$el.text( file.name);
			$('.droppable').append($el);
		}
		
	});




	$('.document__button>a').on('click' ,function(e){
		e.preventDefault();
		$(this).closest('.form__step').css("display" , "none")
																.next('.form__step').fadeIn(300);
	});


	var signature = false;
	function allowClaim(){
		
		if (signature == true && $('.check__refunds .elem__check.active').length != 0 && $('.refund__check input').prop('checked') == true) {
			if ($('.submit__refund button').hasClass("disabled"))
			    $('.submit__refund button').removeClass("disabled");
		} else {
			if (!$('.submit__refund button').hasClass("disabled"))
			    $('.submit__refund button').addClass("disabled");
		}
		/*
		if (signature == true &&  $('.refund__check input').prop('checked') == true) {
			if ($('.submit__refund button').hasClass("disabled"))
			    $('.submit__refund button').removeClass("disabled");
		} else {
			if (!$('.submit__refund button').hasClass("disabled"))
			    $('.submit__refund button').addClass("disabled");
		}
		*/
	}



	$('.offer__modal>a').on('click' ,function(e){
		e.preventDefault();
		$(this).closest('.modal__wrapper').fadeOut(300);
		$('body,html').css('overflow-y' ,"initial");
	});

	$('.submit__refund button').on("click" , function(e){
		e.preventDefault();
		$('.offer__modal').closest('.modal__wrapper').fadeIn(300);
		$("body,html").css("overflow-y" ,"hidden");
	});
	$('.offer__modal .decline').on("click" ,function(e){
		e.preventDefault();
		$('.refund__box').css("display" ,"none");
		$('.claim__info').fadeIn(300);
		$(this).closest(".modal__wrapper").fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});
	$('.offer__modal .submit').on("click" ,function(e){
		e.preventDefault();
		$('.refund__box').css("display" ,"none");
		$('.claim__info').fadeIn(300);
		$(this).closest(".modal__wrapper").fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});

	$('.refund__info').on("click" ,function(e){
		e.preventDefault();
		$('.service__agreement').closest('.modal__wrapper').fadeIn(300);
		$('body,html').css("overflow-y" ,"hidden");
	});
	$('.refund__check input').on("change" , function(e){
		if ($(this).prop('checked') == true) {
			$('.service__agreement').closest('.modal__wrapper').fadeIn(300);
			$('body,html').css("overflow-y" ,"hidden");
			allowClaim();
		} else {
			allowClaim();
		}
	});
	$('.service__agreement .confirm').on('click' ,function(e){
		e.preventDefault();
		
		$('.refund__check input').prop("checked" ,true);
		$(this).closest('.modal__wrapper').fadeOut(300);
		allowClaim();
		$('body,html').css("overflow-y" , "initial");
	});
	$('.service__agreement .decline').on('click' ,function(e){
		e.preventDefault();

		$(this).closest('.modal__wrapper').fadeOut(300);
		$('.refund__check input').prop("checked" ,false);
		allowClaim();
		$('body,html').css("overflow-y" , "initial");
	});

	if ($('.signature__box').length) {
		$(window).on("resize" ,function(){
			if ($(window).width() > 767) {
				var canvas = $('.signature__box').jqSignature({
					width:360,
					height:75
				});
			} else{
				var canvas = $('.signature__box').jqSignature({
					width:290,
					height:75
				});
			}
		});
		if ($(window).width() > 767) {
				var canvas = $('.signature__box').jqSignature({
					width:360,
					height:75
				});
			} else{
				var canvas = $('.signature__box').jqSignature({
						width:290,
						height:75
					});
			}
		$('.signature__box a').on("click" ,function(e){
			e.preventDefault();
			$(canvas).jqSignature('clearCanvas');
			signature = false;
		});
		$(canvas).on("jq.signature.changed" ,function(e){
			signature = true;
			allowClaim();
		});
	}

	function calculateValue(){
		let counter = 0;
		$('.check__refunds>.elem__check.active').each(function(index,elem){
			counter = +counter + +$(elem).attr("data-value");
		});
		return "$" +  counter.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}


	$('.check__refunds>.elem__check').on('click' ,function(){
		$(this).toggleClass('active');
		if ($(this).hasClass('active')) {
			$(this).find("input").prop('checked' ,true);
		} else{
			$(this).find("input").prop('checked' ,false);
		}
		$('.total span').text(calculateValue());
		allowClaim();
	});



	$('.agreement__box>a').on("click" ,function(e){
		e.preventDefault();
		if ($(".refund__check").length) {
			$('.refund__check input').prop("checked" ,false);
		}
		$(this).closest('.modal__wrapper').fadeOut(300);
		$('body,html').css("overflow-y" ,"initial");
	});


	function findButtonText(){
		let indexMain;
		
		$('.quarters__container>.elem__quarter:not(.non__index):not(.filled').each(function(index,elem){
			if ($(elem).hasClass("filling")) {
				indexMain = index;
			}
		});
		$('.quarters__container>.elem__quarter:not(.non__index):not(.filled').each(function(index,elem){
			if (index == indexMain + 1) {
				let newText = $(elem).find(".left__desc>span").text();
				$('.controls__fill>.next__quarter>p>span').text(newText);
			}
		});
	}

	function checkQuarter(currentStep){
		var errors = 0;
		$(currentStep).find(".required").each(function(index,elem){
			if (!$(elem).hasClass("disabled")) {
				if ($(elem).hasClass('date__picker')) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('double__check')) {
				if ($(elem).find("input:checked").length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('value')) {
				if ($(elem).find("input").val().length < 3) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('employees')) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} else {
					if ($(elem).find('input').val() < 0 || $(elem).find("input").val()  > 9999) {
						$(elem).addClass("error");
						errors++;
						$(elem).find(">label").text('Value must be between 0 and 999');
					}
				}
			}
			if ($(elem).hasClass("check__box")) {
				if ($(elem).find('input:checked').length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass("impact")) {
				if ($(elem).find('input:checked').length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(".impact__container>label").text('This field is required');
				}
			}
			if ($(elem).hasClass("regular")) {
				if ($(elem).find("input").val().length < 2) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} 
			}
			if ($(elem).hasClass("email")) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} else{
					if (!validateEmail($(elem).find("input").val())) {
						$(elem).removeClass('filled');
						$(elem).addClass("error");
						errors++;
						$(elem).find(">label").text('Please input valid email');
					}
				}
			}
			if ($(elem).hasClass("phone")) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} 
			}
			}
			
		});
		if (errors != 0) {
			return false;
		} else {
			return true;
		}
	}

	$('body').on("click" , ".elem__quarter.filled" ,function(e){
		e.preventDefault();
		if (!$(this).hasClass("filling")) {
			$('.container__quarters>.elem__quarter').css("display" , "none");
			$('.container__quarters>.elem__quarter.' + $(this).attr("data-elem")).fadeIn(300);
			if ($('.elem__quarter.filling').length) {
				if (checkQuarter($('.container__quarters>.elem__quarter.' + $('.elem__quarter.filling').attr('data-elem'))) == true) {
					$('.elem__quarter.filling').removeClass('filling')
																	  .addClass("filled")
																	  .find(".left__desc>p span").text('Submited');
				} else {
					$('.elem__quarter.filling').removeClass("filling")
																	  .addClass('will__filled')
																	  .find(".left__desc>p span").text('Will be filled in next step');
				}
			}
			$(this).removeClass("filled");
			$(this).addClass("filling");
			$(this).find(".left__desc>p span").text('You currently filling ...');
			
			if (counter == 0) {
				$('.controls__fill>.next__step').css('display'  , "inline-flex");
				$('.controls__fill>.next__quarter').css("display" ,"none");
			}
		} 
		findButtonText();
	});
	$('.controls__fill>.next__quarter').on('click' ,function(e){
		e.preventDefault();
		if (checkQuarter($(".container__quarters>.elem__quarter." + $('.quarters__container>.filling').attr("data-elem"))) == true) {
			
				$('.quarters__container .filling').removeClass("filling")
																		  .addClass("filled")
																		  .find(".left__desc>p>span").text("Submited");
			    
			
			let result = 0;
			$('.quarters__container>.elem__quarter').each(function(index,elem){
				if (result == 0) {
					if (!$(elem).hasClass("non__index")) {
						if ($(elem).hasClass("will__filled")) {
							result = 1;
							$(elem).removeClass("will__filled")
										   .addClass("filling")
										   .find(".left__desc>p span").text("You currently filling ...")
						    $('.container__quarters>.elem__quarter').css("display" , "none");
						    $('.container__quarters>.elem__quarter.' + $('.quarters__container .filling').attr("data-elem")).fadeIn(150);
							$('.container__quarters>.elem__quarter.' + $('.quarters__container .filling').attr("data-elem")).find(".error").removeClass('error');
						    if ($('.quarters__container .filling').next().length == 0) {
						    	$('.controls__fill>.next__quarter').css("display" ,  'none');
						    	$('.controls__fill>.next__step').css("display" , "flex");
								}
							}
					}
				}
			});
			
		}
		if ($('.quarters__container .filling').next().length == 0 && $('.quarters__container .will__filled').next().length == 0) {
			$('.controls__fill>.next__quarter').css("display" ,  'none');
			$('.controls__fill>.next__step').css("display" , "flex");
			}
		
		findButtonText();
		$('html').animate({ 
	    	    scrollTop: $(".form__step:visible").offset().top 
	        },600
	        );
	});
	$('.controls__fill>.next__step').on("click" ,function(e){
		e.preventDefault();
		if (checkQuarter($(".container__quarters>.elem__quarter." + $('.quarters__container>.filling:not(.non__index)').attr("data-elem"))) == true) {
			if ($('.step__rounds').hasClass("no__rounds")) {
				$(this).closest('.form__step').css("display" ,"none");
				$('.refund__box').fadeIn(300);
				} else{
					$(this).closest('.form__step').css("display" ,"none")
																			.next(".form__step").fadeIn(300);
					if ($('.step__rounds').hasClass("one__round")) {
						$('.double__group.round__two').css('display' ,"none");
						$('.double__group.round__one').css('display' ,"grid");
					}	
					if ($('.step__rounds').hasClass("round__two")) {
						$('.double__group.round__two').css('display' ,"grid");
						$('.double__group.round__one').css('display' ,"none");
					}	
					if ($('.step__rounds').hasClass("both")) {
						$('.double__group.round__two').css('display' ,"grid");
						$('.double__group.round__one').css('display' ,"grid");
					}														
				}
		}
	});

	$('.update__dropdown .dropdown__box input').on("change" ,function(){
		if ($(this).prop('checked') == false) {
			$('.quarters__container>.elem__quarter.' + $(this).attr("data-check")).css("display"  , "none")
																										.addClass("non__index");
			$('.container__quarters>.elem__quarter.' + $(this).attr("data-check")).css("display" , "none");
			$('.quarters__container>.elem__quarter.non__index.filling').each(function(index,elem){
				if (checkQuarter($(".container__quarters>.elem__quarter." + $(elem).attr("data-elem"))) == true) {
					$(elem).removeClass("filling")
								   .addClass('filled')
								   .find(".left__desc>p span").text("Submited")
				}
			})
		} else{

			$('.quarters__container>.elem__quarter:not(.non__index)').each(function(index,elem){
				if ($(elem).hasClass('filling')) {
					if (checkQuarter($(".container__quarters>.elem__quarter." + $('.quarters__container>.filling:not(.non__index)').attr("data-elem"))) == true) {
						$(elem).removeClass("filling")
									  .addClass("filled")
									  .find(".left__desc>p span").text("Submited");
						$('.container__quarters>.elem__quarter.'  + $(elem).attr('data-check')).css("display" ,"none");
					} else{
						$(elem).removeClass("filling")
									  .addClass('will__filled')
									  .find(".left__desc>p span").text('Will be filled in next step');
					  $('.container__quarters>.elem__quarter.'  + $(elem).attr('data-check')).find(".errors").removeClass('errors');
						$('.container__quarters>.elem__quarter.'  + $(elem).attr('data-check')).css("display" ,"none");
					}
				}
			});
			$('.container__quarters>.elem__quarter').css('display' ,'none');
			$('.quarters__container>.elem__quarter.' + $(this).attr("data-check")).css("display"  , "flex")
																									   .removeClass('non__index');
			$('.elem__quarter .error').removeClass('error');




		}
		if ($('.quarters__container>.elem__quarter.filling').length == 0) {
			$('.container__quarters>.elem__quarter').css('display' ,"none");
		}
		$('.elem__quarter .error').removeClass('error');
		let counter = 0;
		$('.update__dropdown .checkbox__wrapper').each(function(index,elem){
			if ($(elem).find("input").prop('checked') == false) {
				counter++;
			}
		});
		if (counter == $('.update__dropdown .checkbox__wrapper').length) {
			$('.quarters__container').css('display' ,"none");
			$('.container__quarters').css('margin-top' ,"45px");
		} else{
			$('.quarters__container').css('display' ,"grid");
			$('.container__quarters').css('margin-top' ,"90px");
		}
		
		let counterActiveEls = $(".quarters__container>.elem__quarter:not(.non__index)").length;
		if (counterActiveEls == $('.quarters__container>.elem__quarter.filled:not(.non__index)').length) {

			$(".quarters__container>.elem__quarter:not(.non__index)").each(function(index,elem){
				if (index + 1 == counterActiveEls) {
					$(elem).removeClass('filled')
								   .addClass("filling")
								   .find(".left__desc>p span").text("You currently filling ...");

					$('.container__quarters>.elem__quarter.' + $(elem).attr("data-elem")).fadeIn(300);
					$('.controls__fill>.next__quarter').css("display" ,'none');
					$('.controls__fill>.next__step').css("display"  ,  "flex");
				}
			});
		} else {
			let stopCounter = 0;
			$(".quarters__container>.elem__quarter:not(.non__index)").each(function(index,elem){
				if (stopCounter == 0) {
					if (!$(elem).hasClass("filled")) {
						if ($(elem).hasClass("filling") || $(elem).hasClass("will__filled")) {
							stopCounter = 1;
							$(elem).removeClass('will__filled')
								   .addClass("filling")
								   .find(".left__desc>p span").text("You currently filling ...");

							$('.container__quarters>.elem__quarter.' + $(elem).attr("data-elem")).fadeIn(300);
							
						}
					}
				}
			});
			if ($(".quarters__container>.elem__quarter.will__filled:not(.non__index)").length == 0) {
				$('.controls__fill>.next__quarter').css("display" ,'none');
				$('.controls__fill>.next__step').css("display"  ,  "flex");
			} else {
				$('.controls__fill>.next__quarter').css("display" ,'flex');
				$('.controls__fill>.next__step').css("display"  ,  "none");
			}
		}
		
		findButtonText();
	});


















	if ($("[data-toggle='datepicker']").length) {
		$('[data-toggle="datepicker"]').datepicker({
			autoHide:true
		});
	}


	


	$('.update__dropdown>a').on("click" ,function(e){
		e.preventDefault();
		if ($(this).hasClass('active')) {
			$(this).removeClass("active");
			$(this).closest('.update__dropdown').find('.dropdown__box').fadeOut(150);
		} else {
			$(this).closest('.update__dropdown').find('.dropdown__box').fadeIn(150);
			$(this).addClass("active");
		}
	});
	$(document).click(function(event) { 
	  var $target = $(event.target);
	  if(!$target.closest('.update__dropdown').length) {
	  	$('.update__dropdown>a').removeClass('active');
	  	$('.update__dropdown .dropdown__box').fadeOut(150);
	  }        
	});


	 function validateEmail($email) {
	  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	  return emailReg.test( $email );
	}
	$('body').on("change"   , ".error input" ,function(){
		$(this).closest(".error").removeClass('error');
	});
	$('body').on("change"   , ".error .elem__checkbox input" ,function(){
		$(this).closest(".error").removeClass('error');
	});
	$('.phone>input').mask("999-999-9999");
	$('.ein>input').mask("99-9999999");
	$(document).on("input", ".numeric input", function() {
	    this.value = this.value.replace(/\D/g,'');
	});

	$('input.value').on("input", function () {
		let pattern =  /\d+\.{0,1}(\d+)?/;
		 this.value = this.value.match(pattern)[0];

		$(this).val("$"+this.value ); 
	});
	$('input.value').on("blur" ,function(e){
		if ($(this).val().length  == 1) {
			$(this).val("");
		}
	});
	

	$('.check__v--field .checkbox__wrapper input').on('change' ,function(){
		if ($(this).prop('checked') == true) {
			$(this).closest(".elem__checkbox").find(".group__input").fadeIn(150);
		} else{
			$(this).closest(".elem__checkbox").find(".group__input").fadeOut(150);
			let currentCheck = $(this).closest(".elem__checkbox");
			setTimeout(function(){
				$(currentCheck).find(".group__input>input").val("");
				$(currentCheck).find(".group__input").removeClass("error");
			}, 150);
		}
	});


	function checkValidation(currentStep){
		var errors = 0;
		$(currentStep).find(".required:visible").each(function(index,elem){
			if ($(elem).hasClass("ppp1")) {
				if ($(elem).find("input").val().substr(1).replace(/,/g, '') > 10000000) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('Maximum amount $10,000,000');
				}
			}
			if ($(elem).hasClass("ppp2")) {
				if ($(elem).find("input").val().substr(1).replace(/,/g, '') > 2000000) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('Maximum amount $2,000,000');
				}
			}
			if ($(elem).hasClass('date__picker')) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('double__check')) {
				if ($(elem).find("input:checked").length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('value')) {
				if ($(elem).find("input").val().length < 3) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass('employees')) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} else {
					if ($(elem).find('input').val() < 0 || $(elem).find("input").val()  > 9999) {
						$(elem).addClass("error");
						errors++;
						$(elem).find(">label").text('Value must be between 0 and 999');
					}
				}
			}
			if ($(elem).hasClass("check__box")) {
				if ($(elem).find('input:checked').length == 0) {
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				}
			}
			if ($(elem).hasClass("regular")) {
				if ($(elem).find("input").val().length < 2) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} 
			}
			if ($(elem).hasClass("email")) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} else{
					if (!validateEmail($(elem).find("input").val())) {
						$(elem).removeClass('filled');
						$(elem).addClass("error");
						errors++;
						$(elem).find(">label").text('Please input valid email');
					}
				}
			}
			if ($(elem).hasClass("phone")) {
				if ($(elem).find("input").val().length == 0) {
					$(elem).removeClass('filled');
					$(elem).addClass("error");
					errors++;
					$(elem).find(">label").text('This field is required');
				} 
			}
		});
		if (errors != 0) {
			return false;
		} else {
			return true;
		}
	}

	$(".group__controls .submit__button").on("click" ,function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
			
		}
	});
	$('.group__controls .submit__details').on('click' , function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
				window.location.href = $(this).attr("href");
		}
	});
	$('.group__controls .next__buttons').on("click" ,function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
			if (!$(this).hasClass("pre")) {
				$(this).closest('.form__step').css("display" ,"none")	
																.next('.form__step').fadeIn(300);
			$('html').animate({ 
	    	    scrollTop: $(".form__step:visible").offset().top 
	        },600
	        );
			console.log("FIRST");
			} else{
				$(this).closest('.form__step').css("display" ,"none");
				$('.form__step.back').fadeIn(300);
				$('.back').removeClass("back");
				$(".next__buttons").removeClass('pre');
				$('html').animate({ 
		    	    scrollTop: $(".form__step:visible").offset().top 
		        },600
		        );
				console.log("SECOND");
			}
			
			firstName = $('.form__step.main__step .group__input.required.regular:eq(0) input').val();
			lastName = $('.form__step.main__step .group__input.required.regular:eq(1) input').val();
			leglalCompanyName = $('.form__step.main__step .group__input.required.regular:eq(2) input').val();
			companyEmail = $('.form__step.main__step .group__input.required.email input').val();
			companyPhone = $('.form__step.main__step .group__input.required.phone input').val();
			companyWebsite = $('.form__step.main__step .double__group:eq(2) .group__input:eq(1) input').val();
			startDate = $('.form__step.main__step .group__input.employees input').val();
 
			console.warn("NEXT PAGE");
			console.log(companyEmail);
			console.log(companyPhone);
			//Legal Company Name
			console.log(leglalCompanyName);
			console.log(firstName);
			console.log(lastName);
			console.log(startDate);
			console.log(companyWebsite);
			
			fullName = firstName + ' ' + lastName;
			
			ownerEIN = $('.group__input.required.regular.ein input').val();
		    businessAddress = $('.group__input.required.regular.biz.adr input').val();
		    ownerRole = $('.group__input.required.regular.role input').val();
		    ownerCity = $('.group__input.required.city input').val();
		    //ownerState = $('.group__input.required.state input').val();
			ownerState = $('.group__input.required.state select').val();
		    ownerZipCode = $('.group__input.required.regular.zip input').val();
			
			$('.form__step .business__details ul li:nth-child(1) span').text(firstName);
			$('.form__step .business__details ul li:nth-child(2) span').text(lastName);
			$('.form__step .business__details ul li:nth-child(3) span').text(ownerRole);  //  Role  -> CEO
			$('.form__step .business__details ul li:nth-child(4) span').text(leglalCompanyName);
 			$('.form__step .business__details ul li:nth-child(5) span').text(businessAddress);  //  Business Address
			$('.form__step .business__details ul li:nth-child(6) span').text(ownerCity);  //  City
			$('.form__step .business__details ul li:nth-child(7) span').text(ownerState);  //  State
			$('.form__step .business__details ul li:nth-child(8) span').text(ownerZipCode);  //  ZIP code
			$('.form__step .business__details ul li:nth-child(9) span').text(companyPhone);
			$('.form__step .business__details ul li:nth-child(10) span').text(ownerEIN);  //  EIN -> Employer identification number
			
			fullTimeEmployees2020 = $('input#full-time-staff-2020').val();
            partTimeEmployees2020 = $('input#part-time-staff-2020').val();
            fullTimeEmployees2021 = $('input#full-time-staff-2021').val();
            partTimeEmployees2021 = $('input#part-time-staff-2021').val();
			
			if(fullTimeEmployees2020 != "") {
			    $('.form__step .business__details ul li:nth-child(11) span').text(fullTimeEmployees2020);
			    $('.form__step .business__details ul li:nth-child(12) span').text('$' + (parseInt(fullTimeEmployees2020) * 5000));
			}
			if(partTimeEmployees2020 != "") {
			    $('.form__step .business__details ul li:nth-child(13) span').text(partTimeEmployees2020);
			    $('.form__step .business__details ul li:nth-child(14) span').text('$' + (parseInt(partTimeEmployees2020) * 2500));
			}
			if(fullTimeEmployees2021 != "") {
			    $('.form__step .business__details ul li:nth-child(15) span').text(fullTimeEmployees2021);
			    $('.form__step .business__details ul li:nth-child(16) span').text('$' + (parseInt(fullTimeEmployees2021) * 21000));
			}
			if(partTimeEmployees2021 != "") {
			    $('.form__step .business__details ul li:nth-child(17) span').text(partTimeEmployees2021);
			    $('.form__step .business__details ul li:nth-child(18) span').text('$' + (parseInt(partTimeEmployees2021) * 7000));
		    }
			
			//$('.form__step .business__details ul li:nth-child() span').text();
		}
	});


	$('.group__controls .redirect__button').on("click" ,function(e){
		e.preventDefault();
		if (checkValidation($(this).closest('.form__step')) == true) {
			window.location.href = $(this).attr("href");
		}
	});



	$('.group__controls .back__button>a').on("click" ,function(e){
		e.preventDefault();

		if (!$(this).hasClass('redirect')) {
			$(this).closest(".form__step").css("display" ,'none')
																 .prev(".form__step").fadeIn(300);
		$('html').animate({ 
	    	    scrollTop: $(".form__step:visible").offset().top 
	        },600
	        );
		}
		
	});

	//calculator
	let obj = {};
	
	var QuarterDates = ["06/30/2020", "09/30/2020", "12/30/2020", "03/31/2021", "06/30/2021", "09/30/2021"],
		VALIDATION = [0, 0, 0, 0, 0, 0],
		PPP = [0, 0, 0, 0, 0, 0];
	
	result_output = [];
	    

	$('#claimIt').click(function () {
		$('.dropdown__box ul input:checked').each(function () {
			var text = $(this).attr('data-check');
			obj[text] = {
				employeesWorked: null,
				totalWages: null,
				w2Period: {
					ownersW2: 0,
					wagesW2: 0
				}
			};
		});
	})


	$('.dropdown__box ul input').change(function () {
		if (!$(this).is(':checked')) {
			var text = $(this).attr('data-check');;
			delete obj[text];
		}
		if ($(this).is(':checked')) {
			var text = $(this).attr('data-check');
			obj[text] = {
				employeesWorked: null,
				totalWages: null,
				w2Period: {
					ownersW2: 0,
					wagesW2: 0
				}
			};
		}
	});

	const showResult = () => {
		result_output = [];
		
		var size = $('.check__refunds .elem__check').length
		let totalRefound = 0;
		
		var PPP1_amount = 0; // Round 1
		var PPP2_amount = 0; // Round 2
		var PPP1_date = $('.double__group.round__one .group__input.required.date__picker input').val(); // Round 1
		var PPP2_date = $('.double__group.round__two .group__input.required.date__picker input').val(); // Round 2
		
		var getPPP1val = $('.group__input.required.employees.ppp1.value input').val();
		var getPPP2val = $('.group__input.required.employees.ppp2.value input').val();
		if( getPPP1val !== "" )
		    PPP1_amount = parseFloat((getPPP1val).replace(/[,|$]/g, ""));
		if( getPPP2val !== "" )
		    PPP2_amount = parseFloat((getPPP2val).replace(/[,|$]/g, ""));
	    
		var ppp_summ_ref = 0,
            ppp_summ_cmp = 0;	
		
		/*
		console.log("PPP1_amount: " + PPP1_amount);
		console.log("PPP2_amount: " + PPP2_amount);
		console.log("PPP1_date: " + PPP1_date);
		console.log("PPP2_date: " + PPP2_date);
		if( PPP1_date === "" )
			console.log("PPP1 date empty!");
		if( PPP2_date === "" )
			console.log("PPP2 date empty!");
		*/
		
		var curr_PPP_date = "";
		var PPP_amount_ttl = PPP1_amount + PPP2_amount;
		
		// Total Results
		LINE_27_941X_TTL = 0;
	    DATA_TTL = 0;
	    COMMISSION_TTL = 0;

        // Non Refoundable Taxes -> for each Quarter
		for (let i = 1; i <= size; i++) {
			let key = `elem${i}`;
			if (key in obj) {
				
				
				let NonRefundableTaxes = 0,
				    ownershipWages = 0,
					//ownersCount = 0,
				    qualifiedWages = 0,
					needValidResult1 = 0,
					MAXIMUM = 0,
					RefundablePortionResult1 = 0,
					RefundablePortionResult3 = 0,
					Total_ERC_Resul2 = 0;
				let employeesWorked = parseInt(obj[`elem${i}`].employeesWorked);
				let ttlWages = parseFloat((obj[`elem${i}`].totalWages).replace(/[,|$]/g, ""));
				let perc = ttlWages;
				if(obj[`elem${i}`].w2Period.wagesW2 !== "")
				    ownershipWages = parseFloat((obj[`elem${i}`].w2Period.wagesW2).replace(/[,|$]/g, ""));
				//obj[`elem${i}`].w2Period.ownersW2
				
				if (i === 1 || i === 2 || i === 3) {
					perc *= 0.064;     // % 6.40     *     DATA (941 5A)
				} else {
					perc *= 0.0145;    // % 1.45     *     DATA (941 5A)
				}
				
				NonRefundableTaxes = perc;
				totalRefound += perc;
				let elements = $('.check__refunds .elem__check');
				let indexElement = i - 1;
				perc = Math.round(perc);  // Non Refundable Taxes 
				$(elements[indexElement]).attr('data-value', perc);
				$(elements[indexElement]).find('.left__check p').text('$' + addCommas(perc));
				
				
				if(PPP1_date !== "" && i === 1 ) {
				    if(DateCompare(PPP1_date,QuarterDates[0])) {
	                    ppp_summ_ref = ttlWages - ownershipWages;
	                    if( ppp_summ_ref < PPP1_amount)
		                    PPP[0] = -ppp_summ_ref/2;
		                else 
		                    PPP[0] = -PPP1_amount/2;
					}
			    }
				
				if(PPP1_date !== "" && ( i === 2 ||  i === 3 )) {
					ppp_summ_ref = PPP1_amount; 
					
					if(DateCompare(PPP1_date,QuarterDates[indexElement])) {
						for (let j = 0; j < indexElement; j++) {
		                    ppp_summ_ref += PPP[j];
		                }
						
						if(ppp_summ_ref > 0) {
		                    ppp_summ_cmp = ttlWages - ownershipWages;
		                    if(ppp_summ_ref > ppp_summ_cmp)
			                    PPP[indexElement] = -ppp_summ_cmp;
			                else
			                    PPP[indexElement] = -ppp_summ_ref;
		               }
					}
				}
				
				if(PPP2_date !== "" && ( i > 3 )) {
					ppp_summ_ref = PPP_amount_ttl;
					
					if(DateCompare(PPP2_date,QuarterDates[indexElement])) {
						for (let j = 0; j < indexElement; j++) {
		                    ppp_summ_ref += PPP[j];
		                }
						
						if(ppp_summ_ref > 0) {
		                    ppp_summ_cmp = ttlWages - ownershipWages;
		                    if(ppp_summ_ref > ppp_summ_cmp)
			                    PPP[indexElement] = -ppp_summ_cmp;
			                else
			                    PPP[indexElement] = -ppp_summ_ref;
		               }
					}
				}
				
				
				qualifiedWages = ttlWages - ownershipWages + PPP[indexElement];
				
				if (i === 1 || i === 2 || i === 3) {
					needValidResult1 = qualifiedWages * 0.5;  // %50
				} else {
					needValidResult1 = qualifiedWages * 0.7;  // %70
				}
				
				VALIDATION[indexElement] = needValidResult1 / employeesWorked;
				
				if (i === 1)
					MAXIMUM = ( ( VALIDATION[0] > 5000 ) ? 5000 : VALIDATION[0] );
				
				if (i === 2) {
					if( VALIDATION[0] < 5000 ) {
                         MAXIMUM = ( ( ( VALIDATION[0] + VALIDATION[1] ) < 5000 ) ? VALIDATION[1] : 5000 - VALIDATION[0]  );
                    }
				}
				
				if (i === 3) {
					if( ( VALIDATION[0] + VALIDATION[1] ) < 5000 ) {
                        MAXIMUM = ( ( ( VALIDATION[0] + VALIDATION[1] + VALIDATION[2] ) < 5000 ) ? VALIDATION[2] : 5000 - VALIDATION[0] - VALIDATION[1]  );
                    }
				}
				
				if (i > 3) {
                    MAXIMUM = ( ( VALIDATION[indexElement] > 10000 ) ? 7000 : VALIDATION[indexElement] * 0.7 );
				}
				
				Total_ERC_Resul2 = MAXIMUM * employeesWorked;
				
				RefundablePortionResult1 = needValidResult1 + NonRefundableTaxes;
	            RefundablePortionResult3 = NonRefundableTaxes - needValidResult1;
				
				DATA_TTL += needValidResult1;
	            LINE_27_941X_TTL += Total_ERC_Resul2;
				
				result_output[QuarterIndex[indexElement]] = {
					"index": indexElement,
					"PPP": PPP[indexElement],
					"NonRefundableTaxes": NonRefundableTaxes,
					"NEEDS_VALIDATION_Result1": needValidResult1,
					"QualifiedWages": qualifiedWages,
					"VALIDATION": VALIDATION[indexElement],
					"MAXIMUM": MAXIMUM,
					"RefundablePortionResult1": RefundablePortionResult1,
					"RefundablePortionResult3": RefundablePortionResult3,
					"ttlERCresult2": Total_ERC_Resul2,
					"COMMISSION": 0
				};
				
				
			} else {
				continue
			}
		}
	
		totalRefound = Math.round(totalRefound);
		$('.totalRefound').text('$' + addCommas(totalRefound));
		
		var comm_coef = 100 * ((DATA_TTL < 200000 ) ? 0.185 : 0.15);
	    var COMMISSION = 0;
		
		for (let n = 0; n < result_output.length; n++) {
            COMMISSION = Math.round(result_output[n].ttlERCresult2 * comm_coef) / 100 ;
			result_output[n].COMMISSION = COMMISSION;
	        COMMISSION_TTL += COMMISSION;
			//console.log(result_output[n]);
			//console.warn(result_output[n].ttlERCresult2);
        }
		
		
		console.warn("- RESULTS -");
		console.log(result_output);
		console.log("DATA Total: " + DATA_TTL);
		console.log("LINE 27 941X Total: " + LINE_27_941X_TTL);
		console.log("COMMISSION_ Total: " + COMMISSION_TTL);
		
		// checking for final submit
		/*
		var radioValuePPP = $("input[name='ppp']:checked").val();
		
		if(radioValuePPP == "no__rounds") {
			console.warn("final submit for sending e-mail");
			console.log("No Rounds PPP");
			console.log(companyEmail);
		} else {
			if((( getPPP1val !== "" ) || ( getPPP1val !== "" )) && (( PPP1_date !== "" ) || ( PPP2_date !== "" ))) {
				console.warn("final submit for sending e-mail");
			    console.log("Rounds PPP is present");
				console.log(companyEmail);
			}
		}
		*/
	
	}



	$('#SubmitBtn').click(function () {
		var size = $('.container__quarters .elem__quarter').length
		for (let i = 1; i <= size; i++) {
			let key = `elem${i}`;
			if (key in obj) {
				obj[`elem${i}`].employeesWorked = $(`#elem${i} .group__input.employees.required input`).val();
				obj[`elem${i}`].totalWages = $(`#elem${i} .group__input.required.value input`).val();
				obj[`elem${i}`].w2Period.ownersW2 = $(`#elem${i} .owners .group__input.employees.required input`).val();
				obj[`elem${i}`].w2Period.wagesW2 = $(`#elem${i} .owners .group__input.required.value input`).val();
			} else {
				continue;
			}
		}
		console.warn("- On Submit -")
		console.log(obj)
		
		showResult()
	})

	$('#SubmitBtnQuarter').click(function () {
		var size = $('.container__quarters .elem__quarter').length
		for (let i = 1; i <= size; i++) {
			let key = `elem${i}`;
			if (key in obj) {
				obj[`elem${i}`].employeesWorked = $(`#elem${i} .group__input.employees.required input`).val();
				obj[`elem${i}`].totalWages = $(`#elem${i} .group__input.required.value input`).val();
				obj[`elem${i}`].w2Period.ownersW2 = $(`#elem${i} .owners .group__input.employees.required input`).val();
				obj[`elem${i}`].w2Period.wagesW2 = $(`#elem${i} .owners .group__input.required.value input`).val();
			}
		}
		console.warn("- Submit Quarter -")
		console.log(obj)
	})

	function addCommas(number) {
		let numStr = String(number);
		if (numStr.length <= 3) {
			return numStr;
		} else {
			let numArr = numStr.split('');
			let commaIndex = numArr.length - 3;
			while (commaIndex > 0) {
				numArr.splice(commaIndex, 0, ',');
				commaIndex -= 3;
			}
			return numArr.join('');
		}
	}
	
	function DateCompare(d1,d2) {
        let ref_date = new Date(d1).getTime();
        let cmp_date = new Date(d2).getTime();
        if(ref_date < cmp_date)
            return true;
        else
            return false;
    }


	$('#showResult').click(function () {
		showResult()
	})

	let claimAmount = null;

	$('.submit__refund button').click(function(){
		claimAmount = $('.refund__box .total p span').text()
		$('.amount__desc p').text(claimAmount)
		let getValue = parseFloat((claimAmount).replace(/[,|$]/g, ""))
		let serviceFee = getValue * 0.15; //
		let savingFee = getValue * 0.1;
		let cashAdv = getValue * 0.235; //
		let refoundResult = getValue - serviceFee - cashAdv;
		// show in page
		$('.amount__desc p').text(claimAmount);
		$('.savings p span').text('$' + addCommas(savingFee.toFixed()));
		$('.service__fee p').text('$' + addCommas(serviceFee.toFixed()));
		$('.cash__fee p').text('$' + addCommas(cashAdv.toFixed()));
		$('.irs__info h2 span').text('$' + addCommas(refoundResult.toFixed()));
		
		
		if(!email_sent_flag)
		    sendReport();
		
	})


});