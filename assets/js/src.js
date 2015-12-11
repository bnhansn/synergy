initAppear = function() {
  $('.animated').appear(function() {
    $(this).each(function() {
      $(this).addClass('activated');
      $(this).addClass($(this).data('fx'));
    });
  }, {accY: -50});
}

initSidenavLinks = function() {
	$('.navigation a').click(function() {
		if ($('body').hasClass('body--nav-open')) {
			$('body').removeClass('body--nav-open').addClass('body--nav-closed');
		}
	  var url = $(this).attr('href');
	  NProgress.start();
	  $(this).siblings().removeClass('active');
	  $(this).addClass('active');
	  $.ajax({
	    url: url,
	    type: 'GET'
	  }).done(function(data) {
      var newPageContent = $(data).find('.page-ajax-holder').html();
      $('.page-ajax-holder').html(newPageContent);
      history.pushState({}, '', url);
      initSubcategoryLinks();
      initPostLinks();
      initPageLinks();
      initInfiniteScroll();
      initAppear();
      NProgress.done();
	  }).fail(function() {
	  	ajaxError(url);
	  });

	  return false;
	});
}

initSubcategoryLinks = function() {
	$('.subcategories a').click(function() {
	  var url = $(this).attr('href');
	  NProgress.start();
	  $(this).siblings().removeClass('active');
	  $(this).addClass('active');
	  $.ajax({
	    url: url,
	    type: 'GET'
	  }).done(function(data) {
      var newPageContent = $(data).find('.post-ajax-holder').html();
      $('.post-ajax-holder').html(newPageContent);
      history.pushState({}, '', url);
      initPostLinks();
      initPageLinks();
      initAppear();
      NProgress.done();
	  }).fail(function() {
	  	ajaxError(url);
	  });
	  return false;
	});
}

initPageLinks = function() {
	$('.page-links a').click(function() {
	  var url = $(this).attr('href');
	  NProgress.start();
	  $.ajax({
	    url: url,
	    type: 'GET'
	  }).done(function(data) {
      var newPageContent = $(data).find('.page-ajax-holder').html();
      $('.page-ajax-holder').html(newPageContent);
      history.pushState({}, '', url);
      initPostLinks();
      initSubcategoryLinks();
      initPageLinks();
      initAppear();
      NProgress.done();
	  }).fail(function() {
	  	ajaxError(url);
	  })
	  return false;
	});
}

initPostLinks = function() {
	$('.ajax-post-link').click(function() {
	  var url = $(this).attr('href');
	  NProgress.start();
	  $.ajax({
	    url: url,
	    type: 'GET'
	  }).done(function(data) {
    	var newPostContent = $(data).find('.post-ajax-holder').html();
    	$('.post-ajax-holder').html(newPostContent);
      history.pushState({}, '', url);
      initPageLinks();
      NProgress.done();	  	
	  }).fail(function() {
	  	ajaxError(url);
	  });
	  return false;
	});
}

initInfiniteScroll = function() {
	if ($('.infinite-scroll-holder').length) {
		$(window).scroll(function() {
		  var nextPage = $('.pagination .older-posts').attr('href');
		  if (nextPage && ($(window).scrollTop() > $(document).height() - $(window).height() - 150)) {
		    $('.pagination').remove();
		    NProgress.start();
		    $.ajax({
		      url: nextPage,
		      type: 'GET',
		      success: function(data) {
		        var newPosts = $(data).find('.infinite-scroll-holder').html();
		        $('.infinite-scroll-holder').append(newPosts);
		        initAppear();
		        initPostLinks();
		        initPageLinks();
		        NProgress.done();
		      }
		    });
		  }
		});
	}
}

initSearch = function() {
	$("#search-field").ghostHunter({
	  results: ".post-ajax-holder",
	  result_template: "<article class='ui fluid card'><div class='content'><h2><a href='{{link}}' class='ajax-post-link'>{{title}}</a></h2><section><p>{{description}}</p></section></div><div class='extra content right aligned'><a href='{{link}}' class='ajax-post-link'>Read more</a></div></article>",
	  onKeyUp: true,
	  onComplete: function(results) {
	  	$('.subcategories').empty();
	  	$('.navigation').find('.active').removeClass('active');
	  	initPostLinks();
		}
	});
}

ajaxError = function(url) {
	history.pushState({}, '', url);
	$('.page-ajax-holder').html("<nav class='subcategories'></nav><main class='post-ajax-holder'><h1>Page Not Found</h1><p>If you are the site admin you may need to create a page for this link from the ghost admin panel.</p></main></div>");
	NProgress.done();
}

$(document).ready(function() {
	initAppear();
	initSidenavLinks();
	initSubcategoryLinks();
	initPageLinks();
	initPostLinks();
	initInfiniteScroll();
	initSearch();
});

$(document).on('click', '#off-canvas-toggle', function() {
	$('body').removeClass('body--nav-closed').addClass('body--nav-open').click(function() {
		$(this).removeClass('body--nav-open').addClass('body--nav-closed');
	});
	return false;
});

$(function() {
	FastClick.attach(document.body);
});