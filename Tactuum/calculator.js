var ibw = 0;
var abw = 0;
function calculate () {
	if ($.find("#cm").val() != "" && $.find("#inches").val() != "" && $.find("#kg").val() != "" && $.find("#lbs").val() != "") {
		if (number($.find("#inches").val()) > 60) {
			if ($.find("$input[name=gender]:checked").val() == "male")
				ibw = 2.3 * (Number($.find("#inches").val()) - 60) + 50;
			else
				ibw = 2.3 * (Number($.find("#inches").val()) - 60) + 45;
			abw = (Number($.find("#kg").val()) - ibw) * 0.4 + ibw;
			$.find("#ibw").html("IBW: " + String(ibw) + " kg (" + String(ibw * 2.20462) + " lbs)");
			$.find("#abw").html("ABW" + ((abw < ibw) ? " is less than IBW." : ": " + String(abw) + " kg (" + String(abw * 2.20462) + " lbs)"));
		}
	}
}

$("#male").select( function() {
		calculate();
});

$("#female").select( function() {
		calculate();
});

$("#cm").on( "blur", function() {
		$.find("#inches").val(String(Number($.find("#cm").val())/2.54));
		if (Number($.find("#inches").val()) < 60)
			$.find("#height-warning").html("The formulas used in this calculator are valid only for individuals > 60 inches (" + String(60 * 2.54) + " cm).");
		else {
			$.find("#height-warning").html("");
			calculate();
		}
});

$("#inches").on("blur", function() {
		$.find("#cm").val(String(Number($.find("#inches").val())*2.54));
		if (Number($.find("#inches").val()) < 60)
			$.find("#height-warning").html("The formulas used in this calculator are valid only for individuals > 60 inches (" + String(60 * 2.54) + " cm).");
		else {
			$.find("#height-warning").html("");
			calculate();
		}
});

$("#kg").on( "blur" , function() {
		$.find("#lbs").val(String(Number($.find("#kg").val()) * 2.20462));
		calculate();
}

$("#lbs").on( "blur" , function() {
		$.find("#kg").val(String(Number($.find("#lbs").val()) / 2.20462));
		calculate();
}
			