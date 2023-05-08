<?php

if (!preg_match("/^https\:\/\/tryarti\.com?[\/\w\W]*$/", $_SERVER['HTTP_REFERER'])) {
	exit('Accès refusé');
}


//error_reporting(E_ALL);
//ini_set('display_errors', '1');

//$output = [];
//$output = array();
$output = "";

$pdf_cont = "";
$pdf_cont_b = "";
$to = '';
$pdf_conts = array("", "", "", "", "", "");
$report_info = "";

$Qinds = array("2Q2020", "3Q2020", "4Q2020", "1Q2021", "2Q2021", "3Q2021");

if (isset($_REQUEST['fcont']))
  $pdf_cont = $_REQUEST['fcont'];

if (isset($_REQUEST['fcontb']))
  $pdf_cont_b = $_REQUEST['fcontb'];

if (isset($_REQUEST['email']))
  $to = $_REQUEST['email'];

if (isset($_REQUEST['fconts']))
  $pdf_conts = json_decode($_REQUEST['fconts']);

if (isset($_REQUEST['leadinfo']))
  $report_info = $_REQUEST['leadinfo'];

//$to = 'arsen_kocharyan@yahoo.com';
//$to = 'arsen1978@yandex.ru';
$from = 'no-reply@tryarti.com';
$sub = "Arti ERC report";
$msg = "<b>Arti ERC test</b>";


// boundary
$boundary = uniqid();
//$bound = "RANDOM";

// header information
$headers = "From: Arti ERC <".$from.">\r\n";
/*
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\".$boundary.\"\r\n";
*/
// for report  ->   leads@tryarti.com
// BCC -> print@tryarti.com
// main BCC -> will be open after development
$headers .= "Bcc: print@tryarti.com\r\n";
// BCC for test
//$headers .= "Bcc: arsen_kocharyan@yahoo.com\r\n";

$headers .= "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"";


//$headers = 'From: '.$from ; 

            //$headers  = 'MIME-Version: 1.0' . "\r\n";
            //$headers.= 'Content-type: text/plain; charset=utf-8' . "\r\n";
			
			//$headers = "MIME-Version: 1.0" . "\r\n";
            //$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

            //$headers.= 'From: Arti ERC <no-reply@tryarti.com>' . "\r\n";
		
		    $datetime = new DateTime(date("Y/m/d H:i:s"));
		    $datetime->setTimezone(new DateTimeZone('America/Los_Angeles'));
		
			 $msg."<br><br>".$datetime->format('Y/m/d H:i:s e');
			 
			 //<br><img src='https://tryarti.com/img/logo.svg'>
			 // attachment
$body = "--{$boundary}" . "\r\n";
$body .= "Content-type: text/html; charset=utf-8" . "\r\n\r\n";
$body .= "<p><b>ERC PDF Report</b><p><br><a href='https://tryarti.com' ><img src='https://tryarti.com/file-erc/img/logo.png'/></a>" . "\r\n";



$body .= "--{$boundary}" . "\r\n";
$body .= "Content-Type: application/octet-stream; name=\"8821.pdf\"" . "\r\n";
$body .= "Content-Transfer-Encoding: base64" . "\r\n";
$body .= "Content-Disposition: attachment" . "\r\n\r\n";
$body .= chunk_split($pdf_cont) . "\r\n";

$body .= "--{$boundary}" . "\r\n";
$body .= "Content-Type: application/octet-stream; name=\"8822-B.pdf\"" . "\r\n";
$body .= "Content-Transfer-Encoding: base64" . "\r\n";
$body .= "Content-Disposition: attachment" . "\r\n\r\n";
$body .= chunk_split($pdf_cont_b) . "\r\n";
//$body .= chunk_split(base64_encode(file_get_contents("../pdf/8822-B.pdf"))) . "\r\n";

		 
		for ($Qind = 0; $Qind < count($Qinds); $Qind++) {
            if($pdf_conts[$Qind] != "") {
			    $body .= "--{$boundary}" . "\r\n";
                $body .= "Content-Type: application/octet-stream; name=\"".$Qinds[$Qind]."_941X.pdf\"" . "\r\n";
                $body .= "Content-Transfer-Encoding: base64" . "\r\n";
                $body .= "Content-Disposition: attachment" . "\r\n\r\n";
                $body .= chunk_split($pdf_conts[$Qind]) . "\r\n";
			}
        }
	
		
$body .= "--{$boundary}--";


                if (@mail($to,$sub,$body,$headers)) $output = "PASS";
				elseif (@mail($to,$sub,$body,$headers)) $output = "PASS";
				else $output = "FAIL";

			//echo $sub."<br><br>";
			// header information
            $headers_report = "From: Arti Report <contact@tryarti.com>\r\n";
			$headers_report .= 'MIME-Version: 1.0' . "\r\n";
            $headers_report .= 'Content-type: text/plain; charset=utf-8' . "\r\n";
	        $sub_report = "Arti ERC lead ".$datetime->format('Y/m/d H:i:s e');
			//$to_report = 'arsen_kocharyan@yahoo.com';
			$to_report = 'leads@tryarti.com';
			$body_report = $report_info."\r\n==============================\r\nClient received e-mail status : ".$output;
			
		      if(@mail($to_report,$sub_report,$body_report,$headers_report));
              elseif (@mail($to_report,$sub_report,$body_report,$headers_report));
			  else @mail($to_report,$sub_report,$body_report,$headers_report);
				

//echo json_encode($output);
//echo $output["result"];
echo $output;

?>

