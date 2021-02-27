<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<title>로그인 페이지</title>
	<style>
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
	</style>
</head>
<body>
	<div class="wrap-loading display-none">
		<div><img src="${pageContext.request.contextPath}/resources/img/loading.gif" /></div>
	</div> 
	<div>
		<h4>가입시 입력한 메일주소를 입력해주세요.</h4>
		<h4>해당 이메일로 비밀번호를 발송해드립니다.</h4>
		<input id="mail" type = "text" placeholder="이메일"><br> 
 		<input id="button" type="button" value="발송하기">
	</div>
</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/findInfo.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</html>
