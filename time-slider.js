/**
 * time-slider.js
 */
;(function($){
	
	"use strict";
	
	var  pluginName = "timeSlider",
	
	defaults = {
		url:undefined,
		param:undefined,
		select:undefined,
		callback:undefined,
		error:undefined,
		element:undefined
	};
	
	var getDateList =  function(_this,_time){
		_this.options.labels = [];
		if(Array.isArray(_time)){
			$.each(_time,function(idx,elm){
				for (var i = 1; i <= 12; i++) {
					_this.options.labels.push(elm+"".concat(".",(i < 10 ? "0"+i : i)));
				}
			});
		}
	};
	
	var findDateIndex = function(_this,_year,_month){
		var _label = (Array.isArray(_year) ? _year.join() : _year).concat(".",(Array.isArray(_month) ? _month.join() : _month));
		return _this.options.labels.findIndex(function(elm,idx,arr){return elm == _label;});
	};
	
	var findYear = function(_this,_idx){
		return _this.options.labels[_idx].split(".")[0];
	};
	
	var findMonth = function(_this,_idx){
		return _this.options.labels[_idx].split(".")[1];
	};
	
	function TimeSlider(element, options) {
		this.element = element;
		this.$el = $(element);
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
	    this._name = pluginName;
	    this.initialize();
	}

	$.extend(TimeSlider.prototype, {
		initialize: function() {
			if(this.initParameters()){
				this.initContainer();
				this.events();
			}else{
				this.$el.removeClass("time-parent");
			}
		},
		initParameters: function(){
			
			var $year = undefined, $month = undefined, $step = undefined;
			
			if($(".map").length > 1) return false;
			
			//년도리스트
			var $time = $(this.options.select.concat(" option")).map(function(){return parseInt(this.value);}).get();
			if(!Array.isArray($time)){
				alert("날짜 정보를 가져올 수 없습니다.\n관리자에게 문의하세요.");
				return false;
			}
			
			$time.sort();
			
			//검색파라메터
			var $year = this.options.param.year || undefined;
			var $month = this.options.param.month || undefined;
			
			//단일선택여부 년도,월 둘다 하나만 체크되어야함..
			var $range = (Array.isArray($year) && $year.length > 1 || Array.isArray($month) && $month.length > 1);
			
			if($range) return false;

			if($month){
				getDateList(this,$time);
				this.options.min = 1;
				this.options.max = 12;//this.options.labels.length-1;
				this.options.step = 1;
				this.options.value = parseInt($month);//findDateIndex(this,$year,$month);
			}else{
				if($time.length == 1) return false;
				
				this.options.min = $time[0];
				this.options.max = $time[$time.length-1];
				this.options.step = 1;
				this.options.value = parseInt($year);
			}
			return true;
		},
		
		initContainer: function(){
			
			this.$el.addClass("time-parent").show();
			this.$container = $("<div class=\"time-area\"></div>");
			this.$slider = $("<div class=\"slider\"></div>");
			this.$container.append(this.$slider);//.append(this.$labels);
			this.$el.prepend(this.$container);
			
			this.initSlider();
		},
		
		events: function(){
			var _this = this;
			
			this.$slider.off("slidecreate").on("slidecreate",function(e,ui){
				console.log("slidecreate");
			});
			
			this.$slider.off("slide").on("slide",function(e,ui){
				console.log(ui.value);
				if(_this.options.param.month){
					if(Array.isArray(_this.options.param.month)){
						var value = ui.value < 10 ? "0"+ui.value : ui.value;
						_this.options.param.month = [value];
					}else{
						_this.options.param.month = value;
					}
				}else{
					if(Array.isArray(_this.options.param.year)){
						_this.options.param.year = [ui.value];
					}else{
						_this.options.param.year = ui.value;
					}
				}
				
				_this.options.method(_this.options.url, _this.options.param, _this.options.callback, _this.options.error, _this.options.element);
			});
			
			this.$slider.off("change").on("change",function(e,ui){
				console.log("change");
			});
			
			this.$slider.off("slidechange").on("slidechange",function(e,ui){
				console.log("slidechange");
			});
			
			this.$slider.off("slidestop").on("slidestop",function(e,ui){
				console.log("slidestop");
			});
		},
		
		initSlider: function(){
			var _this = this;
			
			this.$slider.slider({
				animate: true,
				range: "min",
				value:this.options.value,
				min:this.options.min,
				max:this.options.max,
				step:this.options.step
			})
			.each(function(){
				var $options = $(this).data().uiSlider.options;
				var $values = $options.max - $options.min;
				
				for (var i = 0; i <= $values; i++) {
					var $label = $options.min+i < 10 ? "0"+($options.min+i) : $options.min+i;
					var $el = $("<label>".concat($label,"</label>")).css("left",(i/$values*100)+"%");
					
					_this.$slider.append($el);
				}
			});
		}
	});
	
	$.fn[pluginName] = function(options){
		return this.each(function(){
			if($.data(this,pluginName)){
				$(this).empty();
			}
			$.data(this,pluginName,new TimeSlider(this,options));
		});
	};
}(jQuery));