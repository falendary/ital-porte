jQuery(document).ready(function(){
	jQuery('form').customForm();
	initAutoScalingNav({
		menuId: "panel",
		sideClasses: true,
	});
	initCheckbox();
	initOpen();
	initAll();
	initFilter();
	
	$('.gallery').gallery({
		disableBtn:'hidden'
	});
	$('.gallery-photo').gallery({
		switcher:'.switcher-gallery li',
		listOfSlides:'.gallery-holder li',
		effect: true,
		nextBtn:'',
		prevBtn:''
	});
	$('.switcher-gallery').gallery({
		disableBtn:'hidden'
	});
	pageInit.init();

	//Карточка товара
		//Комментарии & отзывы
	$('.feedback').hide();
	$('.foot .link-reviews').click(
		function()
		{
			$('.feedback').toggle();
		}
	);
	$('.register-item').hide()
	$('.add-item').click(
		function()
		{
			if(!$('.add-item').hasClass('active'))
			{
				$('.add-item').addClass('active');
				$('.add-item').html('Товар в заявке');
				$('.register-item').show();
			}
		}
	);

	$('.minus-item').click(
		function()
		{
			var currentValue = $('.counter').html();
			if (currentValue > 1)
			{
				currentValue-=1;
				$('.counter').html(currentValue);
			}
		}
	);
	$('.plus-item').click(
		function()
		{
			var currentValue = $('.counter').html();
			
			if (currentValue >= 1)
			{
				currentValue++;
				$('.counter').html(currentValue);
			}
			
		}
	);
	


	checkOnLoad();

});

// включает чекбокс "Выбрать все" если все другие критерии выбраны вручную
function checkAll()
{
	$('.hold-filter .list-options li').not(':first').each(function()
		{
			var checkedAll = true;
			$(this).find("ul li").not(':first').each(function()
			{
				// console.log(this);
				var $label = $(this).find('label');
				if (!$label.hasClass('checked')) {
					checkedAll = false;
					return false;
				}
			});
			// console.log(checkedAll);
			if (checkedAll)
			{
				$(this).find("ul li:first").addClass('active');
			}
			else
			{
				$(this).find("ul li:first").removeClass('active');
			}
			// console.log($(this).children("li"));
		});
}
function checkOnLoad()
{
	$('.hold-filter:first .list-options>li>label').each(function()
	{
		var checkedStyles = false;
		if($(this).hasClass('checked'))
		{
			checkedStyles = true;
		}
		if(checkedStyles)
		{
			$('.hold-filter:first').addClass('open');
			$('.hold-filter:first>.list-options').css({display: 'none'}).slideDown(300);
		}
	});
	$('.hold-filter .list-options>li').each(function()
		{
			var box = $(this).find('ul');
			var checkedAll = false;
			$(this).find("ul li").each(function()
			{
				//console.log($(this).find('label'));
				var $label = $(this).find('label');
				if ($label.hasClass('checked')) {
					checkedAll = true;
					return false;
				}
				else
				{
					checkedAll = false;
				}
			});
			//console.log(box);
			 //console.log(checkedAll);
			if(checkedAll)
			{
				$(this).addClass('open');
				box.css({display: 'none'}).slideDown(300);
			}
			else
			{
				$(this).removeClass('open');
				box.slideUp(300);
			}
			//console.log($(this).children("ul"));
		}
	);
}
var pageInit = {
	init: function(){
		this.artik();
	},
	artik: function(){
		$('.hold-text').each(function(){
			var hold = $(this);
			var radio = hold.find('.gallery input:radio');
			var list = hold.find('.inp-art');
			
			radio.change(function(){
				list.val($(this).data('art'));
			})
		})
	}
}
function initFilter(){
	$('#sidebar > form').each(function(){
		var hold = $(this);
		var input = hold.find('input');
		var content = $('#content');
		var time, jqxhr, create = false;
		
		function changePagination(){
			var first = $('#main > .inner > .hold-paging');
			var second = content.find('.inner > .hold-paging');
			
			first.html(second.html());
			
			first.add(second).find('.link-next').unbind('click').click(function(){
				var val = input.filter('[name="page"]').val()/1;
				if(val+1 <= second.find('.total').text()/1){
					input.filter('[name="page"]').val(val+1);
					send(true);
				}
				return false;
			});
			first.add(second).find('.link-prev').unbind('click').click(function(){
				var val = input.filter('[name="page"]').val()/1;
				if(val-1 >= 1){
					input.filter('[name="page"]').val(val-1);
					send(true);
				}
				return false;
			});
		}
		
		function send(flag){
			if(time) clearTimeout(time);
			time = setTimeout(function(){
				if (flag) {
					history.pushState(null, null, window.location.protocol+'//' + window.location.host + window.location.pathname + '?' + hold.serialize());
				}
				if(jqxhr) jqxhr.abort();
				jqxhr = $.ajax({
					type: 'GET',
					data: hold.serialize(),
					dataType: 'html',
					url: hold.attr('action'),
					success: function(msg){
						content.empty().append(msg);
						changePagination();
						console.log('load');
					},
					error: function(){alert('Server is unavailable. Refresh the page within 15 seconds.!');}
				});
			}, 100);
		}
		
		function createForm(obj, rad){
			create = true;
			if(rad) input.prop('checked', false).trigger('change');
			else input.filter(':checkbox').prop('checked', false).trigger('change');
			hold.find('a.all').parent().removeClass('active');
			
			$.each(obj, function(key, val){
				if(input.filter('[name="'+key+'"]').is('[type="hidden"]')){
					input.filter('[name="'+key+'"]').val(val);
				}
				else{
					if(input.filter('[name="'+key+'"]').is(':radio')){
						input.filter('[name="'+key+'"]').filter('[value="'+val+'"]').prop('checked', true).trigger('change');
					}
					else{
						input.filter('[name="'+key+'"]').prop('checked', true).trigger('change');
					} 
				}
				
			});
			$('input').customForm('refresh');
			
			send(false);
			create = false;
		}
		
		input.change(function(){
			checkAll();
			if (!create) {
				send(true);
			}

		});
		
		$(window).on('popstate', function(){
			createForm($.unserialize(window.location.search.substr(1)), true);
			checkOnLoad();
			return false;
		});
		createForm($.unserialize(window.location.search.substr(1)));
	});
}

function initAll(){
	$('a.all').each(function(){
		var hold = $(this);
		var input = hold.parent().parent().find('input:checkbox').not(':disabled');
		var all = hold.parent().parent().find('a.all');
		
		hold.click(function(){
			if(!hold.parent().hasClass('active')){
				all.parent().addClass('active');
				input.prop('checked', true).trigger('change');
			}
			else{
				all.parent().removeClass('active');
				input.prop('checked', false).trigger('change');
			}
			return false;
		});
	});
	
}
function initOpen(){
	$('.wrap-open').each(function(){
		var hold = $(this);
		var link = hold.find('.btn-filter');
		var box = hold.find('.box-open');
		
		link.click(function(){
			if(!hold.hasClass('open')){
				hold.addClass('open');
				box.css({display: 'none'}).slideDown(300);
			}
			else{
				box.slideUp(300, function(){
					hold.removeClass('open');
				});
			}
			return false;
		});
	});
	$('.list-options > li:has(ul)').each(function(){
		var hold = $(this);
		var link = hold.find('> a');
		var box = hold.find('> ul');
		
		link.click(function(){
			if(!hold.hasClass('open')){
				hold.addClass('open');
				box.css({display: 'none'}).slideDown(300);
			}
			else{
				box.slideUp(300, function(){
					hold.removeClass('open');
				});
			}
			return false;
		});
	});
}

function initCheckbox(){
	$('input:checkbox').each(function(){
		var hold = $(this);
		
		if(hold.is(':checked')) hold.parent().addClass('checked');
		else hold.parent().removeClass('checked');
		hold.change(function(){
			if(hold.is(':checked')) hold.parent().addClass('checked');
			else hold.parent().removeClass('checked');
		});
	});
}
/**
 * jQuery gallery v2.2.1
 * Copyright (c) 2013 JetCoders
 * email: yuriy.shpak@jetcoders.com
 * www: JetCoders.com
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 **/

;(function($){var _installDirections=function(data){data.holdWidth=data.list.parent().outerWidth();data.woh=data.elements.outerWidth(true);if(!data.direction)data.parentSize=data.holdWidth;else{data.woh=data.elements.outerHeight(true);data.parentSize=data.list.parent().height();}data.wrapHolderW=Math.ceil(data.parentSize/data.woh);if(((data.wrapHolderW-1)*data.woh+data.woh/2)>data.parentSize)data.wrapHolderW--;if(data.wrapHolderW==0)data.wrapHolderW=1;},_dirAnimate=function(data){if(!data.direction)return{left:-(data.woh*data.active)};else return{top:-(data.woh*data.active)};},_initDisableBtn=function(data){data.prevBtn.removeClass(data.disableBtn);data.nextBtn.removeClass(data.disableBtn);if(data.active==0||data.count+1==data.wrapHolderW-1)data.prevBtn.addClass(data.disableBtn);if(data.active==0&&data.count+1==1||data.count+1<=data.wrapHolderW-1)data.nextBtn.addClass(data.disableBtn);if(data.active==data.rew)data.nextBtn.addClass(data.disableBtn);},_initEvent=function(data,btn,side){btn.bind(data.event+'.gallery',function(){if(data.flag){if(data.infinite)data.flag=false;if(data._t)clearTimeout(data._t);_toPrepare(data,side);if(data.autoRotation)_runTimer(data);if(typeof data.onChange=='function')data.onChange({elements:data.elements,active:data.active});}if(data.event=='click')return false;});},_initEventSwitcher=function(data){data.switcher.bind(data.event+'.gallery',function(){if(data.flag&&!$(this).hasClass(data.activeClass)){if(data.infinite)data.flag=false;data.active=data.switcher.index(jQuery(this))*data.slideElement;if(data.infinite)data.active=data.switcher.index(jQuery(this))+data.count;if(data._t)clearTimeout(data._t);if(data.disableBtn)_initDisableBtn(data);if(!data.effect)_scrollElement(data);else _fadeElement(data);if(data.autoRotation)_runTimer(data);if(typeof data.onChange=='function')data.onChange({elements:data.elements,active:data.active});}if(data.event=='click')return false;});},_toPrepare=function(data,side){if(!data.infinite){if((data.active==data.rew)&&data.circle&&side)data.active=-data.slideElement;if((data.active==0)&&data.circle&&!side)data.active=data.rew+data.slideElement;for(var i=0;i<data.slideElement;i++){if(side){if(data.active+1<=data.rew)data.active++;}else{if(data.active-1>=0)data.active--;}};}else{if(data.active>=data.count+data.count&&side)data.active-=data.count;if(data.active<=data.count-1&&!side)data.active+=data.count;data.list.css(_dirAnimate(data));if(side)data.active+=data.slideElement;else data.active-=data.slideElement;}if(data.disableBtn)_initDisableBtn(data);if(!data.effect)_scrollElement(data);else _fadeElement(data);},_fadeElement=function(data){if(!data.IEfx&&data.IE){data.list.eq(data.last).css({opacity:0});data.list.removeClass(data.activeClass).eq(data.active).addClass(data.activeClass).css({opacity:'auto'});}else{data.list.removeClass(data.activeClass).css({zIndex:1});data.list.eq(data.last).stop().css({zIndex:2,opacity:1});data.list.eq(data.active).addClass(data.activeClass).css({opacity:0,zIndex:3}).animate({opacity:1},{queue:false,duration:data.duration,complete:function(){jQuery(this).css('opacity','auto');}});}if(data.autoHeight)data.list.parent().animate({height:data.list.eq(data.active).outerHeight()},{queue:false,duration:data.duration});if(data.switcher)data.switcher.removeClass(data.activeClass).eq(data.active).addClass(data.activeClass);data.last=data.active;},_scrollElement=function(data){if(!data.infinite)data.list.animate(_dirAnimate(data),{queue:false,easing:data.easing,duration:data.duration});else{data.list.animate(_dirAnimate(data),data.duration,data.easing,function(){if(data.active>=data.count+data.count)data.active-=data.count;if(data.active<=data.count-1)data.active+=data.count;data.list.css(_dirAnimate(data));data.flag=true;});}if(data.autoHeight)data.list.parent().animate({height:data.list.children().eq(data.active).outerHeight()},{queue:false,duration:data.duration});if(data.switcher){if(!data.infinite)data.switcher.removeClass(data.activeClass).eq(Math.ceil(data.active/data.slideElement)).addClass(data.activeClass);else{data.switcher.removeClass(data.activeClass).eq(data.active-data.count).addClass(data.activeClass);data.switcher.removeClass(data.activeClass).eq(data.active-data.count-data.count).addClass(data.activeClass);data.switcher.eq(data.active).addClass(data.activeClass);}}},_runTimer=function(data){if(data._t)clearTimeout(data._t);data._t=setInterval(function(){if(data.infinite)data.flag=false;_toPrepare(data,true);if(typeof data.onChange=='function')data.onChange({elements:data.elements,active:data.active});},data.autoRotation);},_rePosition=function(data){if(data.flexible&&!data.direction){_installDirections(data);if(data.elements.length*data.minWidth>data.holdWidth){data.elements.css({width:Math.floor(data.holdWidth/Math.floor(data.holdWidth/data.minWidth))});if(data.elements.outerWidth(true)>Math.floor(data.holdWidth/Math.floor(data.holdWidth/data.minWidth))){data.elements.css({width:Math.floor(data.holdWidth/Math.floor(data.holdWidth/data.minWidth))-(data.elements.outerWidth(true)-Math.floor(data.holdWidth/Math.floor(data.holdWidth/data.minWidth)))});}}else{data.active=0;data.elements.css({width:Math.floor(data.holdWidth/data.elements.length)});}}_installDirections(data);if(!data.effect){data.rew=data.count-data.wrapHolderW+1;if(data.active>data.rew)data.active=data.rew;data.list.css({position:'relative'}).css(_dirAnimate(data));if(data.switcher)data.switcher.removeClass(data.activeClass).eq(data.active).addClass(data.activeClass);if(data.autoHeight)data.list.parent().css({height:data.list.children().eq(data.active).outerHeight()});}else{data.rew=data.count;data.list.css({opacity:0}).removeClass(data.activeClass).eq(data.active).addClass(data.activeClass).css({opacity:1}).css('opacity','auto');if(data.switcher)data.switcher.removeClass(data.activeClass).eq(data.active).addClass(data.activeClass);if(data.autoHeight)data.list.parent().css({height:data.list.eq(data.active).outerHeight()});}if(data.disableBtn)_initDisableBtn(data);},_initTouchEvent=function(data){var span=$("<span class='gallery-touch-help'></span>");var touchOnGallery=false;var startTouchPos;var listPosNow;var side;var start;span.css({position:"absolute",left:0,top:0,width:9999,height:9999,cursor:"pointer",zIndex:9999,display:"none"});data.list.parent().css({position:"relative"}).append(span);data.list.bind("mousedown.gallery touchstart.gallery",function(e){touchOnGallery=true;startTouchPos=e.originalEvent.touches?e.originalEvent.touches[0].pageX:e.pageX;data.list.stop();start=0;listPosNow=data.list.position().left;if(e.type=="mousedown")e.preventDefault();});$(document).bind("mousemove.gallery"+data.id+" touchmove.gallery"+data.id,function(e){if(touchOnGallery&&Math.abs(startTouchPos-(e.originalEvent.touches?e.originalEvent.touches[0].pageX:e.pageX))>10){span.css({display:"block"});start=(e.originalEvent.touches?e.originalEvent.touches[0].pageX:e.pageX)-startTouchPos;if(!data.effect){data.list.css({left:listPosNow+start});}return false;}}).bind("mouseup.gallery touchend.gallery",function(e){if(touchOnGallery){span.css({display:"none"});if(!data.infinite){if(!data.effect){if(data.list.position().left>0){data.active=0;_scrollElement(data);}else if(data.list.position().left<-data.woh*data.rew){data.active=data.rew;_scrollElement(data);}else{data.active=Math.floor(data.list.position().left/-data.woh);if(start<0){data.active+=1;}_scrollElement(data);}}else{if(start<0){_toPrepare(data,true);}if(start>0){_toPrepare(data,false);}}}else{if(data.list.position().left>-data.woh*data.count){data.list.css({left:data.list.position().left-data.woh*data.count});}if(data.list.position().left<-data.woh*data.count*2){data.list.css({left:data.list.position().left+data.woh*data.count});}data.active=Math.floor(data.list.position().left/-data.woh);if(start<0){data.active+=1;}_scrollElement(data);}if(data.disableBtn)_initDisableBtn(data);if(typeof data.onChange=="function")data.onChange({elements:data.elements,active:data.active});if(data.autoRotation)_runTimer(data);touchOnGallery=false;}});},methods={init:function(options){return this.each(function(){var $this=$(this);$this.data('gallery',jQuery.extend({},defaults,options));var data=$this.data('gallery');data.aR=data.autoRotation;data.context=$this;data.list=data.context.find(data.listOfSlides);data.elements=data.list;if(data.elements.css('position')=='absolute'&&data.autoDetect)data.effect=true;data.count=data.list.index(data.list.filter(':last'));if(!data.IEfx)data.IE=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());if(!data.effect)data.list=data.list.parent();if(data.switcher)data.switcher=data.context.find(data.switcher);if(data.switcher.length==0)data.switcher=false;if(data.nextBtn)data.nextBtn=data.context.find(data.nextBtn);if(data.prevBtn)data.prevBtn=data.context.find(data.prevBtn);if(data.switcher)data.active=data.switcher.index(data.switcher.filter('.'+data.activeClass+':eq(0)'));else data.active=data.elements.index(data.elements.filter('.'+data.activeClass+':eq(0)'));if(data.active<0)data.active=0;data.last=data.active;if(data.flexible&&!data.direction)data.minWidth=data.elements.outerWidth(true);_rePosition(data);if(data.flexible&&!data.direction){$(window).bind('resize.gallery'+data.id,function(){_rePosition(data);});}data.id=(new Date()).getTime();data.flag=true;if(data.infinite){data.count++;data.active+=data.count;data.list.append(data.elements.clone());data.list.append(data.elements.clone());data.list.css(_dirAnimate(data));data.elements=data.list.children();}if(data.rew<0&&!data.effect){data.list.css({left:0});return false;}if(data.nextBtn)_initEvent(data,data.nextBtn,true);if(data.prevBtn)_initEvent(data,data.prevBtn,false);if(data.switcher)_initEventSwitcher(data);if(data.autoRotation)_runTimer(data);if(data.touch)_initTouchEvent(data);});},option:function(name,set){if(set){return this.each(function(){var data=$(this).data('gallery');if(data)data[name]=set;});}else{var ar=[];this.each(function(){var data=$(this).data('gallery');if(data)ar.push(data[name]);});if(ar.length>1)return ar;else return ar[0];}},destroy:function(){return this.each(function(){var $this=$(this),data=$this.data('gallery');if(data){if(data._t)clearTimeout(data._t);data.context.find('*').unbind('.gallery');$(window).unbind('.gallery'+data.id);$(document).unbind('.gallery'+data.id);data.elements.removeAttr('style');data.list.removeAttr('style');$this.find('span.gallery-touch-help').remove();$this.removeData('gallery');}});},rePosition:function(){return this.each(function(){var $this=$(this),data=$this.data('gallery');_rePosition(data);});},stop:function(){return this.each(function(){var $this=$(this),data=$this.data('gallery');data.aR=data.autoRotation;data.autoRotation=false;if(data._t)clearTimeout(data._t);});},play:function(time){return this.each(function(){var $this=$(this),data=$this.data('gallery');if(data._t)clearTimeout(data._t);data.autoRotation=time?time:data.aR;if(data.autoRotation)_runTimer(data);});},next:function(element){return this.each(function(){var $this=$(this),data=$this.data('gallery');if(element!='undefined'&&element>-1){data.active=element;if(data.disableBtn)_initDisableBtn(data);if(!data.effect)_scrollElement(data);else _fadeElement(data);}else{if(data.flag){if(data.infinite)data.flag=false;if(data._t)clearTimeout(data._t);_toPrepare(data,true);if(data.autoRotation)_runTimer(data);if(typeof data.onChange=='function')data.onChange({elements:data.elements,active:data.active});}}});},prev:function(){return this.each(function(){var $this=$(this),data=$this.data('gallery');if(data.flag){if(data.infinite)data.flag=false;if(data._t)clearTimeout(data._t);_toPrepare(data,false);if(data.autoRotation)_runTimer(data);if(typeof data.onChange=='function')data.onChange({elements:data.elements,active:data.active});}});}},defaults={infinite:false,activeClass:'active',duration:300,slideElement:1,autoRotation:false,effect:false,listOfSlides:'ul:eq(0) > li',switcher:false,disableBtn:false,nextBtn:'a.link-next, a.btn-next, .next',prevBtn:'a.link-prev, a.btn-prev, .prev',IEfx:true,circle:true,direction:false,event:'click',autoHeight:false,easing:'easeOutQuad',flexible:false,autoDetect:true,touch:true,onChange:null};$.fn.gallery=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else{if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.gallery');}}};jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;}});})(jQuery);

/**
 * jQuery Custom Form min v1.2.4
 * Copyright (c) 2012 JetCoders
 * email: yuriy.shpak@jetcoders.com
 * www: JetCoders.com
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 **/

;jQuery.fn.customForm=jQuery.customForm=function(_options){var _this=this;var methods={destroy:function(){var elements;if(typeof this==='function'){elements=$('select, input:radio, input:checkbox');}else{elements=this.add(this.find('select, input:radio, input:checkbox'));}elements.each(function(){var data=$(this).data('customForm');if(data){$(this).removeClass('outtaHere');if(data['events'])data['events'].unbind('.customForm');if(data['create'])data['create'].remove();if(data['resizeElement'])data.resizeElement=false;$(this).unbind('.customForm');}});},refresh:function(){if(typeof this==='function')$('select, input:radio, input:checkbox').trigger('refresh');else this.trigger('refresh');}};if(typeof _options==='object'||!_options){if(typeof _this=='function')_this=$(document);var options=jQuery.extend(true,{select:{elements:'select.customSelect',structure:'<div class="selectArea"><a tabindex="-1" href="#" class="selectButton"><span class="center"></span><span class="right">&nbsp;</span></a><div class="disabled"></div></div>',text:'.center',btn:'.selectButton',optStructure:'<div class="selectOptions"><ul></ul></div>',maxHeight:false,topClass:'position-top',optList:'ul'},radio:{elements:'input.customRadio',structure:'<div></div>',defaultArea:'radioArea',checked:'radioAreaChecked'},checkbox:{elements:'input.customCheckbox',structure:'<div></div>',defaultArea:'checkboxArea',checked:'checkboxAreaChecked'},disabled:'disabled',hoverClass:'hover'},_options);return _this.each(function(){var hold=jQuery(this);var reset=jQuery();if(this!==document)reset=hold.find('input:reset, button[type=reset]');initSelect(hold.find(options.select.elements),hold,reset);initRadio(hold.find(options.radio.elements),hold,reset);initCheckbox(hold.find(options.checkbox.elements),hold,reset);});}else{if(methods[_options]){methods[_options].apply(this);}}function initSelect(elements,form,reset){elements.not('.outtaHere').each(function(){var select=$(this);var replaced=jQuery(options.select.structure);var selectText=replaced.find(options.select.text);var selectBtn=replaced.find(options.select.btn);var selectDisabled=replaced.find('.'+options.disabled).hide();var optHolder=jQuery(options.select.optStructure);var optList=optHolder.find(options.select.optList);var html='';var optTimer;if(select.prop('disabled'))selectDisabled.show();function createStructure(){html='';select.find('option').each(function(){var selOpt=jQuery(this);if(selOpt.prop('selected'))selectText.html(selOpt.html());html+='<li data-value="'+selOpt.val()+'" '+(selOpt.prop('selected')?'class="selected"':'')+'>'+(selOpt.prop('disabled')?'<span>':'<a href="#">')+selOpt.html()+(selOpt.prop('disabled')?'</span>':'</a>')+'</li>';});if(select.data('placeholder')!==undefined){selectText.html(select.data('placeholder'));replaced.addClass('placeholder');}optList.append(html).find('a').click(function(){replaced.removeClass('placeholder');optList.find('li').removeClass('selected');jQuery(this).parent().addClass('selected');select.val(jQuery(this).parent().data('value').toString());selectText.html(jQuery(this).html());select.change();replaced.removeClass(options.hoverClass);optHolder.css({left:-9999,top:-9999});return false;});}createStructure();replaced.width(select.outerWidth());replaced.insertBefore(select);replaced.addClass(select.attr('class'));optHolder.css({width:select.outerWidth(),position:'absolute',left:-9999,top:-9999});optHolder.addClass(select.attr('class'));jQuery(document.body).append(optHolder);select.bind('refresh',function(){optList.empty();createStructure();});replaced.hover(function(){if(optTimer)clearTimeout(optTimer);},function(){optTimer=setTimeout(function(){replaced.removeClass(options.hoverClass);optHolder.css({left:-9999,top:-9999});},200);});optHolder.hover(function(){if(optTimer)clearTimeout(optTimer);},function(){optTimer=setTimeout(function(){replaced.removeClass(options.hoverClass);optHolder.css({left:-9999,top:-9999});},200);});if(options.select.maxHeight&&optHolder.children().height()>options.select.maxHeight){optHolder.children().css({height:options.select.maxHeight,overflow:'auto'});}selectBtn.click(function(){if(optHolder.offset().left>0){replaced.removeClass(options.hoverClass);optHolder.css({left:-9999,top:-9999});}else{replaced.addClass(options.hoverClass);select.removeClass('outtaHere');optHolder.css({width:select.outerWidth(),top:-9999});select.addClass('outtaHere');if(options.select.maxHeight&&optHolder.children().height()>options.select.maxHeight){optHolder.children().css({height:options.select.maxHeight,overflow:'auto'});}if($(document).height()>optHolder.outerHeight(true)+replaced.offset().top+replaced.outerHeight()){optHolder.removeClass(options.select.topClass).css({top:replaced.offset().top+replaced.outerHeight(),left:replaced.offset().left});replaced.removeClass(options.select.topClass);}else{optHolder.addClass(options.select.topClass).css({top:replaced.offset().top-optHolder.outerHeight(true),left:replaced.offset().left});replaced.addClass(options.select.topClass);}replaced.focus();}return false;});reset.click(function(){setTimeout(function(){select.find('option').each(function(i){var selOpt=jQuery(this);if(selOpt.val()==select.val()){selectText.html(selOpt.html());optList.find('li').removeClass('selected');optList.find('li').eq(i).addClass('selected');}});},10);});select.bind('change.customForm',function(){if(optHolder.is(':hidden')){select.find('option').each(function(i){var selOpt=jQuery(this);if(selOpt.val()==select.val()){selectText.html(selOpt.html());optList.find('li').removeClass('selected');optList.find('li').eq(i).addClass('selected');}});}});select.bind('focus.customForm',function(){replaced.addClass('focus');}).bind('blur.customForm',function(){replaced.removeClass('focus');});select.data('customForm',{'resizeElement':function(){select.removeClass('outtaHere');replaced.width(Math.floor(select.outerWidth()));select.addClass('outtaHere');},'create':replaced.add(optHolder)});$(window).bind('resize.customForm',function(){if(select.data('customForm')['resizeElement'])select.data('customForm').resizeElement();});}).addClass('outtaHere');}function initRadio(elements,form,reset){elements.each(function(){var radio=$(this);if(!radio.hasClass('outtaHere')&&radio.is(':radio')){radio.data('customRadio',{radio:radio,name:radio.attr('name'),label:$('label[for='+radio.attr('id')+']').length?$('label[for='+radio.attr('id')+']'):radio.parents('label'),replaced:jQuery(options.radio.structure,{'class':radio.attr('class')})});var data=radio.data('customRadio');if(radio.is(':disabled')){data.replaced.addClass(options.disabled);if(radio.is(':checked'))data.replaced.addClass('disabledChecked');}else if(radio.is(':checked')){data.replaced.addClass(options.radio.checked);data.label.addClass('checked');}else{data.replaced.addClass(options.radio.defaultArea);data.label.removeClass('checked');}data.replaced.click(function(){if(jQuery(this).hasClass(options.radio.defaultArea)){radio.change();radio.prop('checked',true);changeRadio(data);}});reset.click(function(){setTimeout(function(){if(radio.is(':checked'))data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.checked);else data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.defaultArea);},10);});radio.bind('refresh',function(){if(radio.is(':checked')){data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.checked);data.label.addClass('checked');}else{data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.defaultArea);data.label.removeClass('checked');}});radio.bind('click.customForm',function(){changeRadio(data);});radio.bind('focus.customForm',function(){data.replaced.addClass('focus');}).bind('blur.customForm',function(){data.replaced.removeClass('focus');});data.replaced.insertBefore(radio);radio.addClass('outtaHere');radio.data('customForm',{'create':data.replaced});}});}function changeRadio(data){jQuery('input:radio[name="'+data.name+'"]').not(data.radio).each(function(){var _data=$(this).data('customRadio');if(_data.replaced&&!jQuery(this).is(':disabled')){_data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.defaultArea);_data.label.removeClass('checked');}});data.replaced.removeClass(options.radio.defaultArea+' '+options.radio.checked).addClass(options.radio.checked);data.label.addClass('checked');data.radio.trigger('change');}function initCheckbox(elements,form,reset){elements.each(function(){var checkbox=$(this);if(!checkbox.hasClass('outtaHere')&&checkbox.is(':checkbox')){checkbox.data('customCheckbox',{checkbox:checkbox,label:$('label[for='+checkbox.attr('id')+']').length?$('label[for='+checkbox.attr('id')+']'):checkbox.parents('label'),replaced:jQuery(options.checkbox.structure,{'class':checkbox.attr('class')})});var data=checkbox.data('customCheckbox');if(checkbox.is(':disabled')){data.replaced.addClass(options.disabled);if(checkbox.is(':checked'))data.replaced.addClass('disabledChecked');}else if(checkbox.is(':checked')){data.replaced.addClass(options.checkbox.checked);data.label.addClass('checked');}else{data.replaced.addClass(options.checkbox.defaultArea);data.label.removeClass('checked');}data.replaced.click(function(){if(!data.replaced.hasClass('disabled')&&!data.replaced.parents('label').length){if(checkbox.is(':checked'))checkbox.prop('checked',false);else checkbox.prop('checked',true);changeCheckbox(data);}});reset.click(function(){setTimeout(function(){changeCheckbox(data);},10);});checkbox.bind('refresh',function(){if(checkbox.is(':checked')){data.replaced.removeClass(options.checkbox.defaultArea+' '+options.checkbox.defaultArea).addClass(options.checkbox.checked);data.label.addClass('checked');}else{data.replaced.removeClass(options.checkbox.defaultArea+' '+options.checkbox.checked).addClass(options.checkbox.defaultArea);data.label.removeClass('checked');}});checkbox.bind('click.customForm',function(){changeCheckbox(data);});checkbox.bind('focus.customForm',function(){data.replaced.addClass('focus');}).bind('blur.customForm',function(){data.replaced.removeClass('focus');});data.replaced.insertBefore(checkbox);checkbox.addClass('outtaHere');data.replaced.parents('label').bind('click.customForm',function(){if(!data.replaced.hasClass('disabled')){if(checkbox.is(':checked'))checkbox.prop('checked',false);else checkbox.prop('checked',true);changeCheckbox(data);}return false;});checkbox.data('customForm',{'create':data.replaced,'events':data.replaced.parents('label')});}});}function changeCheckbox(data){if(data.checkbox.is(':checked')){data.replaced.removeClass(options.checkbox.defaultArea+' '+options.checkbox.defaultArea).addClass(options.checkbox.checked);data.label.addClass('checked');}else{data.replaced.removeClass(options.checkbox.defaultArea+' '+options.checkbox.checked).addClass(options.checkbox.defaultArea);data.label.removeClass('checked');}data.checkbox.trigger('change');}};


function initAutoScalingNav(o) {
	if (!o.menuId) o.menuId = "nav";
	if (!o.tag) o.tag = "a";
	if (!o.spacing) o.spacing = 0;
	if (!o.constant) o.constant = 0;
	if (!o.minPaddings) o.minPaddings = 0;
	if (!o.liHovering) o.liHovering = false;
	if (!o.sideClasses) o.sideClasses = false;
	if (!o.equalLinks) o.equalLinks = false;
	if (!o.flexible) o.flexible = false;
	var nav = document.getElementById(o.menuId);
	if(nav) {
		nav.className += " scaling-active";
		var lis = nav.getElementsByTagName("li");
		var asFl = [];
		var lisFl = [];
		var width = 0;
		for (var i=0, j=0; i<lis.length; i++) {
			if(lis[i].parentNode == nav) {
				var t = lis[i].getElementsByTagName(o.tag).item(0);
				asFl.push(t);
				asFl[j++].width = t.offsetWidth;
				lisFl.push(lis[i]);
				if(width < t.offsetWidth) width = t.offsetWidth;
			}
			if(o.liHovering) {
				lis[i].onmouseover = function() {
					this.className += " hover";
				}
				lis[i].onmouseout = function() {
					this.className = this.className.replace("hover", "");
				}
			}
		}
		var menuWidth = nav.clientWidth - asFl.length*o.spacing - o.constant;
		if(o.equalLinks && width * asFl.length < menuWidth) {
			for (var i=0; i<asFl.length; i++) {
				asFl[i].width = width;
			}
		}
		width = getItemsWidth(asFl);
		if(width < menuWidth) {
			var version = navigator.userAgent.toLowerCase();
			for (var i=0; getItemsWidth(asFl) < menuWidth; i++) {
				asFl[i].width++;
				if(!o.flexible) {
					asFl[i].style.width = asFl[i].width + "px";
				}
				if(i >= asFl.length-1) i=-1;
			}
			if(o.flexible) {
				for (var i=0; i<asFl.length; i++) {
					width = (asFl[i].width - o.spacing - o.constant/asFl.length)/menuWidth*100;
					if(i != asFl.length-1) {
						lisFl[i].style.width = width + "%";
					}
					else {
						if(navigator.appName.indexOf("Microsoft Internet Explorer") == -1 || version.indexOf("msie 8") != -1 || version.indexOf("msie 9") != -1)
							lisFl[i].style.width = width + "%";
					}
				}
			}
		}
		else if(o.minPaddings > 0) {
			for (var i=0; i<asFl.length; i++) {
				asFl[i].style.paddingLeft = o.minPaddings + "px";
				asFl[i].style.paddingRight = o.minPaddings + "px";
			}
		}
		if(o.sideClasses) {
			lisFl[0].className += " first-child";
			lisFl[0].getElementsByTagName(o.tag).item(0).className += " first-child-a";
			lisFl[lisFl.length-1].className += " last-child";
			lisFl[lisFl.length-1].getElementsByTagName(o.tag).item(0).className += " last-child-a";
		}
		nav.className += " scaling-ready";
	}
	function getItemsWidth(a) {
		var w = 0;
		for(var q=0; q<a.length; q++) {
			w += a[q].width;
		}
		return w;
	}
}

/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 2013, Daniel Cantarín, omega_canta@yahoo.com 
 */


jQuery.unserialize = function(str){
		var items = str.split('&');
		var ret = "{";
		var arrays = [];
		var index = "";
		for (var i = 0; i < items.length; i++) {
			var parts = items[i].split(/=/);
			if (parts[0].indexOf("%5B") > -1 || parts[0].indexOf("[") > -1){
				index = (parts[0].indexOf("%5B") > -1) ? parts[0].replace("%5B","").replace("%5D","") : parts[0].replace("[","").replace("]","");
				if (arrays[index] === undefined){
					arrays[index] = [];
				}
				arrays[index].push( decodeURIComponent(parts[1].replace(/\+/g," ")));
			} else {
				if (parts.length > 1){
					ret += "\""+parts[0] + "\": \"" + decodeURIComponent(parts[1].replace(/\+/g," ")).replace(/\n/g,"\\n").replace(/\r/g,"\\r") + "\", ";
				}
			}
			
		};
		
		ret = (ret != "{") ? ret.substr(0,ret.length-2) + "}" : ret + "}";
		var ret2 = JSON.parse(ret);
		for (arr in arrays){
			ret2[arr] = arrays[arr];
		}
		return ret2;
}

jQuery.fn.unserialize = function(parm){
		var items = (typeof parm == "string") ? parm.split('&') : parm;
		if (typeof items !== "object"){
			throw new Error("unserialize: string or JSON object expected.");
		}
		var need_to_build = ((typeof parm == "string") && decodeURIComponent(parm).indexOf("[]=") > -1);
		items = (need_to_build) ? $.unserialize(parm) : items;
		
		
		for (var i in items){
			var parts = (items instanceof Array) ? items[i].split(/=/) : [i, (items[i] instanceof Array) ? items[i] : "" + items[i]];
			parts[0] = decodeURIComponent(parts[0]);
			if (parts[0].indexOf("[]") == -1 && parts[1] instanceof Array){
				parts[0] += "[]";
			}
			obj = this.find('[name=\''+ parts[0] +'\']');
			if (obj.length == 0){
				try{
					obj = this.parent().find('[name=\''+ parts[0] +'\']');
				} catch(e){}
			}
			if (typeof obj.attr("type") == "string" && ( obj.attr("type").toLowerCase() == "radio" || obj.attr("type").toLowerCase() == "checkbox")){
				 obj.each(function(index, coso) {
					coso = $(coso);
					if (parts[1] instanceof Array){
						for (var i2 in parts[1]){
							var val = ""+parts[1][i2];
							if (coso.attr("value") == decodeURIComponent(val.replace(/\+/g," "))){
								coso.prop("checked",true);
							} else {
								if (!$.inArray(coso.val(),parts[1])){
									coso.prop("checked",false);
								}
							}
						}
					} else {
						val = "" + parts[1];
						if (coso.attr("value") == decodeURIComponent(val.replace(/\+/g," "))){
							coso.prop("checked",true);
						} else {
							coso.prop("checked",false);
						}
					}
				 });
			} else if (obj.length > 0 && obj[0].tagName == "SELECT" && parts[1] instanceof Array && obj.prop("multiple")){
				obj.val(parts[1]);
			} else {
				var val = (parts[1] instanceof Array) ? parts[1].join("") : parts[1];
				val = (typeof val == "object") ? "" : val;
				
				obj.val(decodeURIComponent(val.replace(/\+/g," ")));
			}
		};
		return this;
}
