const { PDFDocument, rgb, StandardFonts } = PDFLib  // degrees

/*
        firstName
	    lastName
	    leglalCompanyName  //Legal Business Name
		companyEmail
		companyPhone
		startDate
		companyWebsite
        ownerEIN           // Employer identification number
		businessAddress
		ownerRole
		ownerCity
		ownerState
		ownerZipCode
*/



 async function sendReport() {
	
	$('#user-company-email').text(companyEmail)
	$('#email-send-result').html('<img src="img/preloader.gif" alt="loading">');
	
	
	var signatureDataURL = $('.signature__box').jqSignature('getDataURL');

	    console.warn("<<<-- TO SEND -->>>");
		console.log(result_output);
		console.log("DATA Total: " + DATA_TTL);
		console.log("LINE 27 941X Total: " + LINE_27_941X_TTL);
		console.log("COMMISSION_ Total: " + COMMISSION_TTL);
	
	
		
	const contPDFform8821 = await getPDFcont8821(signatureDataURL);
	const contPDFform8822B = await getPDFcont8822B(signatureDataURL);
	
		
	  // fetch PDF sample
      const formUrl = './pdf/941X.pdf'
	  const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
	  
      var leadinfo =  "Lead Report Info\r\n" +
	                  "----------------\r\n" +
					  "First name : " + firstName + "\r\n" +
					  "Last name  : " + lastName + "\r\n" +
					  "Email : " + companyEmail + "\r\n" +
					  "Phone : " + companyPhone + "\r\n" +
					  "Legal Company Name : " + leglalCompanyName + "\r\n" +
	                  "Company Website    : " + companyWebsite + "\r\n" +
					  "Businesses started : " + startDate + "\r\n" +
					  "Business Address   : " + businessAddress + "\r\n" +
					  "Zip code           : " + ownerZipCode + "\r\n" +
					  "Role  : " + ownerRole + "\r\n" +
					  "City  : " + ownerCity + "\r\n" +
	                  "State : " + stateNames[ownerState] + " / " + ownerState + "\r\n" +
					  "EIN   : " + ownerEIN + "\r\n"
	     ;
		
      
        var base64String941X  = ["", "", "", "", "", ""];
		
		for (let i = 0; i < QuarterIndex.length; i++) {
			let key = QuarterIndex[i];
			if (key in result_output) {
				base64String941X[i] = await getPDFcont941X(QuarterIndex[i],formPdfBytes,signatureDataURL);
			}
		}
      
	   
	    
		  
		/**/
		    $.post( "./php/email.php", { 
			        fconts: JSON.stringify(base64String941X),
				    fcont: contPDFform8821,
					fcontb: contPDFform8822B,
					leadinfo: leadinfo,
					email: companyEmail.trim()
			})
			.done(function(response) {
                var send_status = response;
				console.warn(send_status);
				console.log(response);
				if(typeof send_status === "undefined"){
					$('#email-send-result').html('<b> ::::: UKNOWN STATUS :::::</b>');
				} else {
				    if( send_status.trim() == "PASS") {
				       $('#email-send-result').html('<b>Successfully sent</b><br><i><small>Please check your e-mail, if can not find in inbox, then check in spam.</small></i>');
				       email_sent_flag = true;
				    } else if(send_status.trim() == ""){
					   $('#email-send-result').html('<b> ::::: UKNOWN STATUS :::::</b>');
				    }  else {
				       $('#email-send-result').html('<b> ::::: FAILED TO SENT :::::</b>');
			        }
				}
            })
            .fail(function() {
				 //$("div#csv-cont").html("<font color='red'><b>Envoyer erreur !!!</b></font><br><i>Essaie encore ...</i>");
                 $('#email-send-result').html('<b> -|-|- FAILED TO SENT -|-|-</b>');
			});
		/**/	
		   
	
}




async function getPDFcont8822B(signatureDataURL) {
	
	  
	
	   // fetch PDF sample
       const formUrl8822B = './pdf/8822-B.pdf'
	   const formPdfBytes8822B = await fetch(formUrl8822B).then(res => res.arrayBuffer())
	  
		
		// Load a PDF with form fields
       const pdfDoc8822B = await PDFDocument.load(formPdfBytes8822B)
      
	
	   const pages = pdfDoc8822B.getPages()
       const firstPage = pages[0]
	   //const { width, height } = firstPage.getSize()
	   
	   const pngImage = await pdfDoc8822B.embedPng(signatureDataURL)
	   
	   const helveticaFont = await pdfDoc8822B.embedFont(StandardFonts.Helvetica)
	   
       const pngDims = pngImage.scale(0.2)
	   
	   firstPage.drawImage(pngImage, {
           x: 100, //parseInt(width / 2),
           y: 278, //parseInt(height * 2 / 3 ),
           width: pngDims.width,
           height: pngDims.height,
       })
	   
	   firstPage.drawText(ownerRole, {
		  x: 100, 
          y: 255, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   
	   firstPage.drawText(todayDate, {
		  x: 500, 
          y: 283, 
          size: 11,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   
	   //Business name
	   firstPage.drawText(leglalCompanyName, {
		  x: 38, 
          y: 547, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   firstPage.drawText(businessAddress, {
		  x: 38, 
          y: 508, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	    firstPage.drawText(ownerEIN, {
		  x: 487, 
          y: 547, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })

	   
	         
	   //Serialize this document to a base64 encoded string
	   const base64String = await pdfDoc8822B.saveAsBase64();
		
	   
	   /*
	   // Serialize the PDFDocument to bytes (a Uint8Array)
       const pdfBytes = await pdfDoc8822B.save()

	   // Trigger the browser to download the PDF document
       download(pdfBytes, "test_8822-B.pdf", "application/pdf");
	   */
	

	   
	   return base64String;
}






async function getPDFcont8821(signatureDataURL) {
	
	  
	
	   // fetch PDF sample
       const formUrl8821 = './pdf/8821.pdf'
	   const formPdfBytes8821 = await fetch(formUrl8821).then(res => res.arrayBuffer())
	  
		
		// Load a PDF with form fields
       const pdfDoc8821 = await PDFDocument.load(formPdfBytes8821)
      
	
	   const pages = pdfDoc8821.getPages()
       const firstPage = pages[0]
	   //const { width, height } = firstPage.getSize()
	   
	   const pngImage = await pdfDoc8821.embedPng(signatureDataURL)
	   
	   const helveticaFont = await pdfDoc8821.embedFont(StandardFonts.Helvetica)
	   
       const pngDims = pngImage.scale(0.3)
	   
	   firstPage.drawImage(pngImage, {
           x: 100, //parseInt(width / 2),
           y: 134, //parseInt(height * 2 / 3 ),
           width: pngDims.width,
           height: pngDims.height,
       })
	   
	   firstPage.drawText(fullName, {
		  x: 100, 
          y: 100, 
          size: 21,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   
	   firstPage.drawText(todayDate, {
		  x: 437, 
          y: 138, 
          size: 17,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   firstPage.drawText(leglalCompanyName, {
		  x: 38, 
          y: 658, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	   firstPage.drawText(businessAddress, {
		  x: 38, 
          y: 640, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	    firstPage.drawText(ownerEIN, {
		  x: 487, 
          y: 670, 
          size: 15,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	    firstPage.drawText(companyPhone, {
		  x: 370, 
          y: 638, 
          size: 10,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	         
	   //Serialize this document to a base64 encoded string
	   const base64String = await pdfDoc8821.saveAsBase64();
		
	   
	   /*
	   // Serialize the PDFDocument to bytes (a Uint8Array)
       const pdfBytes = await pdfDoc8821.save()

	   // Trigger the browser to download the PDF document
       download(pdfBytes, "test_8821.pdf", "application/pdf");
	   */
	

	   
	   return base64String;
}



async function getPDFcont941X(Qind,formPdfBytes,signatureDataURL) {
	
	  const Qinds = Qind.split("_")
	  const Qyear = Qinds[0]
	  const Qnum = Qinds[1].slice(-1)
	
	  // Load a PDF with form fields
      const pdfDoc = await PDFDocument.load(formPdfBytes)
	
	
	  // Get the form containing all the fields
      const form = pdfDoc.getForm()
      
      const EINs = ownerEIN.split("-")
      // Employer identification number -> EIN
      const EINfield1 = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_01[0]')
	  EINfield1.setText(EINs[0])
	  
	  const EINfield2 = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_02[0]')
	  EINfield2.setText(EINs[1])
	 
	  
	  // Name
	  const nameField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_03[0]')
	  nameField.setText(fullName) 
	 
	  // Trade Name 
	  const tradeNameField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_04[0]')
	  tradeNameField.setText(leglalCompanyName)
	  
	  // Address
	  const adrField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_05[0]')
	  adrField.setText(businessAddress)
	  
	  // City
	  const cityField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_06[0]')
	  cityField.setText(ownerCity)
	  
	  // State  - must be 2 letter !!!!!
	  const stateField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_07[0]')
	  stateField.setText(ownerState)
	  
	  // ZIP
	  const zipField = form.getTextField('topmostSubform[0].Page1[0].Entity[0].f1_08[0]')
	  zipField.setText(ownerZipCode)
	  
	  //941
	  form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_01[0]').check()
	  //941-SS
      form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_01[1]').uncheck()
	  
	  //Q1: January, February, March
	  if(Qinds[1] == "Q1")
	   form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[0]').check()
	  else
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[0]').uncheck()
	  //Q2: April, May, June
	  if(Qinds[1] == "Q2")
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[1]').check()
	  else
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[1]').uncheck()
	  //Q3: July, August, September
	  if(Qinds[1] == "Q3")
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[2]').check()
	  else
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[2]').uncheck()
	  //Q4: October, November, Decembe
	  if(Qinds[1] == "Q4")
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[3]').check()
	  else
	    form.getCheckBox('topmostSubform[0].Page1[0].GrayBoxes[0].c1_02[3]').uncheck()
	  
	  //Year
	  yearField = form.getTextField('topmostSubform[0].Page1[0].GrayBoxes[0].f1_12[0]')
	  yearField.setText(Qyear)
	  
	  
	  var todayDates = todayDate.split('/'); // dd/mm/yyyyy
	  
	  //MM
	  const MMfield = form.getTextField('topmostSubform[0].Page1[0].GrayBoxes[0].f1_13[0]')
	  MMfield.setText(todayDates[1])
	  //DD
	  const DDfield = form.getTextField('topmostSubform[0].Page1[0].GrayBoxes[0].f1_14[0]')
	  DDfield.setText(todayDates[0])
	  //YYYY
	  const YYYYfield = form.getTextField('topmostSubform[0].Page1[0].GrayBoxes[0].f1_15[0]')
	  YYYYfield.setText(todayDates[2])
	  

	   const page2NameField = form.getTextField('topmostSubform[0].Page2[0].Name_ReadOrder[0].f1_03[0]')
	   page2NameField.setText(fullName) 
	   const page2EINfield1 = form.getTextField('topmostSubform[0].Page2[0].EIN_ReadOrder[0].f1_01[0]')
	   page2EINfield1.setText(EINs[0])
	   const page2EINfield2 = form.getTextField('topmostSubform[0].Page2[0].EIN_ReadOrder[0].f1_02[0]')
	   page2EINfield2.setText(EINs[1])
	   const page2QnumField = form.getTextField('topmostSubform[0].Page2[0].f2_03[0]')
	   page2QnumField.setText(Qnum) 
	   const page2QyearField = form.getTextField('topmostSubform[0].Page2[0].f1_12[0]')
	   page2QyearField.setText(Qyear)
	   
	   const page3NameField = form.getTextField('topmostSubform[0].Page3[0].Name_ReadOrder[0].f1_03[0]')
	   page3NameField.setText(fullName) 
	   const page3EINfield1 = form.getTextField('topmostSubform[0].Page3[0].EIN_ReadOrder[0].f1_01[0]')
	   page3EINfield1.setText(EINs[0])
	   const page3EINfield2 = form.getTextField('topmostSubform[0].Page3[0].EIN_ReadOrder[0].f1_02[0]')
	   page3EINfield2.setText(EINs[1])
	   const page3QnumField = form.getTextField('topmostSubform[0].Page3[0].f2_03[0]')
	   page3QnumField.setText(Qnum) 
	   const page3QyearField = form.getTextField('topmostSubform[0].Page3[0].f1_12[0]')
	   page3QyearField.setText(Qyear)
	   
	   const page4NameField = form.getTextField('topmostSubform[0].Page4[0].Name_ReadOrder[0].f1_03[0]')
	   page4NameField.setText(fullName) 
	   const page4EINfield1 = form.getTextField('topmostSubform[0].Page4[0].EIN_ReadOrder[0].f1_01[0]')
	   page4EINfield1.setText(EINs[0])
	   const page4EINfield2 = form.getTextField('topmostSubform[0].Page4[0].EIN_ReadOrder[0].f1_02[0]')
	   page4EINfield2.setText(EINs[1])
	   const page4QnumField = form.getTextField('topmostSubform[0].Page4[0].f2_03[0]')
	   page4QnumField.setText(Qnum) 
	   const page4QyearField = form.getTextField('topmostSubform[0].Page4[0].f1_12[0]')
	   page4QyearField.setText(Qyear)
	   
	   const page5NameField = form.getTextField('topmostSubform[0].Page5[0].Name_ReadOrder[0].f1_03[0]')
	   page5NameField.setText(fullName) 
	   const page5EINfield1 = form.getTextField('topmostSubform[0].Page5[0].EIN_ReadOrder[0].f1_01[0]')
	   page5EINfield1.setText(EINs[0])
	   const page5EINfield2 = form.getTextField('topmostSubform[0].Page5[0].EIN_ReadOrder[0].f1_02[0]')
	   page5EINfield2.setText(EINs[1])
	   const page5QnumField = form.getTextField('topmostSubform[0].Page5[0].f2_03[0]')
	   page5QnumField.setText(Qnum) 
	   const page5QyearField = form.getTextField('topmostSubform[0].Page5[0].f1_12[0]')
	   page5QyearField.setText(Qyear)
	   
	   // Page 2
	   
	   //18 A
	   //18 A C1
	   const page2_cell_18a_c1 = form.getTextField('topmostSubform[0].Page2[0].f2_99[0]')
	   page2_cell_18a_c1.setText('' + Math.round(result_output[Qind].NonRefundableTaxes) + '')
       //topmostSubform[0].Page2[0].f2_100[0]
	   
	   //18 A C3
       const page2_cell_18a_c3 = form.getTextField('topmostSubform[0].Page2[0].f2_103[0]')
	   page2_cell_18a_c3.setText('' + Math.round(result_output[Qind].NonRefundableTaxes) + '')
       //topmostSubform[0].Page2[0].f2_104[0]
	   
	   //18 A C4
	   const page2_cell_18a_c4 = form.getTextField('topmostSubform[0].Page2[0].f2_105[0]')
	   page2_cell_18a_c4.setText('-' + Math.round(result_output[Qind].NonRefundableTaxes) + '')
       //topmostSubform[0].Page2[0].f2_106[0]

	   
	   //Page 3
	   
	   //23 C4
	   const page3_cell_23c4 = form.getTextField('topmostSubform[0].Page3[0].f3_139[0]')
	   page3_cell_23c4.setText('-' + Math.round(result_output[Qind].NonRefundableTaxes) + '')
       //topmostSubform[0].Page3[0].f3_140[0]

	   //26 A
	   //26 A C1
	   const page3_cell_26a_c1 = form.getTextField('topmostSubform[0].Page3[0].f3_157[0]')
	   page3_cell_26a_c1.setText('' + Math.round(result_output[Qind].RefundablePortionResult1) + '')
       //topmostSubform[0].Page3[0].f3_158[0]
	   
	   //26 A C3
	   const page3_cell_26a_c3 = form.getTextField('topmostSubform[0].Page3[0].f3_161[0]')
	   page3_cell_26a_c3.setText('' + Math.round(result_output[Qind].RefundablePortionResult1) + '')
       //topmostSubform[0].Page3[0].f3_162[0]
	   
	   //26 A C4
	   const page3_cell_26a_c4 = form.getTextField('topmostSubform[0].Page3[0].f3_163[0]')
	   page3_cell_26a_c4.setText('' + Math.round(result_output[Qind].RefundablePortionResult3) + '')
       //topmostSubform[0].Page3[0].f3_164[0]
	   
	   //27
	   const page3_cell_27 = form.getTextField('topmostSubform[0].Page3[0].f3_181[0]')
	   page3_cell_27.setText('' + Math.round(result_output[Qind].ttlERCresult2) + '')
       //topmostSubform[0].Page3[0].f3_182[0]
	   
	   //30
	   //30 C1
	   const page3_cell_30c1 = form.getTextField('topmostSubform[0].Page3[0].f3_195[0]')
	   page3_cell_30c1.setText('' + Math.round(result_output[Qind].QualifiedWages) + '')
       //topmostSubform[0].Page3[0].f3_196[0]
	   
	   //30 C3
	   const page3_cell_30c3 = form.getTextField('topmostSubform[0].Page3[0].f3_199[0]')
	   page3_cell_30c3.setText('' + Math.round(result_output[Qind].QualifiedWages) + '')
       //topmostSubform[0].Page3[0].f3_200[0]
	   
	   
	   //Page 5  
	   const page5NameField2 = form.getTextField('topmostSubform[0].Page5[0].f5_32[0]')
	   page5NameField2.setText(fullName)
	   
	   const page5PhoneField = form.getTextField('topmostSubform[0].Page5[0].f5_34[0]')
	   page5PhoneField.setText(companyPhone)
	   
	   
	   const pages = pdfDoc.getPages()
       const page_5 = pages[4]
	   //const { width, height } = page_5.getSize()
	   
	   const pngImage = await pdfDoc.embedPng(signatureDataURL)
	   
	   const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
	   
       const pngDims = pngImage.scale(0.5)
	   
	   page_5.drawImage(pngImage, {
           x: 150, //parseInt(width / 2),
           y: 217, //parseInt(height * 2 / 3 ),
           width: pngDims.width,
           height: pngDims.height,
       })
	   
	   page_5.drawText(todayDate, {
		  x: 147, 
          y: 190, 
          size: 11,
          font: helveticaFont,
          color: rgb(0.95, 0.1, 0.1),
       })
	   
	         
	   //Serialize this document to a base64 encoded string
	   const base64String = await pdfDoc.saveAsBase64();
		
	   
	   /*
	   // Serialize the PDFDocument to bytes (a Uint8Array)
       const pdfBytes = await pdfDoc.save()

	   // Trigger the browser to download the PDF document
       download(pdfBytes, "test_941X_" + Qind + ".pdf", "application/pdf");
	   */
	
	   return base64String;
}
