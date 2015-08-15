function template() {
			var doctype = $("#doctype").val();

			str1 =
			"\n     <!--  charset attribute specifies the encoding for\n" +
			"             the HTML document (utf-8 = Unicode)\n" +
			"             see http://www.unicode.org/standard/WhatIsUnicode" +
			".html -->\n";
			s = "     <!-- java script that supports HTML5 for browsers that do not -->\n"
			var oldHTML = (doctype != "HTML5" && doctype != "XHTML5");
			if (oldHTML)
				str1 = str1 + "     <!-- in HTML5 this would have been\n";
			str1 = str1 + "     <meta charset=\"utf-8\" />\n";
			if (oldHTML)
				str1 = str1 + "     but in old versions of HTML it is: -->\n" +
				"     <meta http-equiv=\"Content-type\" " +
				"content=\"text/html;charset=UTF-8\">\n";
			str1 = str1 +
				s + 
				"     <script src=\"http://www.tulane.edu/~gnorth/modernizr.js\"></script>\n" +
				"     <!-- links to external style sheet(s) go here"
			+ " -->\n" +
			"     <link href=\"name_of_some_stylesheet.css\" " +
			"rel=\"stylesheet\" type=\"text/css\" />\n";
			tempDom1 = document.implementation.createHTMLDocument("some_sort_of_name_or_the_other");
			$(tempDom1).find("head").prepend("     ").append(str1);
			var str = $("#inputHTML").val();
			
			str = str.replace("<head","<div id=\"head\"");
			str = str.replace("</head>","</div>");
			str = str.replace("<body","<div id=\"body\"");
			str = str.replace("</body>","</div>");
			if (str == null || str == "" || str == "Input HTML here...")
				str = "<div id=\"head\"></div><div id=\"body\"></div>";
			var tempDom = $('<div></div>').append($.parseHTML(str));
			console.log(tempDom);
			console.log($(tempDom).find("#head").get(0));
			while ($(tempDom).find("#head").get(0).firstChild != null &&
				$(tempDom).find("#head").get(0).firstChild.nodeType == 8) $(tempDom).find("#head").get(0).removeChild(tempDom.find("#head").get(0).firstChild);
			
			if($(tempDom).find("title").size() == 1)
				$(tempDom1).find("title").text($(tempDom).find("title").text());
			for (var i = 1; i < tempDom.find("link[rel=stylesheet]").size(); i++)
				$(tempDom1).find("link[rel"+ 
					"=stylesheet]").last().insertAfter($(tempDom).find("link[rel" +
					"=stylesheet]").last().clone());
			for (var i = 0; i < $(tempDom).find("link[rel=stylesheet]").size(); i++) {
					$(tempDom1).find("link[rel=stylesheet]").eq(i).attr("href",
						$(tempDom).find("link[rel" + 
						"=stylesheet]").eq(i).attr("href"));
					if ($(tempDom).find("link[rel" + 
						"=stylesheet]").eq(i).is("[media]"))
					$(tempDom1).find("link[rel=stylesheet]").eq(i).attr("media",
						$(tempDom).find("link[rel" +
							"=stylesheet]").eq(i).attr("media"));
			}
			$(tempDom1).find("link[rel=stylesheet]").after("\n");
			var output = ((doctype.search("XHTML") != -1) ?
				"<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n" +
				"\n" : "");
			var doctypes = {
				"HTML 2.0" : "<!DOCTYPE html PUBLIC \"-//IETF//DTD HTML 2.0//EN\">",
				"HTML 3.2" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 3.2 Final//EN\">",
				"HTML 4.01 strict" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\"\n\"http://www.w3.org/TR/html4/strict.dtd\">",
  				"HTML 4.01 transitional" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"\n \"http://www.w3.org/TR/html4/loose.dtd\">",
  "HTML 4.01 frameset" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Frameset//EN\"\n\"http://www.w3.org/TR/html4/frameset.dtd\">",
  "HTML5" : "<!DOCTYPE html>",
  "XHTML 1.0 strict" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
  "XHTML 1.0 transitional" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">",
  "XHTML 1.0 frameset" : "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Frameset//EN\"\n  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd\">",
  "XHTML5" : "<!DOCTYPE html>"
  			};
  			var now = new Date();
  			output = output + doctypes[doctype] + "\n" +
  			"<!--\n" +
  			"HTML and CSS 6th Edition: Comprehensive\n" + 
  			"Author: Stuart Simon\n" +
"Date: " + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1) + "/" + (now.getDay() < 10 ? "0" : "") + now.getDate() + "/" + now.getFullYear()  + "\n" +
  			"Text editor: jEdit, http://www.jedit.org/\n" +
  			"-->\n" +
  			"<!-- according to the W3C I should declare the language (en=english) of my Web pages -->\n" +
  			"<html lang=\"en\"" + ((doctype != "XHTML5" && doctype.search("XHTML") != -1) ? " xmlns=\"www.w3.org/1999/xhtml\"" : "") + ">\n" + "<head>\n" + innerXHTML($(tempDom1).find("head").get(0)) +
  			"</head>\n" +
  			"<body>\n" + innerXHTML($(tempDom).find("#body").get(0)) + "\n</body>\n</html>";
			$("#output").val(output);
			return false;
		} 