$(document).ready(function(){
	
	$('.sel select').change(function(){
		var val=$(this).find('option:selected').text();
		$(this).parent().find('span').text(val);
	});

	$('.menu_m ul li.lev1>a').click(function(){
		if ($(this).parent().hasClass('active'))
			{
				$('.menu_m_pic').empty();
				$(this).parent().removeClass('active');
			}
		else
			{
				$(this).parent().parent().find('li.lev1').removeClass('active');
				$(this).parent().addClass('active');
				var pic = $(this).parent().find('.pic').html();
				$('.menu_m_pic').empty();
				$('.menu_m_pic').html(pic);
			}
		return false;
	});

	$('.hold-drop').click(function(){
		if ($('.address_h').hasClass('ext')) {$('.address_h').removeClass('ext');$(this).removeClass('active')}
		else {$('.address_h').addClass('ext');$(this).addClass('active');}
	});
	$('.ah_ext_item').click(function(){
		if ($(this).hasClass('ah_ext_item_active')) {}
		else {
			$(this).siblings().removeClass('ah_ext_item_active');
			$(this).addClass('ah_ext_item_active');
			$('span.hold-drop>span').html( $('.ah_ext_item_city', this).text() );
			$('span.phone_num').text( $('.ah_ext_item_phone', this).text() );
			$.cookie('__location', $(this).data('loc'), { expires: 365, path: '/' });
		}
	});

	$('.opinions .op_ext').click(function(){
		if ($(this).parent().hasClass('opinions_ext')) {$(this).parent().removeClass('opinions_ext');}
		else {$(this).parent().addClass('opinions_ext');}
	});

	$('.prod_b_tabs .tab_item').each(function(){
		if ($(this).hasClass('active')) {
			var tab_html = $(this).find('.tab_item_c').html();
			$(this).parent().parent().parent().find('.prod_b_i').html(tab_html);
		}
	})

	$('.prod_b_tabs .tab_item a').click(function(){
		if ($(this).parent().hasClass('active')) {}
		else {
			$(this).parent().parent().find('.tab_item').removeClass('active');
			$(this).parent().addClass('active');
			var tab_html = $(this).parent().find('.tab_item_c').html();
			$(this).parent().parent().parent().parent().find('.prod_b_i').empty();
			$(this).parent().parent().parent().parent().find('.prod_b_i').html(tab_html);
		}
		return false;
	});

	$('.map_show').click(function(){
		if ($(this).parent().parent().find('.mi_map').toggleClass('mi_map_show')) {}
		return false;
	});
	$('.map_close').click(function(){
		if ($(this).parent().toggleClass('mi_map_show')) {}
		return false;
	});

	// Комментарии
	$('.opinions span.num').text( '(' + $('div.op_b').length + ')' );

	// Локация
	//if( $.cookie('__location') ) { $('.ah_ext_item[data-loc='+$.cookie('__location')+']').click(); }

	// Торговые залы
	$(".markets_item_1 .mi_pics_i").jCarouselLite({
		visible: 1,
		btnNext: ".markets_item_1 .mi_pics .prev",
		btnPrev: ".markets_item_1 .mi_pics .next",
		speed: 500
	});
	$(".markets_item_2 .mi_pics_i").jCarouselLite({
		visible: 1,
		btnNext: ".markets_item_2 .mi_pics .prev",
		btnPrev: ".markets_item_2 .mi_pics .next",
		speed: 500
	});
	$('.mi_pics a').click(function(){return false;});

	if( $('.breadcrumbs a').length == 0 )
	{
		$('.breadcrumbs').hide();
	}
});

function addToBasket( obj , item )
{
	$(obj).text('Добавляем в заявку...');
	$.ajax({
		url: document.location.href + '?tobasket=yes&product_id=' + item,
		success: function( data ) {
			$('.cart_h a span').text( data );
			$(obj).text('Товар в заявке').addClass('added');
			$(obj).next('a.checkout').show();
		},
		error: function(){
			$(obj).text('Произошла ошибка.');
		}
	});
	return false;
}