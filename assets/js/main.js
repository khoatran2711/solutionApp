(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    "use strict";
    
    var setAnimations = require("./module/animations.js");
    var setPhone = require("./module/phone.js");
    var setState = require("./module/setActiveState.js");
    var scrollTo = require("./module/scrollTo.js");
    var navigatoToSection = require("./module/asideNavigation.js");
    var setActiveSection = require("./module/asideNavigation.js");
    var modal = require("./module/modal.js");
    var cookie = require("./module/cookie.js");
    
    setAnimations.setAnimationMain();
    
    $(window).resize(function () {
        setAnimations.setAnimationMain();
    });
    
    $('.modal-window').on('click', function (event) {
        modal.closeModalClick(event);
    });
    $('.modalwindow .modal-window-close').on('click', function (event) {
        modal.closeModal(event);
    });
    
    //handle active state when press on radio  or checkbox
    setState.setActiveStateCheckbox($(".question-item-checkbox"));
    setState.setActiveStateRadio($(".question-item-radio"));
    
    //handle scrollto
    $(".btn--getdetails").on('click', function () {
        scrollTo($('.contactus-title'));
    });
    
    $(".btn--gocalculate").on('click', function () {
        scrollTo($('.calculator-containertxt'));
    });
    
    $('.question-item-label').each(function () {
        if ($(this).hasClass('data-final')) {
            $(this).closest('.question-item').addClass('set-final');
        }
    });
    
    //handle aside navigation
    
    $('.aside-navigation-item').on('click', function () {
        navigatoToSection.navigatoToSection.apply($(this));
    });
    
    $(window).scroll(function () {
        setActiveSection.setActiveSection();
    });
    
    //set validation
    jQuery.validator.addMethod("validEmail", function (value, element) {
        var str = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
        return str.test(value);
    }, "Please enter a valid email address.");
    
    $.validator.addMethod("minlenghtphone", function (value, element) {
    
        return value.replace(/\D+/g, '').length > 10;
    }, " Маловато циферок будет!");
    
    $.validator.addMethod("requiredphone", function (value, element) {
    
        return value.replace(/\D+/g, '').length > 4;
    }, " Заполните это поле!!!");
    
    $("#calcAppForm").validate({
        focusInvalid: false,
        invalidHandler: function invalidHandler(form, validator) {
            if (!validator.numberOfInvalids()) return;
    
            $('html, body').animate({
                scrollTop: $(validator.errorList[0].element).offset().top - 200
            }, 2000);
    
            $(validator.errorList[0].element).focus();
            $(validator.errorList[0].element).closest('.js-group-label').addClass('first-invalid');
        },
        rules: {
            email: {
                required: true,
                validEmail: true
            },
            field: {
                required: true,
                validEmail: true
            },
            startdate: {
                required: true
                // ,
                // phone: {
                //     requiredphone: true
                // }
            } },
        messages: {
            startdate: {
                required: "This field is required"
                // ,
                // phone: {
                //     requiredphone: "Invalid phone number"
                // }
    
            } },
        errorElement: 'span',
        errorPlacement: function errorPlacement(error, element) {
            error.insertBefore(element);
        },
        submitHandler: function submitHandler(form) {
            function getClientId() {
                try {
                    var tracker = ga.getAll()[0];
                    return parseInt(tracker.get('clientId', 10));
                } catch (e) {
                    // console.log("Error fetching clientId");
                }
            }
    
            $("#clientId").val(getClientId());
            $("#user_country").val($("#phone").intlTelInput("getSelectedCountryData").name);
    
            modal.showModal();
    
            $.ajax({
                type: 'POST',
                url: $(form).data('path'),
                data: $("#calcAppForm").serialize(),
                dataType: 'json',
                cache: false,
                success: function success(msg) {
                    if (msg.success == true) {
                        // Add Google Tag Manager event for Analytics
                        var dataObject = {
                            'event': 'submit_form_event',
                            'category': 'click',
                            'label': 'btn_pressed_send'
                        };
                        if (typeof dataLayer != 'undefined') {
                            dataLayer.push(dataObject);
                        }
    
                        modal.showModal();
                        modal.closeModalTimout();
                        setTimeout(function () {
                            $('#calcAppForm')[0].reset();
                        }, 2000);
                        setTimeout(function () {
                            $("#phone").val(' ');
                        }, 2000);
                        $('.question-item-label').removeClass('active');
    
                        setTimeout(function () {
                            window.location.href = "https://theappsolutions.com/portfolio/";
                        }, 5000);
                    } else {
                        modal.showModalError();
                    }
                },
                error: function error(xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                }
            });
            return false;
        }
    });
    
    $('form').on('keyup keypress', function (e) {
        // not submit form when click enter
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });
    
    var arrayElements = document.getElementsByClassName('js-seterrorhandler');
    
    for (var i = 0; i < arrayElements.length; i += 1) {
        $(arrayElements[i]).focus(function () {
            var elParent = this.id !== "phone" ? $(this.parentNode) : $(this.parentNode.parentNode);
            $(elParent.find(".js-error")[0]).addClass('js-error-hide');
            // console.log(elParent.find(".js-error")[0]);
            if ($(this.parentNode).hasClass('js-changed')) $(this.parentNode).removeClass('js-changed');
        });
        $(arrayElements[i]).blur(function () {
            if (!$(this.parentNode).hasClass('js-changed')) $(this.parentNode).addClass('js-changed');
            var elParent;
            if (!this.validity.valid) {
                elParent = this.id !== "phone" ? $(this.parentNode) : $(this.parentNode.parentNode);
                $(elParent.find(".js-error")[0]).removeClass('js-error-hide');
            }
            elParent = this.id !== "phone" ? $(this.parentNode) : $(this.parentNode.parentNode);
            if (this.validity.valid) {
                $(elParent.find(".js-error")[0]).addClass('js-error-hide');
            } else {
                $(elParent.find(".js-error")[0]).removeClass('js-error-hide');
            }
        });
    }
    
    var _cookie = "";
    if (cookie.getCookie("theapp") === undefined) {
        // For Hubspot
        _cookie = window.location.search;
        if (document.referrer.length > 0) _cookie += "&" + "referrer=" + document.referrer;
        if (_cookie.length > 0) {
            cookie.setCookie("theapp", _cookie, { domain: "theappsolutions.com", expires: 10368000 }); // 60s*60m*24d*30d*4m
        }
    }
    $("#utm").val(cookie.getCookie("theapp"));
    
    },{"./module/animations.js":2,"./module/asideNavigation.js":3,"./module/cookie.js":4,"./module/modal.js":5,"./module/phone.js":6,"./module/scrollTo.js":7,"./module/setActiveState.js":8}],2:[function(require,module,exports){
    'use strict';
    
    function setAnimationMain() {
        var controller = new ScrollMagic.Controller();
    
        if (window.innerWidth > 1023) {
            //pin intro
            var pinIntroScene = new ScrollMagic.Scene({
                triggerElement: '.calculator-header',
                triggerHook: 0,
                duration: '90%'
            }).setPin('.calculator-header', { pushFollowers: false }).addTo(controller);
    
            $('.question').each(function () {
                //new scenee
                var ourScene = new ScrollMagic.Scene({
                    triggerElement: this.children[0],
                    triggerHook: 0.85
                }).setClassToggle(this, 'fade-in').addTo(controller);
            });
    
            new ScrollMagic.Scene({
                triggerElement: ".wrap-calculator",
                triggerHook: 0.2,
                duration: '100%'
            }).setClassToggle('.calculator-title', 'fade-in').addTo(controller);
    
            new ScrollMagic.Scene({
                triggerElement: ".wrap-calculator",
                triggerHook: 0.2,
                duration: '100%'
            }).setClassToggle('.calculator-subtitle', 'fade-in').addTo(controller);
    
            /**--- ---- */
    
            var widthBody = $(window).width();
            var windowHeight = $(window).height();
    
            TweenLite.defaultEase = Linear.easeNone;
    
            var tl = new TimelineMax();
            tl.fromTo(".loader-line-left", 1, { height: 0 }, { height: windowHeight }).fromTo(".loader-line-top", 1, { width: 0 }, { width: widthBody }, 1).fromTo(".loader-line-right", 1, { height: 0 }, { height: windowHeight }, 2).fromTo(".loader-line-bottom", 1, { width: 0 }, { width: widthBody }, 3).fromTo(".loader-sticker", 0.5, { opacity: 1 }, { opacity: 0 }, 3.8).set($('.logo-sticky'), {
                className: "logo-sticky fade-in"
            })
            // .set($('.coast--sticky'), {
            //     className: "coast--sticky fade-in"
            // })
            .set($('.section-name'), {
                className: "section-name fade-in-x"
            }).set($('.footer'), {
                className: "footer fade-in"
            }).set($('.aside-navigation'), {
                className: "aside-navigation fade-in"
            }).staggerFromTo(".aside-navigation-href", 0.2, { scale: 0.45, autoAlpha: 0, x: 60 }, {
                scale: 1,
                autoAlpha: 1,
                x: 0,
                ease: Power1.easeIn
            }, 0.21);
    
            new ScrollMagic.Scene({
                triggerElement: '.wrap-calculator',
                triggerHook: 0.15
            }).setClassToggle('.wrap-calculator', 'is-active').setTween(tl.timeScale(3)).addTo(controller);
        } else {
            new ScrollMagic.Scene({
                triggerElement: '.wrap-calculator',
                triggerHook: 0.15
            }).setClassToggle('.wrap-calculator', 'is-active').addTo(controller);
        }
    }
    
    module.exports = { setAnimationMain: setAnimationMain };
    
    },{}],3:[function(require,module,exports){
    'use strict';
    
    function navigatoToSection() {
        var currentSection = $(this).data('section');
        if (currentSection) {
            $('body,html').animate({
                scrollTop: $('[data-question="' + currentSection + '"]').offset().top - 110
            }, 1000);
        }
    }
    
    function setActiveSection() {
        var sectionGeneral = $('div[data-question="general"]:first').offset().top;
        var sectionDesign = $('div[data-question="design"]:first').offset().top - 200;
        var sectionFeatures = $('div[data-question="features"]:first').offset().top - 200;
        // let  sectionEstimate =  $('.get-details').offset().top - 200;
        var sectionContactForm = $('.contactus').offset().top - 250;
    
        if ($(document).scrollTop() >= sectionGeneral && $(document).scrollTop() < sectionDesign) {
            // console.log('2');
            $('.aside-navigation-href').removeClass('active');
            $('.section-name-item').removeClass('active');
            $('.aside-navigation-href.general').addClass('active');
            $('.section-name-item.general').addClass('active');
        } else if ($(document).scrollTop() >= sectionDesign && $(document).scrollTop() < sectionFeatures) {
            // console.log('3');
            $('.aside-navigation-href').removeClass('active');
            $('.section-name-item').removeClass('active');
            $('.aside-navigation-href.design').addClass('active');
            $('.section-name-item.design').addClass('active');
        } else if ($(document).scrollTop() >= sectionFeatures && $(document).scrollTop() < sectionContactForm) {
            $('.aside-navigation-href').removeClass('active');
            $('.section-name-item').removeClass('active');
            $('.aside-navigation-href.features').addClass('active');
            $('.section-name-item.features').addClass('active');
        }
        // else if( $(document).scrollTop() < sectionContactForm ){
        //     //console.log('4');
        //     $('.aside-navigation-href').removeClass('active');
        //     $('.section-name-item').removeClass('active');
        //     $('.aside-navigation-href.estimate').addClass('active');
        //     $('.section-name-item.estimate').addClass('active');
        //
        // }
        else if ($(document).scrollTop() >= sectionContactForm) {
                $('.aside-navigation-href').removeClass('active');
                $('.section-name-item').removeClass('active');
                $('.aside-navigation-href.contactform').addClass('active');
                $('.section-name-item.contactform').addClass('active');
            }
    }
    module.exports = { navigatoToSection: navigatoToSection, setActiveSection: setActiveSection };
    
    },{}],4:[function(require,module,exports){
    "use strict";
    
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    
    function setCookie(name, value, options) {
        options = options || {};
    
        var expires = options.expires;
    
        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }
    
        value = encodeURIComponent(value);
    
        var updatedCookie = name + "=" + value;
    
        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }
    
        document.cookie = updatedCookie;
    }
    
    function deleteCookie(name) {
        setCookie(name, "", {
            expires: -1
        });
    }
    
    module.exports = {
        getCookie: getCookie,
        setCookie: setCookie,
        deleteCookie: deleteCookie
    };
    
    },{}],5:[function(require,module,exports){
    'use strict';
    
    function showModal() {
        $('.modalwindow .modal-window-p--error').hide();
        $('.modalwindow .modal-window-p').show();
        $('.modalwindow').addClass('is-visible');
    };
    
    function closeModalTimout() {
        setTimeout(function () {
            $('.modalwindow').removeClass('is-visible');
        }, 4500);
    };
    
    function showModalError() {
        $('.modalwindow .modal-window-p--error').show();
        $('.modalwindow .modal-window-p').hide();
        $('.modalwindow').addClass('is-visible');
    };
    
    function closeModalClick(event) {
        if ($(event.target).is('.modal .modal-window-close') || $(event.target).is('.modalwindow.modal-window')) {
            event.preventDefault();
            $('.modalwindow.modal-window').removeClass('is-visible');
        }
    }
    
    function closeModal(event) {
        $('.modalwindow.modal-window').removeClass('is-visible');
    }
    
    module.exports = {
        showModal: showModal,
        closeModalClick: closeModalClick,
        closeModal: closeModal,
        closeModalTimout: closeModalTimout,
        showModalError: showModalError
    };
    
    },{}],6:[function(require,module,exports){
    "use strict";
    
    (function setPhone() {
        var telInput = $("#phone");
        telInput.intlTelInput({
            autoHideDialCode: false,
            defaultCountry: "auto",
            numberType: "MOBILE",
            autoPlaceholder: true,
            allowExtensions: false,
            nationalMode: false,
            // Exclude Cuba, Iran, North Korea, Sudan, Syria
            excludeCountries: ['ir', 'cu', 'kp', 'sd', 'sy'],
            initialCountry: 'auto',
            utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/javascript.util/0.12.12/javascript.util.min.js',
        
        });
        return true;
    })();
    
    },{}],7:[function(require,module,exports){
    'use strict';
    
    function scrollTo(nameDiv) {
        var goTo = nameDiv.offset().top - 60;
        if (goTo) {
            $('body,html').animate({
                scrollTop: goTo
            }, 1000);
        }
    }
    
    module.exports = scrollTo;
    
    },{}],8:[function(require,module,exports){
    'use strict';
    
    function setActiveStateRadio(area) {
        $(area).on('click', function () {
            $(this).closest('.question-item').find('.question-item-label').removeClass('active');
            if ($(this).closest('.question-item-label').hasClass("active")) {
                $(this).closest('.question-item-label').removeClass("active");
                $(this).closest('.question-item').removeClass("valid");
            } else {
                $(this).closest('.question-item-label').addClass("active");
                $(this).closest('.question-item').addClass("valid");
            }
        });
    }
    
    function setActiveStateCheckbox(area) {
        for (var i = 0; i < area.length; i++) {
            if ($(area[i]).closest('.question-item-label').find('.question-item-title').text() == 'None') {
                $(area[i]).addClass('-none');
            } else {
                $(area[i]).addClass('-element');
            }
        }
        $(area).on('click', function () {
    
            if (!$(this).closest('.question-item-label').hasClass("active") && $(this).data("final") && $(this).data("final") == true) {
                $(this).closest('.question-item').find('input').each(function () {
                    if ($(this).data("final") === undefined) {
                        $(this).removeAttr('checked');
                        $(this).closest('.question-item').find('.question-item-label').removeClass('active');
                    } else {
    
                        $(this).closest('.question-item-label').toggleClass("active");
                    }
                });
            } else if ($(this).closest('.question-item').hasClass('set-final') && $(this).data("final") == undefined) {
    
                $(this).closest('.question-item').find('.none-question').removeAttr('checked').closest('.question-item').find('.question-item-label.data-final').removeClass('active');
                $(this).closest('.question-item-label').toggleClass("active");
            } else {
                if ($(this).hasClass('-none') && !$(this).closest('.question-item-label').hasClass('active')) {
                    $(this).closest('.question-item').find('.-element').removeAttr('checked').closest('.question-item').find('.question-item-label').removeClass('active');
                } else if ($(this).hasClass('-element')) {
                    var __none = $(this).closest('.question-item').find('.-none');
                    if (none != undefined) {
                        $(__none).removeAttr('checked');
                        $(__none).closest('.question-item-label').removeClass('active');
                    }
                }
                $(this).closest('.question-item-label').toggleClass('active');
            }
        });
    }
    
    module.exports = {
        setActiveStateCheckbox: setActiveStateCheckbox,
        setActiveStateRadio: setActiveStateRadio
    };
    
    },{}]},{},[1]);
    
    //# sourceMappingURL=main.js.map
    