$(document).ready(function() {

  var objectFileList=new Array();//Oluşturulan her bir satır objenin tutulduğu dizi
	var inputs = document.querySelectorAll('.inputfile');
  var inputChangeEvnt; //İnput eventini span click fonksiyonunda kullanmak için

	//*.csv file selected
	Array.prototype.forEach.call(inputs,function(input){
		var label	 = input.nextElementSibling,
				labelVal = label.innerHTML;

		input.addEventListener('change',function(e){
      // Tags divi temizleme
      var colNode=$(".tagsCols")[0];
      while (colNode.hasChildNodes())
          colNode.removeChild(colNode.lastChild);

      // yüklenen dosya sayısı kontrolü
			var $fileUpload = $("input[type='file']");
			if (parseInt($fileUpload.get(0).files.length)>2)
			 	label.querySelector('span').innerHTML = "En fazla 2 dosya yükleyebilirsiniz.";
		  else{
        // tags içerisine span oluşturma (Seçilen dosya isimleri)
        for (var i = 0; i < this.files.length; ++i) {
          var span=$('<span>').text(this.files.item(i).name);
          if(i==0) span.addClass('selected');
          $(".tags").find(">:first-child").append(span);
        }

				$('.tables').show();
				var fileName = '';
				if(this.files && this.files.length>1)
					fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
				else
					fileName = e.target.value.split('\\').pop();

				if(fileName){
					label.querySelector('span').innerHTML = fileName;
          inputChangeEvnt=e;
					handleFileSelect(e);
				}else
					label.innerHTML = labelVal;
			}
		});
	});
	//Read *.csv File
	function handleFileSelect(evt){
	    var files = evt.target.files; // FileList object
      var file;
      var uniqList=new Array();
      var fileContList=new Array();

      // Seçilen tag'e göre dosya yükleme
      for(var i=0 in files)
        $('.tagsCols span').each(function () {
            if(files[i].name==this.innerHTML && this.className=='selected')
              file=files[i];
            if(!uniqList.includes(files[i]))
              uniqList.push(files[i]);
        });


      for(var i=0 in uniqList){
        var reader = new FileReader();
        reader.onload = (function(reader){
                       return function(){
                         try{
                           fileContList.push(reader.reader);
                           //console.log(JSON.parse(csvJSON(reader.result)));
                           var contents = reader.result;
                           var lines = contents.split('\n');

                           //////
                           $(".message").html("");
                           objectFileList=[];
                           lines.forEach(function(line) {
                             var datas=line.split(';');
                             if(datas.length>4) return;

                             if(lines[0]==line){
                                 $("thead").empty();
                                 var thead=$("thead").append($('<tr>')
                                   .addClass('table100-head')
                                   .append($('<th>').text(datas[0]))
                                   .append($('<th>').text(datas[1]))
                                   .append($('<th>').text(datas[2]))
                                   .append($('<th>').text(datas[3]))
                                 );
                             }else{

                                 var head,content,words,betweenness;
                                 (datas[0]) ? head=datas[0]: head="";
                                 (datas[1]) ? content=datas[1]: content="";
                                 (datas[2]) ? words=datas[2].replace(new RegExp(escapeRegExp(","), 'g'), ", "): words="";
                                 (datas[3]) ? betweenness=datas[3]: betweenness="";

                                 var objectFile={
                                   head:head,
                                   content:content,
                                   words:words,
                                   betweenness:betweenness
                                 };
                                 objectFileList.push(objectFile);
                             }
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
                   if(uniqList[i])
        reader.readAsText(uniqList[i]);
      }
	}

  function createJSON(fileContList){
    console.log(fileContList);
    for(var i=0 in fileContList)
      console.log(fileContList[i]);
  }

  function createIdeas(csv){

    var lines=csv.split('\n');

    var result = [];

    var headers=lines[0].split(';');

    for(var i=1;i<lines.length;i++){

  	  var obj = {};
  	  var currentline=lines[i].split(';');

  	  for(var j=0;j<headers.length;j++)
  		  obj[headers[j]] = currentline[j];


  	  result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }

	//kelimeler arasına boşluk atıldı
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
		$('html, body').animate({scrollTop: $(".tables").offset().top}, 1500);
	}
	//Tablo headerını boyutlandırma
	$(function() {
	    var pressed = false,start = undefined,startX, startWidth;
	    $("table th").mousedown(function(e) {
	        start = $(this);
	        pressed = true;
	        startX = e.pageX;
	        startWidth = $(this).width();
	        $(start).addClass("resizing");
	    });

	    $(document).mousemove(function(e) {
	        if(pressed) {$(start).width(startWidth+(e.pageX-startX));}
	    });

	    $(document).mouseup(function() {
	        if(pressed)$(start).removeClass("resizing");pressed = false;
	    });
	});
  //Buttonlar arası geçiş işlemi
	$(".tags").on('click','span',function() {
    	$(this).addClass('selected').siblings().removeClass('selected');
    	handleFileSelect(inputChangeEvnt);
	});
	//Network analysis buton işlevi
	$( ".uploadNetwork" ).click(function() {
		$('body').css("padding-bottom","100px");
		$('html, body').animate({scrollTop: $(".bar").offset().top}, 2000);
		$(".cards").slideUp('slow');
		$(".bar").slideDown('slow');
	});

});
