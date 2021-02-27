<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
	<title>Programmers TODO</title>
	<link href="https://fonts.googleapis.com/css?family=Baloo+Bhai|Do+Hyeon&display=swap" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/login.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/resources/css/background.css">
	<link rel="stylesheet" type="text/css" media="(min-width :1025px)" href="${pageContext.request.contextPath}/resources/css/background.css">
	<style>
		.display-none-Chrome{
			display:none;
		}
	</style>
</head>
<body>
	<div class="wrap-loading display-none-Chrome" >
		<div style="color:white; width:500px; top:50px; left:30%;
					border-radius:15px; border : 3px solid white;
					background:black; ">
			<h1>인터넷 익스플로러 브라우저에서는 이용하실 수 없습니다.</h1>
			<h1>이 웹페이지는 크롬(Chrome)에서 가장 이상적으로 동작합니다.</h1>
		</div>
	</div>
	<div class="whole">
		<div class="title">
			<h1>Programmers TODO</h1>
		</div>
		<div class="contents">
			<div class="inputs">
				<input type="text" name="mail" placeholder="mail"></br>
				<input type="password" name="password" placeholder="password">
			</div>
			<div class="buttons">
				<input id="signUp" type="button" value="Sign Up">
				<input id="login" type="button" value="Login">
			</div>
			<div>
				<input id="findPW" type="button" value="forgot my Password">
			</div>
		</div>
	</div>
	<div class="findPWForm">
		<h3>Find PassWord</h1>
		<div>메일을 입력해주시면, 해당 메일로 비밀번호를 발송해드립니다.</div>
		<input type="text" name="mail" placeholder="mail">
		<div>
			<input type="button" name="send" value="send">
			<input type="button" name="cancel"value="cancel">
		</div>
	</div>
	
	<jsp:include page="baseJS.jsp" flush="false"/>
	<script src="${pageContext.request.contextPath}/resources/js/login.js?version=<%=System.currentTimeMillis() %>"></script>
	<script type="text/javascript"></script>
	<script>
		(function checkBrowser(){
			var agent = navigator.userAgent.toLowerCase();
	
			if (!(agent.indexOf("chrome") != -1)) {
				if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
					$('.wrap-loading').removeClass('display-none-Chrome');
				}
				else{
					const msg =" 이 웹페이지는 크롬(Chrome)에서 가장 이상적으로 작동합니다. \n"
						  +" 이외의 브라우저에서는 정상 작동하지 않을 수 있습니다. \n\n";
					alert(msg);
				}
			}
		})()
	</script>
</body>
</html>
