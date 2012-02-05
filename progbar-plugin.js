/*
 ************************************************************
 *                   JQuery canvas-based progress bar plugin
 *  author: Tam Vu
 *  version: 0.1
 *  desc: turn any canvas element into a progress bar
 ************************************************************
 */

(function($){
	
	var methods = {
		//initialize the canvas
		init: function(options){
			
			//extends input options with default settings
			var settings= $.extend({
				'width' : 80,
				'height': 10,
				'units' : 8,
				'stroke': '#fff',
				'fill'  : '#ccc',
				'cursor': '#666',
				'interval': 400
			},options);
			
			//initialize each canvas selected
			this.each(function(){
				var $cvs = $(this)
				var data = $cvs.data('progressBar');
				if(!data){
					$cvs.attr({width:settings.width, height: settings.height});
					var ctx = this.getContext('2d');
					ctx.strokeStyle = settings.stroke;
					var unitW = settings.width / settings.units;
					for (var i = 0; i < settings.units; i++){
						ctx.strokeRect(i*unitW, 0, unitW, settings.height);
					}

					//set data state
					$cvs.data('progressBar',{
						settings: settings,
						unitW: unitW,
						order:0
					});
				}
			});
			console.log("Done init progress bar");
			
		},

		start: function(){
			this.each(function(){
				var $cvs = $(this);
				var data = $cvs.data('progressBar');
				if(!data){
					$.error("Element is not yet initialized");
				}
				else{
					$cvs.css('display','block');
					
					var callback = function(){
						var ctx = $cvs.get(0).getContext('2d');
 						ctx.fillStyle = data.settings.fill;
						//pain progress bar
						for ( var i = 0 ;i < data.settings.units; i ++ ){
							ctx.fillRect(i*data.unitW+1, 1,data.unitW -2, data.settings.height-2);
						}
						//highlight cursor
						ctx.fillStyle = data.settings.cursor;
						ctx.fillRect(data.order* data.unitW +1, 1, data.unitW -2, data.settings.height-2);
				
						//lapse cursor
						data.order = data.order + 1;	
						if(data.order >= data.settings.units)
							data.order = 0;
						data.timer = setTimeout(callback, data.settings.interval);
					};
					var timer = setTimeout(callback,data.settings.interval);

					//$cvs.data({timer: timer});
					data.timer = timer;
				}		
			});
		},

		stop: function(){
			this.each(function(){
				var $cvs = $(this);
				var data = $cvs.data('progressBar');
				if(!data){
					$.error("Element is not yet initialized");
				}
				else{
					$cvs.css('display','hidden');
					clearTimeout(data.timer);
				}
			});
		}
	}	

	$.fn.progressBar = function(method){
		//get Canvas element context
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments,1));
		}
		else if (typeof(method) ==='object' || !method){
			return methods.init.apply(this,arguments);
		}
		else{
			$.error('Mehod ' + method + ' does not exist onjQuery.progressBar');
		}
	};
})(jQuery);
