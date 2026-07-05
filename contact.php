<?php
// MIYO Global contact handler: validation, honeypot, header-injection guard, length caps, simple rate limit.
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
$TO='staffing@miyoglobal.com'; $FROM='no-reply@miyoglobal.com';
if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['ok'=>false,'error'=>'Method not allowed']);exit;}
if (!empty($_POST['website'])){echo json_encode(['ok'=>true]);exit;} // honeypot
// simple per-IP rate limit: 5 posts / 10 min
$ip=preg_replace('/[^0-9a-fA-F:.]/','',$_SERVER['REMOTE_ADDR']??'x');
$rl=sys_get_temp_dir().'/miyo_rl_'.md5($ip);
$hits=is_file($rl)?json_decode((string)file_get_contents($rl),true):[];
$hits=array_values(array_filter(is_array($hits)?$hits:[],fn($t)=>$t>time()-600));
if(count($hits)>=5){http_response_code(429);echo json_encode(['ok'=>false,'error'=>'Too many requests. Please try again later or email us directly.']);exit;}
$hits[]=time(); @file_put_contents($rl,json_encode($hits));
$cap=function($v,$n){return mb_substr(trim((string)$v),0,$n);};
$name=$cap($_POST['name']??'',120); $email=$cap($_POST['email']??'',160);
$company=$cap($_POST['company']??'',160); $phone=$cap($_POST['phone']??'',40);
$message=$cap($_POST['message']??'',4000);
if($name===''||!filter_var($email,FILTER_VALIDATE_EMAIL)||$message===''){
  http_response_code(422);echo json_encode(['ok'=>false,'error'=>'Please add your name, a valid work email, and a message.']);exit;}
$clean=fn($s)=>str_replace(["\r","\n"],' ',$s);
$subject='Staffing enquiry from '.$clean($name).($company?' ('.$clean($company).')':'');
$body="Name: $name\nEmail: $email\nCompany: $company\nPhone: $phone\nIP: $ip\n\nMessage:\n$message\n";
$headers="From: MIYO Global <$FROM>\r\n".'Reply-To: '.$clean($name).' <'.$clean($email).">\r\n"."Content-Type: text/plain; charset=UTF-8\r\n";
if(@mail($TO,$subject,$body,$headers)){echo json_encode(['ok'=>true]);}
else{http_response_code(500);echo json_encode(['ok'=>false,'error'=>'Could not send right now. Please email staffing@miyoglobal.com directly.']);}
