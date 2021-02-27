<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
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
	    .step .second{
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
			<div>
				<p>${param.name}님의  ${param.mail}메일 계정으로 로그인하여 수신된 메일을 통해 인증을 마무리 하시면 회원가입 절차가 마무리 됩니다.</p> 
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
