<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<title>회원가입</title>
	<style type="text/css">
		
		.wrap-loading{ /*화면 전체를 어둡게 합니다.*/
		    position: fixed;
		    left:0;
		    right:0;
		    top:0;
		    bottom:0;
		    background: rgba(0,0,0,0.2); /*not in ie */
		    filter: progid:DXImageTransform.Microsoft.Gradient(startColorstr='#20000000', endColorstr='#20000000');    /* ie */    
		}
    	.wrap-loading div{ /*로딩 이미지*/
        	position: fixed;
        	top:50%;
        	left:50%;
        	margin-left: -21px;
        	margin-top: -21px;
    	}
    	.display-none{ /*감추기*/
	        display:none;
	    }
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
	    	background-color : #738080;
	    	color : white;
	    	margin-left : 12%;
	    }
	    
	    input{
	    	margin-left : 36%;
	    }
	    
	</style>
</head>
<body>
	<div class="wrap-loading display-none">
		<div><img src="${pageContext.request.contextPath}/resources/img/loading.gif" /></div>
	</div> 
	<div class="content">
		
		<div class="title">
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
			<input id="name" type="text" placeholder="이름"></br>
			<input id="mail" type="text" placeholder="이메일">
			<select id="mailForm">
				<option value="">직접입력</option>
				<option value="@naver.com">@naver.com</option>
				<option value="@daum.net">@daum.net</option>
				<option value="@gmail.com">@gmail.com</option>
			</select>
			</br>
			<input id="mailCheck" type="button" value="중복확인"></br>
			<input id="pw" type="password" placeholder="비밀번호"></br>
			<input id="pwCheck"type="password" placeholder="비밀번호 확인"></br>
			<input id="signup" type="button" value="회원가입">
		</div>
	</div>

</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/signup.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</html>
