<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<title></title>
	<style>
		.step{
	    	width : 100%;
	    	height : 130px;
	    	text-align : center;
	    }
	    
	    .step div{
	    	float : left;
	    	border : 1px solid black;
	    	border-radius : 5px;
	    	width : 25%;
	    	height : 100px;
	    	margin-top : 5px;
	    	margin-left : 10px;
	    	line-height : 30px;
	    }
	    .step .first{
	    	margin-left : 12%;
	    }
	    .step .third{
	    	background-color : #738080;
	    	color : white;
	    }
	</style>
</head>
<body>
	<div class="content">
		<div class ="title">
			<h3>회원가입</h3>
		</div>
		<div class="step">
			<div class="first">
				1단계 : <br>개인정보 입력
			</div>
			<div class="second">
				2단계 : <br>이메일 인증
			</div>
			<div class="third">
				3단계 : <br>회원가입 완료
			</div>
		</div>
		<div>
			<div style="margin-left:25%;">
				<p>회원가입 절차가 모두 완료되었습니다.</p>
				<p>로그인을 통해 서비스를 이용하실 수 있습니다.</p>
				<input id="button" type="button" value = "로그인 화면으로">  
			</div>
		</div>
	</div>

</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script type="text/javascript"></script>
<script>
$("#button").on("click", ()=>{
	window.location.href="/nowriting/login";
});
</script>

</html>
