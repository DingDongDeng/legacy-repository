<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		.wrap-loading{ /*화면 전체를 어둡게 합니다.*/
		    position: fixed;
		    left:0;
		    right:0;
		    top:0;
		    bottom:0;
		    background: rgba(0,0,0,0.7); /*not in ie */
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
	    
	    .content{

	    }
	    
	  
		
	</style>
</head>
<body>
<div class="wrap-loading display-none">
	<div style="color:white; width:50%; height:200px; margin-left:-25%;
				border-radius:15px; border : 3px solid white;">
		<h1>인터넷 익스플로러 브라우저에서는 이용하실 수 없습니다.</h1>
		<h1>이 웹페이지는 크롬(Chrome)에서 가장 이상적으로 동작합니다.</h1>
	</div>
</div> 
<div class="section">
	<div class="header" ></div>
	<div style="text-align:center;"> <h1>Nowriting</h1></div>
	<div class="content">
		<div>
			<div>
				<input style="float:right; margin-right: 48px;" id="idSaveCheck" type="checkbox">
				<div  style="text-align:center;">
					<input  style="margin-left: 62px;"id="mail" type="text" placeholder="이메일"><br>
					<input id="pw" type="password" placeholder="비밀번호">
				</div>
								
				<div style="text-align:center;">
					<input id="login"type="button" value ="로그인">
					<input id="signup"type="button" value="회원가입">
					<input id="findInfo" type="button" value = "비밀번호 찾기">
				</div>	
			</div>
		</div>
	</div>
	<div class="footer">
		<div style="text-align:center;">
			<input type="radio" name="task" value = "pc" checked="checked"> PC
			<input type="radio" name="task" value = "mobile"> 모바일
			<input type="radio" name="task" value= "camera"> 사진촬영
		</div>
	</div>	
</div>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/login.js?version=<%=System.currentTimeMillis() %>"></script>
<script src="${pageContext.request.contextPath}/resources/js/cookie.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</body>


</html>
