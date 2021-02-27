<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
	<style>
		
	</style>
</head>
<body>
	<div>
		<h3>현재 비밀번호를 입력해주세요.</h3>
		<input id ="pw" type="password"> <input id="button" type="button" value="탈퇴하기">
	</div>
	
	
</body>
<jsp:include page="includeJSP/baseJS.jsp" flush="false"/>
<script src="${pageContext.request.contextPath}/resources/js/secession.js?version=<%=System.currentTimeMillis() %>"></script>
<script type="text/javascript"></script>
</html>
