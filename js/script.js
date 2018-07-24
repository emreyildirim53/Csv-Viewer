$(document).ready(function() {

	//File Select
	$('.tables').hide();
  var objectFileList=new Array();
	var inputs = document.querySelectorAll('.inputfile');

	Array.prototype.forEach.call(inputs,function(input)
	{
		var label	 = input.nextElementSibling,
				labelVal = label.innerHTML;

		input.addEventListener('change',function(e){
			$('.tables').show();
			var fileName = '';
			if(this.files && this.files.length>1)
				fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
			else
				fileName = e.target.value.split('\\').pop();

			if(fileName){
				label.querySelector('span').innerHTML = fileName;
				handleFileSelect(e);
			}else
				label.innerHTML = labelVal;
		});
	});
	//Read File
	function handleFileSelect(evt){
	    var files = evt.target.files; // FileList object
	    // Loop through the FileList and render image files as thumbnails.
	    for (var i = 0, f; f = files[i]; i++)
	    {
	        var reader = new FileReader();
	        reader.onload = (function(reader){
	            return function(){
								try{
									var contents = reader.result;
	                var lines = contents.split('\n');
	                //////
									$(".message").html("");
									objectFileList=[];
									lines.forEach(function(line) {
										var datas=line.split(';');
										if(datas.length>4) return;
										var head=datas[0];
										var content=datas[1];
										var words=datas[2].replace(new RegExp(escapeRegExp(","), 'g'), ", ");
										var betweenness=datas[3];

										var objectFile={
											head:head,
											content:content,
											words:words,
											betweenness:betweenness
										};
										objectFileList.push(objectFile);
									});
									createRows();
									//console.log(objectFileList);
								}catch (e){
										$(".message").html("!!Hata!!\nDosya formatı geçerli olmayabilir.\nDört sütundan oluşmalıdır.");
								    console.log(e.stack)  // this will work on chrome, FF. will no not work on safari
								    console.log(e.line)  // this will work on safari but not on IPhone
								}
	            }
	        })(reader);
	        reader.readAsText(f);
	   }
	}
	function escapeRegExp(str) {
	    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	//Create table
	function createRows(){
		if(objectFileList){
			$("tbody").empty();
			objectFileList.forEach(function(row) {
				$("tbody").append($('<tr>')
		        .append($('<td>')
							  .addClass('column1')
	              .text(row.head)
						)
						.append($('<td>')
							  .addClass('column2')
	              .text(row.content)
						)
						.append($('<td>')
							  .addClass('column3')
	              .text(row.words)
						)
						.append($('<td>')
							  .addClass('column4')
	              .text(row.betweenness)
						)
		   );
		 });
		}
	}
	$(function() {
	    var pressed = false;
	    var start = undefined;
	    var startX, startWidth;

	    $("table th").mousedown(function(e) {
	        start = $(this);
	        pressed = true;
	        startX = e.pageX;
	        startWidth = $(this).width();
	        $(start).addClass("resizing");
	    });

	    $(document).mousemove(function(e) {
	        if(pressed) {
	            $(start).width(startWidth+(e.pageX-startX));
	        }
	    });

	    $(document).mouseup(function() {
	        if(pressed) {
	            $(start).removeClass("resizing");
	            pressed = false;
	        }
	    });
	});
});
