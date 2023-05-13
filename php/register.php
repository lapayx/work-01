<?php

if (!preg_match("/^https\:\/\/tryarti\.com?[\/\w\W]*$/", $_SERVER['HTTP_REFERER'])) {
	exit('Accès refusé');
}


//error_reporting(E_ALL);
//ini_set('display_errors', '1');

//$output = [];
//$output = array();
$output = "";


$report_info = "";


if (isset($_REQUEST['leadinfo']))
  $report_info = $_REQUEST['leadinfo'];

            $datetime = new DateTime(date("Y/m/d H:i:s"));
		    $datetime->setTimezone(new DateTimeZone('America/Los_Angeles'));


            $headers_report = "From: Arti Report <contact@tryarti.com>\r\n";
			$headers_report .= 'MIME-Version: 1.0' . "\r\n";
            $headers_report .= 'Content-type: text/plain; charset=utf-8' . "\r\n";
	        $sub_report = "Arti ERC impression ".$datetime->format('Y/m/d H:i:s e');
			//$to_report = 'arsen_kocharyan@yahoo.com';
			$to_report = 'leads@tryarti.com';
			//$to_report = 'plee@tryarti.com';
			$body_report = $report_info;
			
		      if(@mail($to_report,$sub_report,$body_report,$headers_report)) $output = "PASS";
              elseif (@mail($to_report,$sub_report,$body_report,$headers_report)) $output = "PASS";
			  else $output = "FAIL";
				

//echo json_encode($output);
//echo $output["result"];
echo $output;

?>

